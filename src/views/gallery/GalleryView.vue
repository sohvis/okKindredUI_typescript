<template>
    <div class="container" id="gallery-container">

        <GalleryHeader 
            ref="galleryHeader"
            :galleryId="galleryId"
            :selectedImageIds="selectedImageIds"
            @editModeChanged="editModeChanged"
            @imagesDeleted="imagesDeleted" />

        <div id="image-container">
            <ImageRow 
                v-for="row of imageRows" 
                :key="imageRows.indexOf(row)"
                :rowIndex="imageRows.indexOf(row)"
                :imageRow="row"
                :width="galleryWidth"
                :editMode="editMode"
                @selectionChanged="selectionChanged"
                @imageClick="imageClick">
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
        <PhotoSwipeView ref="photoSwipeView" @imageEdited="imageEdited"/>
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
import PhotoSwipeView from '../../components/lightbox/PhotoSwipeGalleryView.vue';


@Component({
  components: {
      ImageRow,
      GalleryHeader,
      PhotoSwipeView,
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

    public editMode: boolean = false;

    public get loading(): boolean {
        return store.getters.loading;
    }

    public get watchedProps(): string {
        return `${this.page}|${this.galleryId}`;
    }

    public totalCount: number = 0;

    public images: Image[] = [];

    public imageRows: Image[][] = [];

    public selectedImageIds: number[] = [];

    public galleryWidth: number = 800;

    public additionalImages: Image[] = [];

    public isMounted: boolean = false;

    public get numberOfPages(): number {
        return Math.max(1, Math.ceil(this.totalCount / config.PaginationPageSize));
    }

    public get portrait(): boolean {
        return window.innerHeight > window.innerWidth;
    }

    protected async mounted() {
        // window.console.log('GalleryView.vue mounted() call');

        try {
            // Load jwt from cookie and login
            await store.dispatch('restoreSession');

            this.isMounted = true;
            await this.loadData();
            await this.displayImageFromUrl();

            window.addEventListener('resize', this.setDisplaySizes);
            window.onresize = () => this.setDisplaySizes();
            store.dispatch('updateRouteLoaded');

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
        // window.console.log(`GalleryView.loadData()`);
        if (this.isMounted) {
            store.commit('updateLoading', true);

            this.showNoImagesMessage = false;

            try {

                const imageTask = this.loadImageData(this.page);
                const headerTask = (this.$refs.galleryHeader as GalleryHeader).loadGalleryData();
                await imageTask;
                await headerTask;
                this.setDisplaySizes();

                if (this.images.length === 0) {
                    this.showNoImagesMessage = true;
                }

            } catch (ex) {
                store.commit('setErrorMessage', ex);
            }

            store.commit('updateLoading', false);
        }
    }

    private async loadImageData(page: number) {

        store.commit('updateLoading', true);

        try {
            const options = {
                uri: `${config.BaseApiUrl}${config.ImageAPI}?page=${page}&gallery_id=${this.galleryId}`,
                headers: store.getters.ajaxHeader,
                json: true,
            };

            const response = await request.get(options) as PagedResult<Image>;

            this.images = response.results;
            this.additionalImages.push(...this.images);
            this.totalCount = response.count;

        } catch (ex) {
            store.commit('setErrorMessage', ex);
        }

        store.commit('updateLoading', false);
    }


    private setDisplaySizes() {
        // window.console.log(`GalleryView.setDisplaySizes()`);

        // Force scrollbar to show so calcs are correct
        const galleryContainer = document.getElementById('gallery-container') as HTMLDivElement;
        galleryContainer.style.minHeight = `${window.innerHeight + 10}px`;

        // Rounding error causes last image to appear on next row so take off a pixel
        const imageContainer = document.getElementById('image-container') as HTMLDivElement;
        this.galleryWidth =  imageContainer.clientWidth - 1;

        // Fiddle to get more images on a portrait phone per row
        let scale = 1;

        // Get the device pixel ratio, falling back to 1.
        const dpr = window.devicePixelRatio || 1;
        if (this.portrait) {
            scale = 1;
        } else {
            scale = 0.75 /  dpr;
        }

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

    private addImages() {
        const header = this.$refs.galleryHeader as GalleryHeader;
        const route = `/gallery/${this.galleryId}/upload/?page=${this.page}&title=${header.title}`;
        this.$router.push(route);
    }

    private editModeChanged(editMode: boolean) {
        this.editMode = editMode;
    }

    private selectionChanged(imageId: number, checked: boolean) {
        // window.console.log(`GalleryView.selectionChanged(galleryId: ${imageId}, checked: ${checked})`);

        const selectedIds = new Array<number>();

        for (const image of this.images) {
            if (image.id === imageId) {
                image.selected = checked;
            }

            if (image.selected) {
                selectedIds.push(image.id);
            }
        }

        this.selectedImageIds = selectedIds;
    }

    private async imagesDeleted() {
        // window.console.log(`GalleryView.imagesDeleted()`);
        await this.loadImageData(this.page);
        this.setDisplaySizes();
    }

    private async imageClick(imageId: number, rowIndex: number) {
        // window.console.log(`GalleryView.imageClick(imageId: ${imageId}, rowIndex: ${rowIndex}`);

        if (this.galleryId) {
            const index = this.images.findIndex((item) => item.id === imageId);

            await (this.$refs.photoSwipeView as PhotoSwipeView).init(
                    this.images,
                    index,
                    this.page,
                    this.totalCount,
                    this.galleryId);
        }
    }

    private imageEdited(image: Image) {
        // window.console.log(`GalleryView.imageEdited(imageId: ${image.id}`);

        let index = 0;
        for (index = 0; index < this.images.length; index++) {
            if (image.id === this.images[index].id) {
                this.images[index] = image;
                this.setDisplaySizes();
                return;
            }
        }
    }

    private async displayImageFromUrl() {
        if (this.$route.query.image_id && this.galleryId) {
            const imageId = Number(this.$route.query.image_id);

            // window.console.log(`GalleryView.displayImageFromUrl(imageId: ${imageId}`);

            // if the image is already loaded in page, display it
            let index = this.images.findIndex((item) => item.id === imageId);

            if (index > -1) {

                // window.console.log(`image in data loaded from page - displaying`);
                await (this.$refs.photoSwipeView as PhotoSwipeView).init(
                    this.images,
                    index,
                    this.page,
                    this.totalCount,
                    this.galleryId);

            } else {
                // If image is not in page, then we have to load the other pages before displaying it
                // window.console.log(`image not in data loaded from page - loading all other pages`);

                store.commit('updateLoading', true);
                const tasks = new Array<Promise<void>>();

                let pageNo: number = this.page;
                if (this.page < this.numberOfPages) {
                    for (pageNo = this.page + 1; pageNo <= this.numberOfPages; pageNo++) {
                        tasks.push(this.loadImageData(pageNo));
                    }
                }

                if (this.page  > 1) {
                    for (pageNo = 1; pageNo < this.page ; pageNo++) {
                        tasks.push(this.loadImageData(pageNo));
                    }
                }
                await Promise.all(tasks);

                index = this.additionalImages.findIndex((item) => item.id === imageId);
                await (this.$refs.photoSwipeView as PhotoSwipeView).init(
                    this.additionalImages,
                    index,
                    pageNo,
                    this.totalCount,
                    this.galleryId);

                store.commit('updateLoading', false);
            }
        }
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
</style>
