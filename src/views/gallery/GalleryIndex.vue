<template>
    <div class="container">
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
        <div class="overflow-auto">
            <b-pagination-nav 
                size="lg" 
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
export default class GalleryIndex extends Vue {

    @Prop()
    public page?: number;

    public totalCount: number = 0;

    public galleries: Gallery[] = [];

    public galleryRows: Gallery[][] = [];

    public galleryWidth: number = 800;

    public get numberOfPages(): number {
        return Math.max(1, Math.ceil(this.totalCount / config.PaginationPageSize));
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
        return `/gallery/${pageNum}/`;
    }

    @Watch('page')
    private async loadData() {
        window.console.log(`GalleryIndex.loadData()`);

        store.commit('updateLoading', true);

        try {
            const options = {
                uri: `${config.BaseApiUrl}${config.GalleryAPI}?page=${this.page}`,
                headers: store.getters.ajaxHeader,
                json: true,
            };

            const response = await request.get(options) as PagedResult<Gallery>;
            this.galleries = response.results;
            this.setDisplaySizes();

            this.totalCount = response.count;

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

        const galleryContainer = document.getElementById('gallery-container') as HTMLDivElement;
        this.galleryWidth =  galleryContainer.clientWidth;

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
            if (rowWidth >= this.galleryWidth) {
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
