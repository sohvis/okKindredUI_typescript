<template>
    <div class="container" id="gallerylist-container">

        <div class="gallery-header">
            <h1 class="gallery-title">
                {{ $t('message.AllGalleries') }}
            </h1>
            <GalleryListActionButton 
                ref="galleryListActionButton"
                :selectedGalleryIds="selectedGalleryIds"
                @actionButtonClicked="actionButtonClicked" 
                @galleriesDeleted="galleriesDeleted" 
                @downloadClicked="downloadClicked" />
        </div>
        <div id="gallery-container">
            <GalleryRow 
                v-for="row of galleryRows" 
                :key="galleryRows.indexOf(row)" 
                :galleryRow="row"
                :width="galleryWidth"
                :editMode="editMode"
                @selectionChanged="selectionChanged">
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
        <DownloadMultipleImages ref="downloadMultipleImages"/>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop} from 'vue-property-decorator';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import store from '../../store/store';
import config from '../../config';
import PagedResult from '../../models/data/paged_results';
import Gallery from '../../models/data/gallery';
import GalleryRow from '../../components/gallery_list/GalleryRow.vue';
import GalleryListActionButton from '../../components/gallery_list/GalleryListActionButton.vue';
import DownloadMultipleImages from '../../components/gallery/DownloadMultipleImages.vue';

@Component({
  components: {
      GalleryRow,
      GalleryListActionButton,
      DownloadMultipleImages,
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

    public selectedGalleryIds: number[] = [];

    public galleryWidth: number = 800;

    public get numberOfPages(): number {
        return Math.max(1, Math.ceil(this.totalCount / config.PaginationPageSize));
    }

    public get portrait(): boolean {
        return window.innerHeight > window.innerWidth;
    }

    public editMode: boolean = false;

    protected async mounted() {
        // window.console.log('GalleryList.vue mounted() call');

        try {
            // Load jwt from cookie and login
            await store.dispatch('restoreSession');
            await this.loadData();

            window.addEventListener('resize', this.setDisplaySizes);
            window.onresize = () => this.setDisplaySizes();

            store.dispatch('updateRouteLoaded');
        } catch (ex) {
            // window.console.log(`ex: ${ex}`);
            this.$router.push(`/accounts/login/?next=${this.$router.currentRoute.fullPath}`);
        }
    }

    private linkGen(pageNum: number) {
        return `/gallery/?page=${pageNum}`;
    }

    @Watch('page')
    private async loadData() {
        // window.console.log(`GalleryList.loadData()`);

        store.commit('updateLoading', true);

        try {
            this.showNoImagesMessage = false;

            const options: AxiosRequestConfig = {
                url: `${config.BaseApiUrl}${config.GalleryAPI}?page=${this.page}`,
                headers: store.getters.ajaxHeader,
                method: 'GET',
                responseType: 'json',
            };

            const response = await axios.request(options) as AxiosResponse<PagedResult<Gallery>>;
            this.galleries = response.data.results;

            this.totalCount = response.data.count;
            if (this.totalCount === 0) {
                this.showNoImagesMessage = true;
            }

            this.setDisplaySizes();

        } catch (ex) {
            store.commit('setErrorMessage', ex);
        }

        store.commit('updateLoading', false);
    }

    private setDisplaySizes() {
        // window.console.log(`GalleryList.setDisplaySizes()`);

        // Force scrollbar to show so calcs are correct
        const galleryListContainer = document.getElementById('gallerylist-container') as HTMLDivElement;
        if (!galleryListContainer) {
            return;
        }

        galleryListContainer.style.minHeight = `${window.innerHeight + 10}px`;

        const galleryContainer = document.getElementById('gallery-container') as HTMLDivElement;
        if (!galleryContainer) {
            return;
        }

        this.galleryWidth =  galleryContainer.clientWidth - 1;

        // Fiddle to get more images on a portrait phone per row
        let scale = 1;

        // Get the device pixel ratio, falling back to 1.
        const dpr = window.devicePixelRatio || 1;
        if (this.portrait) {
            scale = 1;
        } else {
            scale = 0.75 /  dpr;
        }

        // window.console.log(`this.galleryWidth: ${this.galleryWidth}`);

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

    private actionButtonClicked(opened: boolean) {
        // window.console.log(`GalleryList.actionButtonClicked(opened: ${opened})`);
        this.selectedGalleryIds = [];
        this.editMode = opened;
    }

    private selectionChanged(galleryId: number, checked: boolean) {
        // window.console.log(`GalleryList.selectionChanged(galleryId: ${galleryId}, checked: ${checked})`);
        const selectedIds = new Array<number>();

        for (const gallery of this.galleries) {
            if (gallery.id === galleryId) {
                gallery.selected = checked;
            }

            if (gallery.selected) {
                selectedIds.push(gallery.id);
            }
        }

        this.selectedGalleryIds = selectedIds;
        // window.console.log(this.selectedGalleryIds);
    }

    private async galleriesDeleted() {
        await this.loadData();
    }

    private addGallery() {
        (this.$refs.galleryListActionButton as GalleryListActionButton).addGallery();
    }

    private async downloadClicked() {
        await (this.$refs.downloadMultipleImages as DownloadMultipleImages).downloadGalleries(this.selectedGalleryIds);
    }
}
</script>

<style scoped>
#gallery-container {
    overflow: hidden;
    margin-bottom: 20px;
}

.add-button {
    padding-left: 7px;
    padding-right: 15px;
}

.edit-button {
    margin-left: 15px;
}

.edit-done-button {
    margin-left: 15px;
}

.gallery-title {
    float: left;
    overflow-wrap: break-word;
}

.gallery-header {
    overflow: hidden;
    padding-bottom: 15px;
    position: relative;
}

.no-images-message {
    margin-top: 40px;
    margin-bottom: 40px;
    text-align: center;
}
</style>
