<template>
    <div id="action-button-container" class="action-button-container" 
        v-bind:style="actionButtonRightStyle">
        <transition name="slide-fade">
            <b-button
                v-if="opened"
                variant="success"
                 :title="$t('message.CreateNewGallery')"
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
                :title="$t('message.Delete')"
                class="gallery-list-button delete-button"
                :disabled="!imagesSelected"
                @click="deleteClicked">
                <span class="oi oi-trash"></span>
            </b-button>
        </transition>
        <!-- Currently service cannot handle more than 30+ images -->
        <!-- <transition name="slide-fade">
            <b-button
                v-if="opened"
                variant="primary"
                :title="$t('message.Download')"
                class="gallery-list-button download-button"
                :disabled="!imagesSelected"
                @click="downloadClicked">
                <span class="oi oi-data-transfer-download"></span>
            </b-button>
        </transition> -->
        <b-button
            v-if="opened"
            variant="primary"
            :title="$t('message.Close')"
            class="gallery-list-button close-button"
            @click="menuButtonClicked">
            <span class="oi oi-x"></span>
        </b-button>

        <b-button
            v-if="!opened"
            variant="outline-primary"
            :title="$t('message.Toolbar')"
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

    public get imagesSelected(): boolean {

        if (this.selectedGalleryIds) {
            return this.selectedGalleryIds.length > 0;
        } else {
            return false;
        }
    }

    public opened: boolean = false;

    public actionButtonRightStyle: any = {
        right: '0px',
    };

    public addGallery() {
        (this.$refs.addGallery as AddGallery).show();
    }

    private mounted() {
        window.addEventListener('resize', () => this.positionContainer(), false);
        this.positionContainer();
    }

    private positionContainer() {
        // Positions the floating action button
        window.console.log(`GalleryListActionButton.positionContainer()`);
        const actionContainer = document.getElementById('action-button-container') as HTMLDivElement;
        const container = document.getElementsByClassName('container')[0] as HTMLDivElement;

        const rect = container.getBoundingClientRect();

        this.actionButtonRightStyle.right = `${rect.left + 15}px`;
    }

    private menuButtonClicked() {
        this.toggleOpen();
    }

    private toggleOpen() {
        this.opened = !this.opened;
        this.$emit('actionButtonClicked', this.opened);
    }

    private addGalleryClicked() {
        // window.console.log(`GalleryListActionButton.addClicked()`);
        this.addGallery();
    }

    private deleteClicked() {
        // window.console.log(`GalleryListActionButton.deleteClicked()`);
        if (this.selectedGalleryIds) {
            (this.$refs.deleteGalleries as DeleteGalleries).show(this.selectedGalleryIds);
        }
    }

    private galleriesDeleted() {
        // window.console.log(`GalleryListActionButton.galleriesDeleted()`);
        this.toggleOpen();
        this.$emit('galleriesDeleted');
    }

    private galleryCreated() {
        // window.console.log(`GalleryListActionButton.galleryCreated()`);
        this.toggleOpen();
        this.$emit('galleryCreated');
    }

    private downloadClicked() {
        this.$emit('downloadClicked');
    }
}
</script>

<style scoped>

.action-button-container {
    float: right; 
    top: 60px;
    z-index: 5;
    position: fixed;
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
    background-color: white;
}

.action-button:hover {
    background-color: #007bff;
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

.download-button {
    padding-left: 15px;
    padding-right: 16px;
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

/* Need to make disabled buttons look more disabled */
.btn-danger.disabled {
    background-color: #f99;
    border-color: #f99
}

.btn-primary.disabled {
    background-color: rgb(80, 203, 255);
    border-color: rgb(80, 203, 255);
}
</style>
