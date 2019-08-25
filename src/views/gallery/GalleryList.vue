<template>
    <div class="container" id="gallerylist-container">
        <h1>{{ $t('message.Gallery') }}
            <b-button variant="outline-primary" @click="addGallery">
                <sup>
                    <small>
                        <span class="oi oi-plus"></span>
                    </small>
                </sup>
                <span class="oi oi-folder"></span>
            </b-button>
        </h1>
        <div id="gallery-container">
            <GalleryRow 
                v-for="row of galleryRows" 
                :key="galleryRows.indexOf(row)" 
                v-bind:galleryRow="row"
                v-bind:width="galleryWidth">
            </GalleryRow>
        </div>
        <div v-if="showNoImagesMessage"
            class="no-images-message">
            {{ $t('message.NoGalleries') }}
            <a href="#" @click="addGallery">{{ $t('message.AddNewGallery') }}</a>
        </div>
        <div  v-show="totalCount > 1"
            class="overflow-auto">
            <b-pagination-nav 
                align="center"
                :link-gen="linkGen" 
                :number-of-pages="numberOfPages" 
                use-router>
            </b-pagination-nav>
        </div>

        <AddGallery ref="addGallery" @galleryCreated="galleryCreated" />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop} from 'vue-property-decorator';
import * as request from 'request-promise-native';
import store from '../../store/store';
import config from '../../config';
import PagedResult from '../../models/data/paged_results';
import Gallery from '../../models/data/gallery';
import GalleryRow from '../../components/gallery/GalleryRow.vue';
import AddGallery from '../../components/gallery/AddGallery.vue';

@Component({
  components: {
      GalleryRow,
      AddGallery,
  },
})
export default class GalleryList extends Vue {

    public static LARGE_SCREEN_SCALE_FACTOR: number = 1.5;

    public get page(): number {
        if (this.$route.query.page) {
            return Number(this.$route.query.page);
        } else {
            return 1;
        }
    }

    public showNoImagesMessage: boolean = false;

    public get loading(): boolean {
        return store.getters.loading;
    }

    public scaleFactor: number = 1;

    public totalCount: number = 0;

    public galleries: Gallery[] = [];

    public galleryRows: Gallery[][] = [];

    public galleryWidth: number = 800;

    public get numberOfPages(): number {
        return Math.max(1, Math.ceil(this.totalCount / config.PaginationPageSize));
    }

    public get portrait(): boolean {
        return window.innerHeight > window.innerWidth;
    }

    protected async mounted() {
        window.console.log('GalleryIndex.vue mounted() call');

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

    private addGallery() {
        window.console.log('GalleryIndex.addGallery()');

        (this.$refs.addGallery as AddGallery).show();
    }

    private linkGen(pageNum: number) {
        return `/gallery/?page=${pageNum}`;
    }

    @Watch('page')
    private async loadData() {
        window.console.log(`GalleryIndex.loadData()`);

        store.commit('updateLoading', true);

        try {
            this.showNoImagesMessage = false;

            const options = {
                uri: `${config.BaseApiUrl}${config.GalleryAPI}?page=${this.page}`,
                headers: store.getters.ajaxHeader,
                json: true,
            };

            const response = await request.get(options) as PagedResult<Gallery>;
            this.galleries = response.results;

            this.totalCount = response.count;
            if (this.totalCount === 0) {
                this.showNoImagesMessage = true;
            }

            this.setDisplaySizes();

        } catch (ex) {
            store.commit('setErrorMessage', ex);
        }

        store.commit('updateLoading', false);
    }

    private async galleryCreated() {
        await this.loadData();
    }

    private setDisplaySizes() {
        window.console.log(`GalleryIndex.setDisplaySizes()`);

        // Force scrollbar to show so calcs are correct
        const galleryListContainer = document.getElementById('gallerylist-container') as HTMLDivElement;
        galleryListContainer.style.minHeight = `${window.innerHeight + 10}px`;


        const galleryContainer = document.getElementById('gallery-container') as HTMLDivElement;
        this.galleryWidth =  galleryContainer.clientWidth;

        // Fiddle to get more images on a portrait phone per row
        let scale = 1;

        // Get the device pixel ratio, falling back to 1.
        const dpr = window.devicePixelRatio || 1;
        if (this.portrait) {
            scale = 1;
        } else {
            scale = 0.75 /  dpr;
        }

        window.console.log(`this.galleryWidth: ${this.galleryWidth}`);

        const imageRows = new Array<Gallery[]>();
        let imageRow = new Array<Gallery>();
        let rowWidth = 0;
        for (const gallery of this.galleries) {

            if (!gallery.thumbnail) {
                gallery.thumbnail_width = 200;
                gallery.thumbnail_height = 200;
            }

            imageRow.push(gallery);
            rowWidth += gallery.thumbnail_width;

            // New row
            if (rowWidth >= this.galleryWidth * scale ) {
                imageRows.push(imageRow);
                imageRow = new Array<Gallery>();
                rowWidth = 0;
            }
        }

        imageRows.push(imageRow);
        const lastImageRow = imageRow;

        this.galleryRows = imageRows;
    }

}
</script>

<style scoped>
#gallery-container {
    overflow: hidden;
    margin-top: 10px;
    margin-bottom: 20px;
}
</style>
