<template>

    <div class="controls-container">
        <transition name="slide-fade">
            <b-button
                v-if="opened"
                variant="success"
                :title="$t('message.UploadImages')"
                class="gallery-button add-button"
                @click="addImagesClicked">
                <sup>
                    <small>
                        <span class="oi oi-plus"></span>
                    </small>
                </sup>
                <span class="oi oi-image"></span>
            </b-button>
        </transition>
        <transition name="slide-fade">
            <b-button
                v-if="opened"
                variant="secondary"
                :title="$t('message.EditGallery')"
                class="gallery-button edit-button"
                :disabled="!editEnabled"
                @click="editClicked">
                <span class="oi oi-pencil"></span>
            </b-button>
        </transition>
        <transition name="slide-fade">
            <b-button
                v-if="opened"
                variant="danger"
                :title="$t('message.DeleteImages')"
                class="gallery-button delete-button"
                :disabled="!deleteEnabled"
                @click="deleteClicked">
                <span class="oi oi-trash"></span>
            </b-button>
        </transition>
        <transition name="slide-fade">
            <b-button
                v-if="opened"
                variant="info"
                :title="$t('message.Map')"
                class="gallery-button map-button"
                @click="mapClicked">
                <span class="oi oi-map"></span>
            </b-button>
        </transition>
        <b-button
            v-if="!opened"
            variant="outline-primary"
            :title="$t('message.Toolbar')"
            class="gallery-button action-button"
            @click="menuButtonClicked">
            <span class="oi oi-menu"></span>
        </b-button>
        <b-button
            v-if="opened"
            variant="primary"
            :title="$t('message.Close')"
            class="gallery-button close-button"
            @click="menuButtonClicked">
            <span class="oi oi-x"></span>
        </b-button>
        <EditGallery
            ref="editGallery"
            @galleryEdited="galleryEdited" />
        
        <DeleteImages
            ref="deleteImages"
            @imagesDeleted="imagesDeleted" />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop} from 'vue-property-decorator';
import store from '../../store/store';
import config from '../../config';
import EditGallery from './EditGallery.vue';
import Gallery from '../../models/data/gallery';
import DeleteImages from './DeleteImages.vue';

@Component({
  components: {
      EditGallery,
      DeleteImages,
  },
})
export default class GalleryActionButton extends Vue {

    @Prop({ default: null })
    public gallery: Gallery | null = null;

    public get page(): number {
        if (this.$route.query.page) {
            return Number(this.$route.query.page);
        } else {
            return 1;
        }
    }

    @Prop({ default: () => [] })
    public selectedImageIds?: number[];

    public get deleteEnabled(): boolean {

        if (this.selectedImageIds) {
            return this.selectedImageIds.length > 0;
        } else {
            return false;
        }
    }

    public get editEnabled(): boolean {

        if (this.selectedImageIds) {
            return this.selectedImageIds.length === 0;
        } else {
            return false;
        }
    }


    public opened: boolean = false;

    public addImages() {
        if (this.gallery) {
            // Clear the files in state to be uploaded
            store.dispatch('setFilesToUpload', []);

            this.$router.push(`/gallery/${this.gallery.id}/upload/?page=${this.page}&title=${this.gallery.title}`);
        }
    }

    private menuButtonClicked() {
        this.toggleOpen();
    }

    private toggleOpen() {
        this.opened = !this.opened;
        this.$emit('actionButtonClicked', this.opened);
    }

    private addImagesClicked() {
        // window.console.log(`GalleryActionButton.addClicked()`);
        this.addImages();
    }

    private deleteClicked() {
        // window.console.log(`GalleryActionButton.deleteClicked()`);
        if (this.selectedImageIds) {
            (this.$refs.deleteImages as DeleteImages).show(this.selectedImageIds);
        }
    }

    private editClicked() {
        // window.console.log(`GalleryActionButton.editClicked()`);

        if (this.gallery) {
            (this.$refs.editGallery as EditGallery).show(this.gallery);
        }
    }

    private galleryEdited() {
        this.$emit('galleryEdited');
        this.toggleOpen();
    }

    private imagesDeleted() {
        this.$emit('imagesDeleted');
        this.toggleOpen();
    }

    private mapClicked() {
        if (this.gallery) {
            this.$router.push(`/gallery/${this.gallery.id}/map/`);
        }
    }

}
</script>

<style scoped>

.controls-container {
    float: right; 
    right: 0;  
    top: 40px;
    z-index: 5;
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

.edit-button {
    padding-left: 17px;
    padding-right: 14px;
    padding-top: 10px;
    padding-bottom: 10px;
}

.delete-button {
    padding-left: 17px;
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

.map-button {
    padding-left: 16px;
    padding-right: 12px;
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

/* Need to make danger button look more disabled */
.btn-danger.disabled {
    background-color: #f99;
    border-color: #f99
}

.btn-secondary.disabled {
    background-color: #9ca5ad;
    border-color: #9ca5ad;
}
</style>
