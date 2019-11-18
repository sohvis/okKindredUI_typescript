<!-- used only in Xamarin for chosing a gallery -->
<template>
    <div class="container" id="gallerylist-container">
        <div class="select-gallery-header">
            <div class="title-description">
                <h1>
                    {{ $t('message.SelectGallery') }}
                </h1>
            </div>
            <div class="add-gallery-container">
                <b-button
                    variant="success"
                    :title="$t('message.CreateNewGallery')"
                    class="select-gallery-add-button"
                    @click="addGallery">
                    <sup>
                        <small>
                            <span class="oi oi-plus"></span>
                        </small>
                    </sup>
                    <span class="oi oi-folder"></span>
                </b-button>
            </div>
        </div>
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <tbody>
                    <tr v-for="gallery of galleries" 
                        :key="gallery.id" 
                        @click="selectGallery(gallery)"
                        class="select-gallery-row">
                        <td>
                            {{ gallery.title }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="showNoImagesMessage"
            class="no-images-message">
            {{ $t('message.NoGalleries') }}
            <a href="#" @click="addGallery">{{ $t('message.AddNewGallery') }}</a>
        </div>

        <AddGallery 
            ref="addGallery" 
            @galleryCreated="galleryCreated" />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop} from 'vue-property-decorator';
import * as request from 'request-promise-native';
import store from '../../store/store';
import config from '../../config';
import PagedResult from '../../models/data/paged_results';
import Gallery from '../../models/data/gallery';
import AddGallery from '../../components/gallery_list/AddGallery.vue';

@Component({
  components: {
      AddGallery,
  },
})
export default class SelectGallery extends Vue {

    public showNoImagesMessage: boolean = false;

    public get loading(): boolean {
        return store.getters.loading;
    }

    public galleries: Gallery[] = [];

    protected async mounted() {
        // window.console.log('SelectGallery.vue mounted() call');

        try {
            // Load jwt from cookie and login
            await store.dispatch('restoreSession');
            await this.loadData();

            store.dispatch('updateRouteLoaded');
        } catch (ex) {
            // window.console.log(`ex: ${ex}`);
            this.$router.push(`/accounts/login/?next=${this.$router.currentRoute.fullPath}`);
        }
    }

    private async loadData() {
        // window.console.log(`SelectGallery.loadData()`);

        store.commit('updateLoading', true);

        try {
            // Get page 1
            const response = await this.loadDatafromPage(1);
            this.galleries = response.results;

            // Get all other pages concurrently
            const totalPages = Math.max(1, Math.ceil(response.count / config.PaginationPageSize));
            const tasks = new Array<Promise<PagedResult<Gallery>>>();

            for (let page = 2; page <= totalPages; page++) {
                const pageOptions = {
                    uri: `${config.BaseApiUrl}${config.GalleryAPI}?page=${page}`,
                    headers: store.getters.ajaxHeader,
                    json: true,
                };

                const task = this.loadDatafromPage(page);
                tasks.push(task);
            }

            const results = await Promise.all(tasks);

            for (const pagedResult of results) {
                this.galleries.push(...pagedResult.results);
            }

            if (this.galleries.length === 0) {
                this.showNoImagesMessage = true;
            }

        } catch (ex) {
            store.commit('setErrorMessage', ex);
        }

        store.commit('updateLoading', false);
    }

    private async loadDatafromPage(page: number): Promise<PagedResult<Gallery>> {
        const pageOptions = {
                    uri: `${config.BaseApiUrl}${config.GalleryAPI}?page=${page}`,
                    headers: store.getters.ajaxHeader,
                    json: true,
                };

        const result = await request.get(pageOptions) as PagedResult<Gallery>;

        return result;
    }

    private selectGallery(gallery: Gallery) {
            window.console.log(`GalleryList.selectGallery(galleryId: ${gallery.id})`);
            this.$router.push(`/gallery/${gallery.id}/upload/`);
    }

    private addGallery() {
        (this.$refs.addGallery as AddGallery).show();
    }

    private galleryCreated(newGallery: Gallery) {
        this.galleries.unshift(newGallery);
        this.showNoImagesMessage = false;
    }
}
</script>

<style scoped>
.select-gallery-header {
    position: relative;
    min-height: 70px;
}

.title-description {
    margin-right: 50px;
}

.add-gallery-container {
    float: right; 
    right: 0;  
    top: 0px;
    z-index: 5;
    position: absolute;
}

.select-gallery-add-button {
    font-size: 1.2em;
    border-radius: 50%;
    margin-right:5px;
    margin-left:5px;
    margin-top: 5px;
    padding-left: 9px;
    padding-right: 11px;
    padding-top: 10px;
    padding-bottom: 10px;
}

.select-gallery-row{
    cursor: pointer;
}

.no-images-message {
    margin-top: 40px;
    margin-bottom: 40px;
    text-align: center;
}
</style>
