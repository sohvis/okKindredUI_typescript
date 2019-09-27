<template>
    <div id="person-map" class="fullscreen_map">
      <b-alert class="map-alert" 
          v-model="showAlert" 
          variant="danger" 
          dismissible
          @dismissed="onAlertDismissed">
        <strong>{{ alert }}</strong>
      </b-alert>
    </div>
</template>


<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import * as request from 'request-promise-native';
import store from '../store/store';
import Person from '../models/data/person';
import MapMarkerOptions from '../models/map/map_marker_options';
import config from '../config';


@Component({
  components: {
  },
})
export default class FamilyMap extends Vue {

  public map: L.Map | null = null;

  public mapSelectedPersonId: string = '';

  public alert: string = '';

  public get showAlert(): boolean {
    return this.alert.length > 0;
  }

  public set showAlert(value: boolean) {
    if (!value) {
      this.alert = '';
    }
  }

  public get selectedPersonId(): string {
    return store.state.person_id;
  }

  public renderMap() {
    window.console.log('FamilyMap.renderMap()');

    this.initializeSize();

    const data = store.state.people;

    // Remove data points without a longitude and latitude
    const filteredData = data.filter((value) => {
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
        } as L.TileLayerOptions;

    const tiles = L.tileLayer('https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.jpg70?access_token={token}',
                              tileOptions,
    );

    let location = config.DefaultLocation; // Warrington by default!

    const selectedPerson = store.getters.selectedPerson as Person;
    window.console.log('selectedPerson:');
    window.console.log(selectedPerson);

    this.mapSelectedPersonId = selectedPerson.id;
    if (selectedPerson.latitude !== 0 && selectedPerson.longitude !== 0) {
      location = [selectedPerson.latitude, selectedPerson.longitude];
      this.alert = '';
    } else {
      this.alert = this.$t('message.LocationForPersonNotSpecified') as string;
    }


    const mapOptions = {
        center: location,
        zoom: 8,
        zoomControl: false,
        minZoom: 2,
        scrollWheelZoom: true,
        maxBounds: [[-90, -150], [90, 150]],
        layers: [tiles],
    } as L.MapOptions;

    this.map = L.map('person-map', mapOptions);

    // Ugh! seriously? https://stackoverflow.com/questions/50864855/vue-js-leaflet-marker-is-not-visible
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });

    this.map.addControl( L.control.zoom({position: 'bottomleft'}));

    this.displayMapPoints(filteredData);

    // Selected person sync
    this.map.on('popupopen', (e: any) => {
        window.console.log(`Map.popupopen`);

        const newPerson = e.popup._source.options.personId as string;
        this.mapSelectedPersonId = newPerson;
        store.dispatch('changePerson', newPerson);
    });
  }

  protected mounted() {
    window.console.log('FamilyMap.vue mounted() call');
    window.addEventListener('resize', this.initializeSize, false);
  }

  @Watch('selectedPersonId')
  private centerOnSelectedPerson() {

    const personMap = document.getElementById('person-map') as HTMLDivElement;

    if (personMap && personMap.parentNode && this.map && personMap.clientHeight > 0) {
      let location = [53.421458, -2.560874] as [number, number]; // Warrington by default!

      const selectedPerson = store.getters.selectedPerson as Person;

      if (this.mapSelectedPersonId !== selectedPerson.id) {
        if (selectedPerson.latitude !== 0 && selectedPerson.longitude !== 0) {
          location = [selectedPerson.latitude, selectedPerson.longitude];

          this.alert = '';
          this.map.flyTo(location);
        } else {
          this.alert = this.$t('message.LocationForPersonNotSpecified') as string;
        }
      }
    }

  }

  private initializeSize() {
    const personMap = document.getElementById('person-map') as HTMLDivElement;

    if (personMap.parentNode) {
      const height = window.innerHeight - personMap.getBoundingClientRect().top - 10;
      personMap.style.height = `${height}px`;
      personMap.style.width = `${window.innerWidth - 10}px`;
    }
  }

  private displayMapPoints(data: Person[]) {

    const markers = L.markerClusterGroup();

    for (const loc of data) {
        let imageUrl;
        if (loc.small_thumbnail) {
            imageUrl = loc.small_thumbnail;
        } else {
            imageUrl = 'img/portrait_80.png';
        }

        const html = `
          <div class="map-popup-container">
            <div class="map-popup-content">
              <img src="${imageUrl}" alt="${loc.name}"/>
              ${loc.name}
            </div>
          </div>
        `;

        const options = new MapMarkerOptions(loc.id);
        options.title = loc.name;
        const marker = L.marker(new L.LatLng(loc.latitude, loc.longitude), options);
        marker.bindPopup(html);
        markers.addLayer(marker);
    }

    if (this.map) {
      this.map.addLayer(markers);
    }
  }

  private onAlertDismissed() {
    this.alert = '';
  }
}
</script>

<!-- "scoped" attribute removed to fill screen -->
<style scoped>
  .fullscreen_map {
    padding:0px;
    margin:0px;
    overflow: hidden;
  }
</style>

<style>
  .map-popup-container {
    overflow: hidden; 
    width:90px;
    max-width:90px;
  }

  .map-popup-content {
    text-align: center;
    width: 90px;
    height: 115px;
    float: left;
  }

  .map-popup-content img {
    display: block;
    margin: 0 auto;
  }

  .map-alert{
    margin-top: 5px;
    margin-left: 5px;
    margin-right: 5px;
    z-index: 1050;
  }
</style>
