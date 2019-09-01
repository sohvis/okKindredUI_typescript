<template>
    <div class="container" id="gallery-container">
        <div class="controls-container">
            <!--Back link-->
            <p>
                <router-link
                    to="/family/">
                    {{ $t('message.Family') }}
                </router-link>
                /
                <router-link
                    to="/family/profile/">
                    {{ $t('message.Profile') }}
                </router-link>
                / {{ $t('message.ImagesOfX', { 'name': personName }) }}
            </p>
            
            <!-- Title and description -->
            <div class="title-description">
                <h2>
                    <span> {{ $t('message.ImagesOfX', { 'name': personName }) }}</span>
                </h2>
            </div>
        </div>

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
            {{ $t('message.NoImagesOfPerson', { 'name': personName }) }}
            <router-link to="/gallery/" @click="addImages">{{ $t('message.GoToGalleries') }}</router-link>
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
        <PhotoSwipeView ref="photoSwipeView"/>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop} from 'vue-property-decorator';
import * as request from 'request-promise-native';
import store from '../../store/store';
import config from '../../config';
import PagedResult from '../../models/data/paged_results';
import Gallery from '../../models/data/gallery';
import Person from '../../models/data/person';
import Image from '../../models/data/image';
import ImageRow from '../../components/gallery/ImageRow.vue';
import PhotoSwipeView from '../../components/lightbox/PhotoSwipePersonView.vue';


@Component({
  components: {
      ImageRow,
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

    public get personId(): string {
        return store.state.person_id;
    }

    public personName: string = '';
    public showNoImagesMessage: boolean = false;

    public editMode: boolean = false;

    public get loading(): boolean {
        return store.getters.loading;
    }

    public get watchedProps(): string {
        return `${this.page}|${this.personId}`;
    }

    public totalCount: number = 0;

    public images: Image[] = [];

    public imageRows: Image[][] = [];

    public selectedImageIds: number[] = [];

    public galleryWidth: number = 800;

    public get numberOfPages(): number {
        return Math.max(1, Math.ceil(this.totalCount / config.PaginationPageSize));
    }

    public get portrait(): boolean {
        return window.innerHeight > window.innerWidth;
    }

    protected async mounted() {
        window.console.log('PersonGalleryView.vue mounted() call');

        try {
            // Load jwt from cookie and login
            await store.dispatch('restoreSession');

            const selectedPerson = store.getters.selectedPerson as Person;

            if (selectedPerson) {
                this.personName = selectedPerson.name;
            } else {
                this.$router.push(`/family/profile/`);
            }

            await this.loadData();

            window.addEventListener('resize', this.setDisplaySizes);
        } catch (ex) {
            window.console.log(`ex: ${ex}`);
            this.$router.push(`/accounts/login/?next=${this.$router.currentRoute.fullPath}`);
        }
    }

    private linkGen(pageNum: number) {
        return `/family/profile/gallery/?person_id=${this.personId}&page=${pageNum}`;
    }

    @Watch('watchedProps')
    private async loadData() {
        window.console.log(`GalleryView.loadData()`);

        store.commit('updateLoading', true);

        this.showNoImagesMessage = false;

        try {

            const imageTask = this.loadImageData();
            await imageTask;

            if (this.images.length === 0) {
                this.showNoImagesMessage = true;
            }

        } catch (ex) {
            store.commit('setErrorMessage', ex);
        }

        store.commit('updateLoading', false);
    }

    private async loadImageData() {

        store.commit('updateLoading', true);

        try {
            const options = {
                uri: `${config.BaseApiUrl}${config.ImageAPI}?person_id=${this.personId}&page=${this.page}`,
                headers: store.getters.ajaxHeader,
                json: true,
            };

            const response = await request.get(options) as PagedResult<Image>;

            this.images = response.results;
            this.setDisplaySizes();

            this.totalCount = response.count;

        } catch (ex) {
            store.commit('setErrorMessage', ex);
        }

        store.commit('updateLoading', false);
    }


    private setDisplaySizes() {
        window.console.log(`GalleryView.setDisplaySizes()`);

        // Force scrollbar to show so calcs are correct
        const galleryContainer = document.getElementById('gallery-container') as HTMLDivElement;
        galleryContainer.style.minHeight = `${window.innerHeight + 10}px`;

        const imageContainer = document.getElementById('image-container') as HTMLDivElement;
        this.galleryWidth =  imageContainer.clientWidth;

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


    private editModeChanged(editMode: boolean) {
        this.editMode = editMode;
    }

    private selectionChanged(imageId: number, checked: boolean) {
        window.console.log(`GalleryView.selectionChanged(galleryId: ${imageId}, checked: ${checked})`);

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
        await this.loadImageData();
    }

    private async imageClick(imageId: number, rowIndex: number) {
        window.console.log(`PersonGalleryView.imageClick(imageId: ${imageId}, rowIndex: ${rowIndex}`);

        const index = this.images.findIndex((item) => item.id === imageId);

        await (this.$refs.photoSwipeView as PhotoSwipeView).initialize(
                this.images,
                index,
                this.page,
                this.totalCount,
                this.personId);

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

.controls-container {
    position: relative;
}


.title-description {
    margin-right: 50px;
}
</style>
