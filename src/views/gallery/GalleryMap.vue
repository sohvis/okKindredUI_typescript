<template>
    <div>
      <GalleryHeader 
        ref="galleryHeader"
        :galleryId="galleryId"
        :selectedImageIds="selectedImageIds"
        @editModeChanged="editModeChanged"
        @imagesDeleted="imagesDeleted" />

      <div id="gallery-map" class="fullscreen_map"></div>
       <!-- <PhotoSwipeView ref="photoSwipeView" @imageEdited="imageEdited"/> -->
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop} from 'vue-property-decorator';
import * as request from 'request-promise-native';
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
import GalleryHeader from '../../components/gallery/GalleryHeader.vue';
import PhotoSwipeView from '../../components/lightbox/PhotoSwipeGalleryView.vue';


@Component({
  components: {
    GalleryHeader,
    PhotoSwipeView,
  },
})
export default class GalleryMap extends Vue {

    @Prop()
    public galleryId?: number;

    public get loading(): boolean {
        return store.getters.loading;
    }

    public images: Image[] = [];


    protected async mounted() {
        window.console.log('GalleryView.vue mounted() call');

        try {
            // Load jwt from cookie and login
            await store.dispatch('restoreSession');
            await this.loadData();

        } catch (ex) {
            window.console.log(`ex: ${ex}`);
            this.$router.push(`/accounts/login/?next=${this.$router.currentRoute.fullPath}`);
        }
    }

    private async loadData() {
        window.console.log(`GalleryMap.loadData()`);

        store.commit('updateLoading', true);

        try {

            const imageTask = this.loadImageData();
            const headerTask = (this.$refs.galleryHeader as GalleryHeader).loadGalleryData();
            await imageTask;
            await headerTask;

        } catch (ex) {
            store.commit('setErrorMessage', ex);
        }

        store.commit('updateLoading', false);
    }

    private async loadImageData() {

        try {
            const options = {
                uri: `${config.BaseApiUrl}${config.ImageAPI}?page=1&gallery_id=${this.galleryId}`,
                headers: store.getters.ajaxHeader,
                json: true,
            };

            const response = await request.get(options) as PagedResult<Image>;

            this.images = response.results;

        } catch (ex) {
            store.commit('setErrorMessage', ex);
        }
    }


    private async imageClick(imageId: number, rowIndex: number) {
        window.console.log(`GalleryView.imageClick(imageId: ${imageId}, rowIndex: ${rowIndex}`);

        if (this.galleryId) {
            const index = this.images.findIndex((item) => item.id === imageId);

            // await (this.$refs.photoSwipeView as PhotoSwipeView).init(
            //         this.images,
            //         index,
            //         this.page,
            //         this.totalCount,
            //         this.galleryId);
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
