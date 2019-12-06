<template>
<b-modal
    ref="downloadModal"
    hide-footer
    hide-header
    centered 
    v-bind:no-close-on-esc="true"
    v-bind:no-close-on-backdrop="true">

    <div class="text-center">
        <h4 v-show="gatheringImages" class="download-modal">
            <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Loading...</span>
            </div>
            Gathering Images
        </h4>

        <h4 v-show="!downloadedMb && !gatheringImages" class="download-modal">
            <div class="spinner-border text-warning" role="status">
                <span class="sr-only">Loading...</span>
            </div>
            Processing Images
        </h4>

        <h4 v-show="downloadedMb && !gatheringImages" class="download-modal">
            <div class="spinner-border text-success" role="status">
                <span class="sr-only">Loading...</span>
            </div>
            Downloading {{ downloadedMb }} Mb
        </h4>
    </div>

</b-modal>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop} from 'vue-property-decorator';
import { BModal } from 'bootstrap-vue';
import * as request from 'request-promise-native';
import store from '../../store/store';
import config from '../../config';
import Image from '../../models/data/image';
import PagedResult from '../../models/data/paged_results';

@Component({
  components: {
  },
})
export default class DownloadMultipleImages extends Vue {

    public gatheringImages: boolean = false;

    public downloadedMb: string = '';

    private req: XMLHttpRequest = new XMLHttpRequest();

    private warmedUp: boolean = false;

    // This function will send nothing to the endpoint to
    // warm it up so Azure provisions it
    public async warmUpFunction() {

        if (!this.warmedUp) {
            const req = new XMLHttpRequest();
            // Empty body
            const body = { };
            req.open('POST', `${config.DownloadImagesAPI}`);
            req.send(JSON.stringify(body));
        }
    }

    public async downloadGalleries(galleryIds: number[]) {
        store.commit('updateLoading', true);
        this.gatheringImages = true;

        (this.$refs.downloadModal as BModal).show();

        const tasks = new Array<Promise<Image[]>>();

        for (const galleryId of galleryIds) {
            tasks.push(this.loadImagesFromGallery(galleryId));
        }

        const results = await Promise.all(tasks);
        const images = new Array<string>();

        for (const result of results) {
            for (const image of result) {
                images.push(image.original_image);
            }
        }

        this.download(images);

        store.commit('updateLoading', false);
    }

    public download(images: string[]) {
        window.console.log('DownloadMultipleImages.download()');
        this.gatheringImages = false;
        this.downloadedMb = '';
        store.commit('updateLoading', true);

        (this.$refs.downloadModal as BModal).show();

        this.req = new XMLHttpRequest();
        this.req.responseType = 'blob';
        const body = {
                    token: store.state.access_token,
                    zip_filename: 'download.zip',
                    images,
        };

        this.req.onload = this.onLoad;
        this.req.addEventListener('progress', this.updateProgress);
        this.req.onerror = this.transferFailed;

        this.req.open('POST', `${config.DownloadImagesAPI}`);
        this.req.send(JSON.stringify(body));

    }

    private onLoad(e: any) {
        if (this.req.status === 200) {
            const blob = new Blob([this.req.response], { type: 'application/zip' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `${this.$t('message.Download')}.zip`;
            link.click();

            store.commit('updateLoading', false);
            (this.$refs.downloadModal as BModal).hide();
        } else {
            this.transferFailed(e);
        }
    }

    private transferFailed(error: any) {
        store.commit('updateLoading', false);
        store.commit('setErrorMessage', this.req.response);
        (this.$refs.downloadModal as BModal).hide();
    }

    private updateProgress(progress: ProgressEvent) {
        if (progress && progress.loaded) {
            this.downloadedMb = (progress.loaded / 1024 / 1024).toFixed(2);
        }
    }

    private async loadImagesFromGallery(galleryId: number): Promise<Image[]> {
        window.console.log(`DownloadMultipleImages.updateProgress(galleryId: ${galleryId})`);
        const images = new Array<Image>();
        const firstPage = await this.loadImagesFromGalleryPage(galleryId, 1);

        const totalPages = Math.max(1, Math.ceil(firstPage.count / config.PaginationPageSize));
        window.console.log(`totalPages: ${totalPages}`);

        const tasks = new Array<Promise<PagedResult<Image>>>();
        for (let pageNo = 2; pageNo <= totalPages; pageNo++) {
            tasks.push(this.loadImagesFromGalleryPage(galleryId, pageNo));
        }

        const results = await Promise.all(tasks);
        results.unshift(firstPage);

        for (const result of results) {
            images.push(...result.results);
        }

        return images;
    }

    private async loadImagesFromGalleryPage(galleryId: number, page: number): Promise<PagedResult<Image>> {
        const options = {
            uri: `${config.BaseApiUrl}${config.ImageAPI}?gallery_id=${galleryId}&page=${page}`,
            headers: store.getters.ajaxHeader,
            json: true,
        };

        const response = await request.get(options) as PagedResult<Image>;

        return response;
    }
}
</script>

<style scoped>
.download-modal {
    margin-top: 40px;
    margin-bottom: 40px;
    margin-left: auto;
    margin-right: auto;
}
</style>
