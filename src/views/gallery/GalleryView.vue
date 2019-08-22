<template>
    <div class="container">
        <p>
        <router-link
            to="/gallery/">
            {{ $t('message.AllGalleries') }}
        </router-link>
        / {{ title }} / {{ page }}
        </p>
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
        <div id="image-container">
            <ImageRow 
                v-for="row of imageRows" 
                :key="imageRows.indexOf(row)" 
                v-bind:imageRow="row"
                v-bind:width="galleryWidth">
            </ImageRow>
        </div>
        <div v-if="showNoImagesMessage"
            class="no-images-message">
            {{ $t('message.NoImagesInGallery') }}
            <a href="#" @click="addGallery">{{ $t('message.AddNewImages') }}</a>
        </div>
        <div v-show="totalCount > 1"
            class="overflow-auto">
            <b-pagination-nav 
                size="lg" 
                align="center"
                :link-gen="linkGen" 
                :number-of-pages="numberOfPages" 
                use-router>
            </b-pagination-nav>
        </div>
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
import PagedResult from '../../models/data/paged_results';
import Gallery from '../../models/data/gallery';
import Image from '../../models/data/image';
import ImageRow from '../../components/gallery/ImageRow.vue';
import EditGallery from '../../components/gallery/EditGallery.vue';


@Component({
  components: {
      ImageRow,
      EditGallery,
  },
})
export default class GalleryView extends Vue {

    public get page(): number {
        if (this.$route.query.page) {
            return Number(this.$route.query.page);
        } else {
            return 1;
        }
    }

    @Prop()
    public galleryId?: number;

    public gallery: Gallery | null = null;

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

    public totalCount: number = 0;

    public images: Image[] = [];

    public imageRows: Image[][] = [];

    public galleryWidth: number = 800;

    public get numberOfPages(): number {
        return Math.max(1, Math.ceil(this.totalCount / config.PaginationPageSize));
    }

    protected async mounted() {
        window.console.log('GalleryView.vue mounted() call');

        try {
            // Load jwt from cookie and login
            await store.dispatch('restoreSession');
            await this.loadData();

            window.addEventListener('resize', this.setDisplaySizes);
        } catch (ex) {
            window.console.log(`ex: ${ex}`);
            this.$router.push(`/accounts/login/?next=${this.$router.currentRoute.fullPath}`);
        }
    }

    private linkGen(pageNum: number) {
        return `/gallery/${this.galleryId}/?page=${pageNum}`;
    }

    @Watch('watchedProps')
    private async loadData() {
        window.console.log(`GalleryView.loadData()`);

        store.commit('updateLoading', true);

        this.showNoImagesMessage = false;

        try {

            const imageTask = this.loadImageData();
            const galleryTask = this.loadGalleryData();

            await imageTask;
            await galleryTask;

            if (this.images.length === 0) {
                this.showNoImagesMessage = true;
            }

        } catch (ex) {
            store.commit('setErrorMessage', ex);
        }

        store.commit('updateLoading', false);
    }

    private async loadImageData() {
        const options = {
            uri: `${config.BaseApiUrl}${config.ImageAPI}?page=${this.page}&gallery_id=${this.galleryId}`,
            headers: store.getters.ajaxHeader,
            json: true,
        };

        const response = await request.get(options) as PagedResult<Image>;

        this.images = response.results;
        this.setDisplaySizes();

        this.totalCount = response.count;
    }

    private async loadGalleryData() {
        const options = {
            uri: `${config.BaseApiUrl}${config.GalleryAPI}${this.galleryId}/`,
            headers: store.getters.ajaxHeader,
            json: true,
        };

        const response = await request.get(options) as Gallery;

        this.gallery = response;
    }


    private setDisplaySizes() {
        window.console.log(`GalleryView.setDisplaySizes()`);

        const imageContainer = document.getElementById('image-container') as HTMLDivElement;
        this.galleryWidth =  imageContainer.clientWidth;

        window.console.log(`this.galleryWidth: ${this.galleryWidth}`);

        const imageRows = new Array<Image[]>();
        let imageRow = new Array<Image>();
        let rowWidth = 0;
        for (const image of this.images) {

            if (!image.thumbnail) {
                image.thumbnail_width = 200;
                image.thumbnail_height = 200;
            }

            imageRow.push(image);
            rowWidth += image.thumbnail_width;

            // New row
            if (rowWidth >= this.galleryWidth) {
                imageRows.push(imageRow);
                imageRow = new Array<Image>();
                rowWidth = 0;
            }
        }

        imageRows.push(imageRow);
        const lastImageRow = imageRow;

        this.imageRows = imageRows;
    }

    private editGalleryClicked() {
        window.console.log(`GalleryView.editGalleryClicked()`);

        if (this.gallery) {
            (this.$refs.editGallery as EditGallery).show(this.gallery);
        }
    }

    private async galleryEdited() {
        window.console.log(`GalleryView.galleryEdited()`);

        await this.loadData();
    }
}
</script>

<style scoped>
#image-container {
    overflow: hidden;
    margin-top: 10px;
    margin-bottom: 20px;
}

.no-images-message {
    margin-top: 40px;
    margin-bottom: 40px;
    text-align: center;
}

.edit-gallery {
    margin-left: 5px;
    cursor: pointer;
    font-size: 0.7em;
}
</style>
