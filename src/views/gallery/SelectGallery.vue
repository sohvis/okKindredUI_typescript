<!-- used only in Xamarin for chosing a gallery -->
<template>
    <div class="container" id="gallerylist-container">
        <h1>
            {{ $t('message.ChooseGallery') }}
        </h1>

        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <tbody>
                    <tr v-for="gallery of galleries" 
                        :key="gallery.id" 
                        @click="selectGallery(gallery)"
                        class="choose-gallery-row">
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
        // window.console.log('GalleryList.vue mounted() call');

        try {
            // Load jwt from cookie and login
            await store.dispatch('restoreSession');
            await this.loadData();

        } catch (ex) {
            // window.console.log(`ex: ${ex}`);
            this.$router.push(`/accounts/login/?next=${this.$router.currentRoute.fullPath}`);
        }
    }

    private async loadData() {
        // window.console.log(`GalleryList.loadData()`);

        store.commit('updateLoading', true);

        try {
            // Get page 1
            const options = {
                uri: `${config.BaseApiUrl}${config.GalleryAPI}?page=1`,
                headers: store.getters.ajaxHeader,
                json: true,
            };

            const response = await request.get(options) as PagedResult<Gallery>;
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

                tasks.push(request.get(pageOptions));
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

   private selectGallery(gallery: Gallery) {
        window.console.log(`GalleryList.selectGallery(galleryId: ${gallery.id})`);
   }
}
</script>

<style scoped>
    .choose-gallery-row{
        cursor: pointer;
    }
</style>
