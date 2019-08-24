<template>
    <div class="container">

        <GalleryHeader 
            ref="galleryHeader"
            v-bind:galleryId="galleryId" />

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
            <a href="#" @click="addImages">{{ $t('message.AddNewImages') }}</a>
        </div>
        <div v-show="totalCount > 1"
            class="overflow-auto">
            <b-pagination-nav 
                align="center"
                :link-gen="linkGen" 
                :number-of-pages="numberOfPages" 
                use-router>
            </b-pagination-nav>
        </div>
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
import GalleryHeader from '../../components/gallery/GalleryHeader.vue';


@Component({
  components: {
      ImageRow,
      GalleryHeader,
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
            const headerTask = (this.$refs.galleryHeader as GalleryHeader).loadGalleryData();
            await imageTask;
            await headerTask;

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
            if (rowWidth + image.thumbnail_width >= this.galleryWidth) {
                imageRows.push(imageRow);
                imageRow = new Array<Image>();
                rowWidth = 0;
            }
        }

        imageRows.push(imageRow);
        const lastImageRow = imageRow;

        this.imageRows = imageRows;
    }

    private addImages() {
        const header = this.$refs.galleryHeader as GalleryHeader;
        const route = `/gallery/${this.galleryId}/upload/?page=${this.page}&title=${header.title}`;
        this.$router.push(route);
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
    padding-left: 15px;
    padding-right: 15px;
    font-size: 1.2em;
    margin-right:3px;
    box-shadow: 1px 1px 2px black;
    margin-bottom: 3px;
}
</style>
