<template>
    <div>
      <div id="gallery-map" class="fullscreen_map" @click="mapClick"></div>
      <GalleryMapActionButton :galleryId="galleryId" />
      <PhotoSwipeView ref="photoSwipeView" @imageEdited="imageEdited"/>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop} from 'vue-property-decorator';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import store from '../../store/store';
import config from '../../config';
import PagedResult from '../../models/data/paged_results';
import Gallery from '../../models/data/gallery';
import Image from '../../models/data/image';
import GalleryMapActionButton from '../../components/gallery_map/GalleryMapActionButton.vue';
import PhotoSwipeView from '../../components/lightbox/PhotoSwipeGalleryView.vue';


@Component({
  components: {
    GalleryMapActionButton,
    PhotoSwipeView,
  },
})
export default class GalleryMap extends Vue {

    @Prop()
    public galleryId?: number;

    public images: Image[] = [];

    public map?: L.Map;

    protected async mounted() {
        // window.console.log('GalleryMap.vue mounted() call');

        try {
            this.initializeSize();

            // Load jwt from cookie and login
            await store.dispatch('restoreSession');
        } catch (ex) {
            // window.console.log(`ex: ${ex}`);
            this.$router.push(`/accounts/login/?next=${this.$router.currentRoute.fullPath}`);
        }

        await this.loadData();
        this.renderMap();

        const mapDiv = document.getElementById('gallery-map') as HTMLDivElement;
        if (mapDiv && mapDiv.offsetParent) {
          const newMapDivTop = mapDiv.getBoundingClientRect().top;
          this.monitorHeightChange(newMapDivTop);
        }

        store.dispatch('updateRouteLoaded');
    }

    private initializeSize() {
        // window.console.log('GalleryMap.initializeSize()');

        const mapDiv = document.getElementById('gallery-map') as HTMLDivElement;
        const computedStyle = window.getComputedStyle(mapDiv);

        if (mapDiv.offsetParent) {
          const height = window.innerHeight - mapDiv.getBoundingClientRect().top - 10;
          mapDiv.style.height = `${height}px`;
          mapDiv.style.width = `${window.innerWidth - 10}px`;
        }
    }

    private async loadData() {
        // window.console.log(`GalleryMap.loadData()`);

        store.commit('updateLoading', true);

        try {

            const imageTask = this.loadImageData();
            await imageTask;

        } catch (ex) {
            store.commit('setErrorMessage', ex);
        }

        store.commit('updateLoading', false);
    }

    private async loadImageData() {
        // window.console.log('GalleryMap.loadImageData()');

        try {
            // Load page 1 to find out number of results
            const firstResponse = await this.loadImageFromPage(1);
            this.images = firstResponse.results;

            const pageCount = PagedResult.PAGE_COUNT(firstResponse.count);

            // window.console.log(`pageCount: ${pageCount}`);

            if (pageCount > 1) {
                const tasks = new Array<Promise<PagedResult<Image>>>();
                for (let page = 2; page <= pageCount; page++) {
                    tasks.push(this.loadImageFromPage(page));
                }

                const responses = await Promise.all(tasks);

                for (const response of responses) {
                    this.images.push(...response.results);
                }
            }

        } catch (ex) {
            store.commit('setErrorMessage', ex);
        }
    }

    private async loadImageFromPage(pageNo: number): Promise<PagedResult<Image>> {
        // window.console.log(`GalleryMap.loadImageFromPage(pageNo: ${pageNo})`);
        const options: AxiosRequestConfig = {
            url: `${config.BaseApiUrl}${config.ImageAPI}?page=${pageNo}&gallery_id=${this.galleryId}`,
            headers: store.getters.ajaxHeader,
            method: 'GET',
            responseType: 'json',
        };

        const response = await axios.request(options) as AxiosResponse<PagedResult<Image>>;
        // window.console.log(response);
        return response.data;
    }

    private renderMap() {
        // window.console.log('GalleryMap.renderMap()');

        // Remove data points without a longitude and latitude
        const filteredData = this.images.filter((value) => {
          return value.longitude !== 0 && value.latitude !== 0;
        });

        // Remove any existing map
        if (this.map) {
          this.map.off();
          this.map.remove();
        }

        const tileOptions = {
                token: config.MapboxToken,
                detectRetina: true,
                zoomOffset: -1,
                tileSize: 512,
        } as L.TileLayerOptions;

        const tiles = L.tileLayer(config.MapboxTileAPi, tileOptions);

        const mapOptions = {
            center: this.getCentre(filteredData),
            zoom: 8,
            zoomControl: false,
            minZoom: 2,
            scrollWheelZoom: true,
            maxBounds: [[-90, -150], [90, 150]],
            layers: [tiles],
        } as L.MapOptions;

        this.map = L.map('gallery-map', mapOptions);

        // https://stackoverflow.com/questions/50864855/vue-js-leaflet-marker-is-not-visible
        delete (L.Icon.Default.prototype as any)._getIconUrl;

        L.Icon.Default.mergeOptions({
          iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
          iconUrl: require('leaflet/dist/images/marker-icon.png'),
          shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
        });

        this.map.addControl(L.control.zoom({ position: 'bottomleft' }));

        this.displayMapPoints(filteredData);

        const map = this.map;
        // needed to render correctly
        window.setTimeout(() => map.invalidateSize(), 100);
    }

    private getCentre(data: Image[]): [number, number] {
        for (const point of data) {
            if (point.latitude !== 0 && point.longitude !== 0) {
                return [point.latitude, point.longitude];

            }
        }

        return config.DefaultLocation;
    }

     private displayMapPoints(data: Image[]) {
        // window.console.log('GalleryMap.displayMapPoints()');

        const markers = L.markerClusterGroup();

        for (const point of data) {

          const html = `
              <div style="width:${point.thumbnail_width}px; height:${point.thumbnail_height}px;">
                <img id="map-thumb-${point.id}" class="gallery-map-thumb"
                  src="${point.thumbnail}" alt="${point.title}"/>
              </div>
            `;

          const marker = L.marker(new L.LatLng(point.latitude, point.longitude));
          marker.bindPopup(html);
          markers.addLayer(marker);
        }

        if (this.map) {
          this.map.addLayer(markers);
        }
     }

    private async mapClick(e: MouseEvent) {
      // window.console.log(`GalleryMap.mapClick(e:`);
      // window.console.log(e);

      let index = 0;
      // find which image got clicked
      for (const image of this.images) {
        const divId =  `map-thumb-${image.id}`;
        const div = document.getElementById(divId) as HTMLDivElement;

        if (div) {

          const rect = div.getBoundingClientRect();
          if (rect) {
            if (rect.left < e.clientX && e.clientX < rect.right) {
              if (rect.top < e.clientY && e.clientY < rect.bottom) {
                // window.console.log(rect);
                await this.imageClick(image.id, index);
              }
            }
          }
        }

        index++;
      }
    }

    private async imageClick(imageId: number, index: number) {
        // window.console.log(`GalleryMap.imageClick(imageId: ${imageId})`);

        if (this.galleryId) {

            await (this.$refs.photoSwipeView as PhotoSwipeView).init(
                    this.images,
                    index,
                    0,
                    this.images.length,
                    this.galleryId,
                    true);
        }
    }

    private imageEdited(image: Image) {
        // window.console.log(`GalleryMap.imageEdited(imageId: ${image.id}`);

        let index = 0;
        for (index = 0; index < this.images.length; index++) {
            if (image.id === this.images[index].id) {
                this.images[index] = image;
                this.renderMap();
                return;
            }
        }
    }

    private monitorHeightChange(previousTop: number) {
      // window.console.log('GalleryMap.monitorHeightChange()');

      const mapDiv = document.getElementById('gallery-map') as HTMLDivElement;

      if (mapDiv && this.map) {
        if (mapDiv.offsetParent) {
          // If height has reduced, we need to redraw canvas
          const newMapDivTop = mapDiv.getBoundingClientRect().top;

          if (newMapDivTop + 10 < previousTop) {
            this.initializeSize();
            this.map.invalidateSize();
          }

          window.setTimeout(() => this.monitorHeightChange(newMapDivTop), 1000);
        }
      }
    }
}
</script>

<style scoped>
.fullscreen_map {
  padding:0px;
  margin:0px;
  overflow: hidden;
}
</style>

<style>
  .gallery-map-thumb {
    cursor: pointer;
  }
</style>
