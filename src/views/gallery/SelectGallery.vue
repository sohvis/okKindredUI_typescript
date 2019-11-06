<!-- used only in Xamarin for chosing a gallery -->
<template>
    <div class="container" id="gallerylist-container">
        <h1>
            {{ $t('message.SelectGallery') }}
        </h1>

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
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop} from 'vue-property-decorator';
import * as request from 'request-promise-native';
import store from '../../store/store';
import config from '../../config';
import PagedResult from '../../models/data/paged_results';
import Gallery from '../../models/data/gallery';

@Component({
  components: {
  },
})
export default class SelectGallery extends Vue {

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
}
</script>

<style scoped>
    .select-gallery-row{
        cursor: pointer;
    }
</style>
