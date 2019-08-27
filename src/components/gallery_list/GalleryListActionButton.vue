<template>

    <div class="controls-container">
        <transition name="slide-fade">
            <b-button
                v-if="opened"
                variant="success"
                class="gallery-list-button add-button"
                @click="addGalleryClicked">
                <sup>
                    <small>
                        <span class="oi oi-plus"></span>
                    </small>
                </sup>
                <span class="oi oi-folder"></span>
            </b-button>
        </transition>
        <transition name="slide-fade">
            <b-button
                v-if="opened"
                variant="danger"
                class="gallery-list-button delete-button"
                :disabled="!deleteEnabled"
                @click="deleteClicked">
                <span class="oi oi-trash"></span>
            </b-button>
        </transition>
        <b-button
            v-if="opened"
            variant="primary"
            class="gallery-list-button close-button"
            @click="menuButtonClicked">
            <span v-if="opened" class="oi oi-x"></span>
        </b-button>

        <b-button
            v-if="!opened"
            variant="outline-primary"
            class="gallery-list-button action-button"
            @click="menuButtonClicked">
            <span class="oi oi-menu"></span>
        </b-button>

        <AddGallery 
            ref="addGallery" 
            @galleryCreated="galleryCreated" />

        <DeleteGalleries 
            ref="deleteGalleries" 
            @galleriesDeleted="galleriesDeleted" />
    </div>

</template>

<script lang="ts">
import { Component, Vue, Watch, Prop} from 'vue-property-decorator';
import store from '../../store/store';
import config from '../../config';
import AddGallery from './AddGallery.vue';
import DeleteGalleries from './DeleteGalleries.vue';

@Component({
  components: {
      AddGallery,
      DeleteGalleries,
  },
})
export default class GalleryListActionButton extends Vue {

    @Prop({ default: () => [] })
    public selectedGalleryIds?: number[];

    public get deleteEnabled(): boolean {

        if (this.selectedGalleryIds) {
            return this.selectedGalleryIds.length > 0;
        } else {
            return false;
        }
    }

    public opened: boolean = false;

    public addGallery() {
        (this.$refs.addGallery as AddGallery).show();
    }

    private menuButtonClicked() {
        this.toggleOpen();
    }

    private toggleOpen() {
        this.opened = !this.opened;
        this.$emit('actionButtonClicked', this.opened);
    }

    private addGalleryClicked() {
        window.console.log(`GalleryListActionButton.addClicked()`);
        this.addGallery();
    }

    private deleteClicked() {
        window.console.log(`GalleryListActionButton.deleteClicked()`);
        if (this.selectedGalleryIds) {
            (this.$refs.deleteGalleries as DeleteGalleries).show(this.selectedGalleryIds);
        }
    }

    private galleriesDeleted() {
        window.console.log(`GalleryListActionButton.galleriesDeleted()`);
        this.toggleOpen();
        this.$emit('galleriesDeleted');
    }

    private galleryCreated() {
        window.console.log(`GalleryListActionButton.galleryCreated()`);
        this.toggleOpen();
        this.$emit('galleryCreated');
    }
}
</script>

<style scoped>

.controls-container {
    float: right; 
    right: 0;  
    top: 0;
    z-index: 5;
    position: absolute !important;
}

.gallery-list-button {
    font-size: 1.2em;
    border-radius: 50%;
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

.close-button {
    padding-left: 16px;
    padding-right: 15px;
    padding-top: 10px;
    padding-bottom: 10px;
}

.add-button {
    padding-left: 9px;
    padding-right: 11px;
    padding-top: 10px;
    padding-bottom: 10px;
}

.delete-button {
    padding-left: 17px;
    padding-right: 14px;
    padding-top: 10px;
    padding-bottom: 10px;
}

.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
  transition: all .3s ease;
}

.slide-fade-enter-active {
  transition: all .3s ease;
}
</style>
