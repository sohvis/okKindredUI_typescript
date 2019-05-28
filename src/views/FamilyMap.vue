<template>
  <div class="fullscreen_map">
    <div id="person-map" class="fullscreen_map"></div>
  </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import * as request from 'request-promise-native';

export default {
  name: 'FamilyMap',

  mounted() {

      window.console.log('FamilyMap.vue mounted() call');

      // Load jwt from cookie and login
      this.$store.dispatch('restoreSession')
        .then(async (loggedIn) => {

        window.console.log(`loggedIn: ${loggedIn}`);

        if (loggedIn) {
          await this.loadMapPoints();
        } else {
          this.$router.push('/accounts/login/');
        }
      });

  },

  methods: {
      async loadMapPoints() {

        window.console.log('loadMapPoints() call');
        this.$store.commit('updateLoading', true);

        const options = {
            uri: `${this.$config.BaseApiUrl}${this.$config.PersonAPI}`,
            headers: this.$store.getters.ajaxHeader,
            json: true,
        };

        const response = await request.get(options);
        window.console.debug(response);
        this.loadMap(response);

        this.$store.commit('updateLoading', false);
      },


      loadMap(data) {

        // Remove data points without a longitude and latitude
        const filteredData = data.filter((value) => {
          return value.longitude !== 0 && value.latitude !== 0;
        });

        const tiles = L.tileLayer('https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.jpg70?access_token={token}', {
          token: this.$config.MapboxToken,
        });

        let center = [53.421458, -2.560874]; // Warrington by default!

        window.console.log(`this.$store.state.person_id: ${this.$store.state.person_id}`);
        const focusedPeople = filteredData.filter((value) => {
          return value.id === this.$store.state.person_id;
        });

        window.console.log(focusedPeople);

        if (focusedPeople.length > 0) {
          center = [focusedPeople[0].latitude, focusedPeople[0].longitude];
        }

        const map = L.map('person-map', {
            center,
            zoom: 6,
            zoomControl: true,
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

        map.addControl( L.control.zoom({position: 'bottomleft'}));

        this.displayMapPoints(map, filteredData);
      },

      displayMapPoints(map, data) {

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
                    <a href="/profile/${loc.id}">
                        <img src="${imageUrl}" alt="${loc.name}"/>
                        ${loc.name}
                    </a>
                </div>
              </div>
            `;

            // window.console.debug(html);

            const marker = L.marker(new L.LatLng(loc.latitude, loc.longitude), { title: loc.name });
            marker.bindPopup(html);
            markers.addLayer(marker);
        }

        map.addLayer(markers);

      },
  },
};
</script>

<!-- "scoped" attribute removed to fill screen -->
<style>
  html, body, .fullscreen_map {
    height:100%;
    width:100%;
    padding:0px;
    margin:0px;
    overflow: hidden;
  }

  #app {
    height:100%;
  }

  .map-popup-container {
    overflow: hidden; 
    width:90px;
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
