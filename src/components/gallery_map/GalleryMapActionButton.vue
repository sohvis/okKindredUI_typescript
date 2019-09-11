<template>
    <div class="controls-container">
        <b-button
            variant="outline-primary"
            class="gallery-button action-button"
            @click="galleryButtonClicked">
            <span class="oi oi-grid-three-up"></span>
        </b-button>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop} from 'vue-property-decorator';
import store from '../../store/store';
import config from '../../config';
import Gallery from '../../models/data/gallery';


@Component({
  components: {
  },
})
export default class GalleryMapActionButton extends Vue {

    @Prop({ default: 0 })
    public galleryId?: number;

    private galleryButtonClicked() {
        if (this.galleryId) {
            this.$router.push(`/gallery/${this.galleryId}/`);
        }
    }

}
</script>

<style scoped>

.controls-container {
    float: right; 
    right: 0;  
    top: 40px;
    z-index: 1000;
    position: absolute !important;
}

.gallery-button {
    border-radius: 50%;
    font-size: 1.2em;
    margin-right:5px;
    margin-left:5px;
    margin-top: 5px;
}

.action-button {
    padding-left: 15px;
    padding-right: 14px;
    padding-top: 10px;
    padding-bottom: 10px;
}
</style>
