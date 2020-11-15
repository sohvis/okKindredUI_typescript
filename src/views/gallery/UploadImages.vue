<template>
    <div class="container">
        <!--Back link-->
        <p>
            <router-link
                to="/gallery/">
                {{ $t('message.AllGalleries') }}
            </router-link>
            / 
            <router-link
                :to="`/gallery/${galleryId}/`">
                {{ title }}
            </router-link> 
            / <router-link
                :to="`/gallery/${galleryId}/?page=${page}`">
                {{ page }}
            </router-link> 
            / {{ $t('message.UploadImages') }}
        </p>

        <h2>
            {{ $t('message.UploadImages') }}
        </h2>
        <button 
            id="file-input-button"
            v-if="!uploading"
            class="btn btn-lg btn-success" 
            @click="selectFilesClick">
            <span class="oi oi-plus" aria-hidden="true"></span>
            {{ $t('message.SelectFiles') }}
        </button>

        <input 
          id="file-input" 
          type="file" 
          :multiple="uploadMultiple"
          hidden 
          accept="image/x-png,image/gif,image/jpeg"
          @change="filesSelected" />

        <ImageUploadStatus v-for="(file, index) in files" 
            :key="index" 
            v-bind:galleryId="galleryId"
            v-bind:uploadIndex="index"
            :ref="`imageUploadStatus_${index}`"
            @finishedUpload="finishedUpload"
            @finishedProcessing="finishedProcessing">
        </ImageUploadStatus>

        <UploadFinished 
            ref="uploadFinished"
            :failedCount="failedCount"
            :successCount="successCount"
            :backLink="`/gallery/${galleryId}/?page=${page}`" />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop} from 'vue-property-decorator';
import store from '../../store/store';
import config from '../../config';
import ImageUploadStatus from '../../components/upload_images/ImageUploadStatus.vue';
import UploadFinished from '../../components/upload_images/UploadFinished.vue';
import BrowserDetection from '../../models/browserDetection';
import AndroidImage from '../../models/data/android_image';


@Component({
  components: {
      ImageUploadStatus,
      UploadFinished,
  },
})
export default class UploadImages extends Vue {

    @Prop()
    public galleryId?: number;

    public files: File[] = [];

    public uploading: boolean = false;

    public uploadingIndex: number = 0;

    public uploadMultiple: boolean = true;

    public get title(): string {
        return this.$route.query.title as string;
    }

    public get page(): number {
        if (this.$route.query.page) {
            return Number(this.$route.query.page);
        } else {
            return 1;
        }
    }

    public get appFilesToUpload(): File[] {
        return store.state.filesToUpload;
    }

    public get androidImageDetails(): AndroidImage[] {
        return store.state.androidImagesToUpload;
    }

    public failedCount: number = 0;

    public successCount: number = 0;

    protected async mounted() {
        // window.console.log('UploadImages.vue mounted() call');

        // Multiple file upload not working on Firefox Android
        if (BrowserDetection.isFirefox() && BrowserDetection.isAndroid()) {
            this.uploadMultiple = false;
        }

        this.$nextTick(() => {
            if ( this.appFilesToUpload.length > 0) {
                this.processFiles(this.appFilesToUpload);
            } else {
                this.selectFilesClick();
            }
        });

        store.dispatch('updateRouteLoaded');
    }

    @Watch('appFilesToUpload')
    private filesUploadedFromApp() {

        // check component is showing
        const button = document.getElementById('file-input-button') as HTMLButtonElement;
        if (button && button.offsetParent) {

            if ( this.appFilesToUpload.length > 0) {
                this.processFiles(this.appFilesToUpload);
            }
        }
    }


    @Watch('androidImageDetails')
    private androidImageDetailsChanged() {
        window.console.log('UploadImages.androidImageDetailsChanged()');

        // check component is showing
        const button = document.getElementById('file-input-button') as HTMLButtonElement;
        if (button && button.offsetParent) {

            if ( this.androidImageDetails.length > 0) {
                this.$router.push(`/gallery/${this.galleryId}/android_upload/`);
            }
        }
    }


    private selectFilesClick() {

        if (BrowserDetection.isXamarinApp() && BrowserDetection.isAndroid()) {
            // Xamarin Android App should pick up this route
            window.location.href = `/xamarin_external_filepicker_multiple/`;

        } else {
            const input = document.getElementById('file-input') as HTMLInputElement;
            input.click();
        }
    }

    private filesSelected(e: any) {
        // window.console.log('UploadImages.filesSelected()');
        // window.console.log(e);

        const files = e.target.files || e.dataTransfer.files;
        this.processFiles(files);
    }

    private processFiles(files: File[]) {
        if (files.length === 0) {
            this.$router.push(`/gallery/${this.galleryId}/?page=${this.page}`);
        } else {
            this.files = files;
            this.uploading = true;
            this.uploadingIndex = 0;

            this.$nextTick(() => { this.startUpload(); });
        }
    }

    private startUpload() {
        window.console.log('UploadImages.startUpload()');

        // Clear the files in state to be uploaded
        store.dispatch('setFilesToUpload', []);
        this.failedCount = 0;
        this.successCount = 0;

        if (this.files.length > 0) {

            store.commit('updateLoading', true);
            for (let i = 0; i < this.files.length; i++) {
                const ref = `imageUploadStatus_${i}`;
                const file = this.files[i];

                const uploadStatus = (this.$refs[ref] as Vue[])[0] as ImageUploadStatus;
                if (uploadStatus) {
                    uploadStatus.loadFile(file);
                }
            }

            store.commit('updateLoading', false);
            const firstUpload = (this.$refs[`imageUploadStatus_0`] as Vue[])[0] as ImageUploadStatus;
            firstUpload.upload();
        }
    }

    private finishedUpload(fileIndex: number) {
        // window.console.log(`UploadImages.finishedUpload(fileIndex: ${fileIndex})`);

        if (fileIndex < this.files.length - 1) {
            const nextUpload = (this.$refs[`imageUploadStatus_${fileIndex + 1}`] as Vue[])[0]  as ImageUploadStatus;
            nextUpload.upload();
        }
    }

    private finishedProcessing(fileIndex: number) {
        // window.console.log(`UploadImages.finishedProcessing(fileIndex: ${fileIndex})`);

        let success = 0;
        let failed = 0;

        for (let i = 0; i < this.files.length; i++) {
            const ref = `imageUploadStatus_${i}`;

            const uploadStatus = (this.$refs[ref] as Vue[])[0] as ImageUploadStatus;

            if (uploadStatus.state === `failed`) {
                failed++;

            } else if (uploadStatus.state === `done`) {
                success++;
            }
        }

        // All finished done
        if (failed + success === this.files.length) {
            this.successCount = success;
            this.failedCount = failed;

            const uploadFinished = this.$refs.uploadFinished as UploadFinished;
            uploadFinished.show();
        }
    }
}
</script>

<style scoped>

</style>
