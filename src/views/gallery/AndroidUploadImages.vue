<template>
    <div id="android-upload-images" class="container">

        <h2>
            {{ $t('message.UploadImages') }}
        </h2>

        <AndroidImageUploadStatus v-for="image in androidImagesToUpload"
            :key="image.index"
            :galleryId="galleryId"
            :index="image.index"
            :ref="`androidImageUploadStatus_${image.index}`"
            @finishedUpload="finishedAndroidUpload"
            @finishedProcessing="finishedAndroidProcessing">
        </AndroidImageUploadStatus>

        <UploadFinished 
            ref="uploadFinished"
            :failedCount="failedCount"
            :successCount="successCount"
            :backLink="`/gallery/${galleryId}/?page=${page}`" />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop} from 'vue-property-decorator';
import * as request from 'request-promise-native';
import store from '../../store/store';
import config from '../../config';
import AndroidImageUploadStatus from '../../components/upload_images/AndroidImageUploadStatus.vue';
import UploadFinished from '../../components/upload_images/UploadFinished.vue';
import BrowserDetection from '../../models/browserDetection';
import AndroidImage from '../../models/data/android_image';

@Component({
  components: {
      AndroidImageUploadStatus,
      UploadFinished,
  },
})
export default class AndroidUploadImages extends Vue {

    @Prop()
    public galleryId?: number;

    public uploading: boolean = false;

    public uploadingIndex: number = 0;

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

    public get androidImagesToUpload(): AndroidImage[] {
        return store.state.androidImagesToUpload;
    }

    public failedCount: number = 0;

    public successCount: number = 0;

    protected async mounted() {
        window.console.log('AndroidUploadImages.vue mounted() call');

        if ( this.androidImagesToUpload.length > 0) {
            this.processAndroidFiles(this.androidImagesToUpload);
        }
    }

    private processAndroidFiles(androidFiles: AndroidImage[]) {
        window.console.log('AndroidUploadImages.processAndroidFiles()');
        if (androidFiles.length === 0) {
            this.$router.push(`/gallery/${this.galleryId}/?page=${this.page}`);
        } else {
            this.uploading = true;
            this.uploadingIndex = 0;
            this.$nextTick(() => { this.startUpload(); });
        }
    }

    private startUpload() {
        window.console.log('AndroidUploadImages.startUpload()');

        // Clear the files in state to be uploaded
        this.failedCount = 0;
        this.successCount = 0;

        if (this.androidImagesToUpload.length > 0) {
            const firstUpload = (this.$refs[`androidImageUploadStatus_0`] as Vue[])[0] as AndroidImageUploadStatus;
            firstUpload.getFileData();
        }
    }


    private finishedAndroidUpload(fileIndex: number) {
        window.console.log(`UploadImages.finishedUpload(fileIndex: ${fileIndex})`);

        let processingCount = 0;
        let uploading = 0;

        for (let i = 0; i < this.androidImagesToUpload.length; i++) {
            const ref = `androidImageUploadStatus_${i}`;
            const uploadStatus = (this.$refs[ref] as Vue[])[0] as AndroidImageUploadStatus;

            if (uploadStatus.state === `processing`) {
                processingCount++;
            } else if (uploadStatus.state === `uploading`) {
                uploading++;
            }
        }

        // Limit number of processing files on android
        if (processingCount + uploading < 2) {
            this.uploadNextFile();
        }
    }

    private finishedAndroidProcessing(fileIndex: number) {
        window.console.log(`UploadImages.finishedAndroidProcessing(fileIndex: ${fileIndex})`);

        let success = 0;
        let failed = 0;
        let uploading = 0;

        for (let i = 0; i < this.androidImagesToUpload.length; i++) {
            const ref = `androidImageUploadStatus_${i}`;

            const uploadStatus = (this.$refs[ref] as Vue[])[0] as AndroidImageUploadStatus;

            if (uploadStatus.state === `failed`) {
                failed++;

            } else if (uploadStatus.state === `done`) {
                success++;

            } else if (uploadStatus.state === `uploading`) {
                uploading++;
            }
        }

        // All finished done
        if (failed + success === this.androidImagesToUpload.length) {
            this.successCount = success;
            this.failedCount = failed;

            const uploadFinished = this.$refs.uploadFinished as UploadFinished;
            uploadFinished.show();

        } else if (uploading  === 0) {
            this.uploadNextFile();
        }
    }

    private uploadNextFile() {

        for (let i = 0; i < this.androidImagesToUpload.length; i++) {
            const ref = `androidImageUploadStatus_${i}`;
            const uploadStatus = (this.$refs[ref] as Vue[])[0] as AndroidImageUploadStatus;

            if (uploadStatus.state === `pending`) {
                uploadStatus.getFileData();
                return;
            }
        }
    }
}
</script>

<style scoped>

</style>
