<template>

        <div class="controls-container">
            <!--Back link-->
            <p>
                <router-link
                    to="/gallery/">
                    {{ $t('message.AllGalleries') }}
                </router-link>
                / 
                <router-link
                    :to="`/gallery/${galleryId}/`">
                    {{ title }}
                </router-link> 
                / {{ page }}
            </p>
            <!-- Title and description -->
            <div class="title-description">
                <h1>
                    {{ title }}
                    <sup v-if="gallery">
                        <span class="oi oi-pencil edit-gallery"
                            @click="editGalleryClicked">
                        </span>
                    </sup>
                </h1>
                <p>
                    {{ description }}
                </p>
            </div>
            <!--Add pictures-->
            <router-link 
                class="btn btn-success add-images-button"
                :to="`/gallery/${galleryId}/upload/?page=${page}&title=${title}`">
                <sup>
                    <span class="oi oi-plus"></span>
                </sup>
                <span class="oi oi-image"></span>
            </router-link>
        <EditGallery
            ref="editGallery"
            @galleryEdited="galleryEdited" />
        </div>

</template>

<script lang="ts">
import { Component, Vue, Watch, Prop} from 'vue-property-decorator';
import * as request from 'request-promise-native';
import store from '../../store/store';
import config from '../../config';
import Gallery from '../../models/data/gallery';
import EditGallery from '../../components/gallery/EditGallery.vue';

@Component({
  components: {
      EditGallery,
  },
})
export default class GalleryHeader extends Vue {

    @Prop({ default: 0 })
    public galleryId?: number;

    public gallery: Gallery | null = null;

    public get page(): number {
        if (this.$route.query.page) {
            return Number(this.$route.query.page);
        } else {
            return 1;
        }
    }

    public get title(): string {
        if (this.gallery) {
            return this.gallery.title;
        } else {
            return '';
        }
    }

    public get description(): string {
        if (this.gallery) {
            return this.gallery.description;
        } else {
            return '';
        }
    }

    public showNoImagesMessage: boolean = false;

    public get loading(): boolean {
        return store.getters.loading;
    }

    public get watchedProps(): string {
        return `${this.page}|${this.galleryId}`;
    }


    @Watch('watchedProps')
    public async loadGalleryData() {
        window.console.log(`GalleryHeader.loadGalleryData()`);

        try {

            store.commit('updateLoading', true);
            const options = {
                uri: `${config.BaseApiUrl}${config.GalleryAPI}${this.galleryId}/`,
                headers: store.getters.ajaxHeader,
                json: true,
            };

            const response = await request.get(options) as Gallery;

            this.gallery = response;

        } catch (ex) {
            store.commit('setErrorMessage', ex);
        }

        store.commit('updateLoading', false);
    }

    private editGalleryClicked() {
        window.console.log(`GalleryHeader.editGalleryClicked()`);

        if (this.gallery) {
            (this.$refs.editGallery as EditGallery).show(this.gallery);
        }
    }

    private async galleryEdited() {
        window.console.log(`GalleryHeader.galleryEdited()`);

        await this.loadGalleryData();
    }
}
</script>

<style scoped>
.edit-gallery {
    margin-left: 5px;
    cursor: pointer;
    font-size: 0.7em;
}

.controls-container {
    overflow: hidden;
}

.title-description{
    float: left;
    max-width: 80%;
}
.add-images-button{
    float: right;
    border-radius: 50%;
    padding-top: 17px;
    padding-bottom: 15px;
    padding-left: 14px;
    padding-right: 14px;
    font-size: 1.2em;
    margin-right:3px;
    box-shadow: 1px 1px 2px black;
    margin-bottom: 3px;
}
</style>
