<template>
<b-modal
        ref="modal"
        button-size="lg"
        class="super-modal"
        hide-footer
        hide-header
        @hidden="onHidden">
    <div>
        <span class="oi oi-x top-corner" @click="closeClicked"></span>
        <div id="map-div" v-bind:style="mapDivStyle"></div>
    </div>
    </b-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { BModal } from 'bootstrap-vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import config from '../../config';

@Component({
  components: {
  },
})
export default class MapPopUp extends Vue {

    public mapDivStyle: any = {
        position: 'relative',
        width: '100%',
        height: '100px',
    };

    public show(location: [number, number]) {

        // window.console.log(`MapPopUp.show(location: ${location})`);

        // Set map to half of window height
        this.mapDivStyle.height = `${window.innerHeight / 2}px`;

        (this.$refs.modal as BModal).show();

        this.$nextTick(() => this.renderMap(location));
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
            zoom: 14,
            zoomControl: false,
            minZoom: 2,
            scrollWheelZoom: true,
            maxBounds: [[-90, -150], [90, 150]],
            layers: [tiles],
        } as L.MapOptions;

        const map = L.map('map-div', mapOptions);

        // https://stackoverflow.com/questions/50864855/vue-js-leaflet-marker-is-not-visible
        delete (L.Icon.Default.prototype as any)._getIconUrl;

        L.Icon.Default.mergeOptions({
          iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
          iconUrl: require('leaflet/dist/images/marker-icon.png'),
          shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
        });

        map.addControl(L.control.zoom({ position: 'bottomleft' }));

        L.marker(location).addTo(map);

        // needed to render correctly
        window.setTimeout(() => map.invalidateSize(), 100);
    }

    private closeClicked() {
        (this.$refs.modal as BModal).hide();
    }

    private onHidden() {
        this.$emit('onHidden');
    }
}
</script>


<style scoped>
.top-corner {
    position: absolute;
    right: 3px;
    top: 3px;
    font-size: 1.3em;
    cursor: pointer;
    z-index: 1030;
    color: white;
    background-color: gray;
    border-style: solid;
    border-width: 1px;
    border-color: gray; 
    border-radius: 4px;
    padding-top: 2px;
    padding-bottom: 6px;
    padding-left: 4px;
    padding-right: 4px;
}

.top-corner:hover {
    color: gray;
    background-color: black;
    border-color: black; 
}
</style>
