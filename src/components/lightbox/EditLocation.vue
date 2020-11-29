<template>
<div>

    <div id="map-preview-div"></div>
    <label for="address">{{ $t('message.Location') }}</label>
    <b-input-group>
        <b-form-input type="text" v-model="address"></b-form-input>

        <b-input-group-append>
            <b-button 
                variant="outline-secondary"
                @click="addressSearch">
                {{ $t('message.Search') }}
            </b-button>
        </b-input-group-append>
    </b-input-group>

    <Loading v-if="busy" />

    <b-alert variant="danger" v-model="showError">
        {{ errorMessage }}
    </b-alert>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import APIException from '@/models/data/api_exception';
import { BModal } from 'bootstrap-vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import config from '../../config';
import Loading from '../../components/common/Loading.vue';
import store from '../../store/store';
import Location from '../../models/data/location';

@Component({
  components: {
      Loading,
  },
})
export default class EditLocation extends Vue {

    public address: string = '';

    public latitude: number = 0;

    public longitude: number = 0;

    public busy: boolean = false;

    public errorMessage: string = '';

    public get showError(): boolean {
        if (this.errorMessage && this.errorMessage.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    private map?: L.Map;
    private marker?: L.Marker;

    public initialise(latitude: number, longitude: number) {
        // window.console.log(`EditLocation.initialise()`);

        this.latitude = latitude;
        this.longitude = longitude;

        this.$nextTick(() => this.renderMap([latitude, longitude]));
    }

    public Redraw() {

        if (this.map) {
            const map = this.map;
            // needed to render correctly
            window.setTimeout(() => map.invalidateSize(), 100);
        }
    }

    private renderMap(location: [number, number]) {
        const tileOptions = {
                token: config.MapboxToken,
                detectRetina: true,
                zoomOffset: -1,
                tileSize: 512,
        } as L.TileLayerOptions;

        const tiles = L.tileLayer(config.MapboxTileAPi, tileOptions);

        const mapOptions = {
            center: location,
            zoom: 8,
            zoomControl: false,
            minZoom: 2,
            scrollWheelZoom: true,
            maxBounds: [[-90, -150], [90, 150]],
            layers: [tiles],
        } as L.MapOptions;

        this.map = L.map('map-preview-div', mapOptions);

        delete (L.Icon.Default.prototype as any)._getIconUrl;

        L.Icon.Default.mergeOptions({
          iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
          iconUrl: require('leaflet/dist/images/marker-icon.png'),
          shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
        });

        this.map.addControl(L.control.zoom({ position: 'bottomleft' }));

        this.marker = L.marker(location).addTo(this.map);
        const map = this.map;

        // needed to render correctly
        window.setTimeout(() => map.invalidateSize(), 100);
    }

    private async addressSearch() {
        // window.console.log(`EditLocation.addressSearch()`);
        // window.console.log(`this.address: ${this.address}`);

        try {
            this.errorMessage = '';
            this.busy = true;
            const options: AxiosRequestConfig = {
                url: `${config.BaseApiUrl}${config.LocationApi}?address=${this.address}`,
                headers: store.getters.ajaxHeader,
                method: 'GET',
                responseType: 'json',
            };

            const response = await axios.request(options) as AxiosResponse<Location>;
            // window.console.log(response);

            this.latitude = response.data.latitude;
            this.longitude = response.data.longitude;

            this.$emit('locationChanged', response.data);

            if (this.map && this.marker) {
                this.map.removeLayer(this.marker);
                this.map.panTo(new L.LatLng(this.latitude, this.longitude));
                this.marker = L.marker([this.latitude, this.longitude]).addTo(this.map);
            }

        } catch (ex) {
            const axiosError = ex as AxiosError<APIException>;
            this.errorMessage = axiosError?.response?.data?.detail || ex.toString();
        }

        this.busy = false;
    }
}
</script>


<style scoped>
#map-preview-div {
    height: 250px; 
    width: 100%;
    margin-bottom: 20px;
}
</style>
