<template>
    <div id="person-map" class="fullscreen_map"></div>
</template>


<script>
// Not using typescript with this as no offical bindings for Leaflet
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import * as request from 'request-promise-native';
import store from '../store/store';

export default {
  name: 'FamilyMap',
  data() {
    return {
      map: null,
    };
  },

  mounted() {
    window.console.log('FamilyMap.vue mounted() call');
    window.addEventListener('resize', this.initializeSize, false);
  },

  methods: {

      initializeSize() {
        const personMap = document.getElementById('person-map');
        const computedStyle = window.getComputedStyle(personMap);

        if (computedStyle.display !== 'none') {
          const height = window.innerHeight - personMap.getBoundingClientRect().top - 10;
          personMap.style.height = `${height}px`;
          personMap.style.width = `${window.innerWidth - 10}px`;
        }
      },

      renderMap() {

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

        const tiles = L.tileLayer('https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.jpg70?access_token={token}', {
          token: this.$config.MapboxToken,
        });

        let center = [53.421458, -2.560874]; // Warrington by default!

        window.console.log(`this.$store.state.person_id: ${this.$store.state.person_id}`);
        const focusedPeople = filteredData.filter((value) => {
          return value.id === parseInt(this.$store.state.person_id, 10);
        });

        window.console.log(focusedPeople);

        if (focusedPeople.length > 0) {
          center = [focusedPeople[0].latitude, focusedPeople[0].longitude];
        }

        this.map = L.map('person-map', {
            center,
            zoom: 10,
            zoomControl: false,
            minZoom: 2,
            scrollWheelZoom: true,
            detectRetina: true,
            maxBounds: [[-90, -150], [90, 150]],
            layers: [tiles],
        });

        // Ugh! seriously? https://stackoverflow.com/questions/50864855/vue-js-leaflet-marker-is-not-visible
        delete L.Icon.Default.prototype._getIconUrl;

        L.Icon.Default.mergeOptions({
          iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
          iconUrl: require('leaflet/dist/images/marker-icon.png'),
          shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
        });

        this.map.addControl( L.control.zoom({position: 'bottomleft'}));

        this.displayMapPoints(filteredData);

        // Selected person sync
        this.map.on('popupopen', (e) => {
            window.console.log(e.popup._source.options.id.toString());
            store.dispatch('changePerson', e.popup._source.options.id.toString());
        });
      },

      displayMapPoints(data) {

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

            // window.console.debug(html);

            const marker = L.marker(new L.LatLng(loc.latitude, loc.longitude), { id: loc.id , title: loc.name });
            marker.bindPopup(html);
            markers.addLayer(marker);
        }

        this.map.addLayer(markers);
      },
  },
};
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

</style>
