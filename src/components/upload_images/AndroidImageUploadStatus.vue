<template>
<div>
    <div class="row align-items-center">
        <div class="col-2">
            <img v-show="showImage" :id="`thumbnail-img-${index}`" class="thumbnail" />
        </div>
        <div class="col-6">
            <span>{{ fileName }}</span>
            <b-progress 
                :value="progress" 
                :max="100" 
                height="2rem" 
                show-progress 
                :animated="animated"
                :variant="variant">
            </b-progress>
        </div>
        <div class="col-4">
            <div  class="pending" v-if="state==='pending'">
                {{ $t('message.Pending') }}
            </div>
            <div class="uploading" v-if="state==='uploading'">
                {{ $t('message.Uploading') }}
            </div>
            <div class="processing" v-if="state==='processing'">
                <span class="spinner-border spinner-border-sm" role="status">
                </span>
                {{ $t('message.Processing') }}
            </div>
            <div class="done" v-if="state==='done'">
                <span class="oi oi-check"></span>
                {{ $t('message.Done') }}
            </div>
            <div class="failed" v-if="state==='failed'">
                <span class="oi oi-x"></span>
                {{ $t('message.Failed') }}
            </div>
        </div>
    </div>
    <hr/>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import * as request from 'request-promise-native';
import store from '../../store/store';
import configs from '../../config';
import CropArgs from '../../models/data/crop_args';
import Person from '../../models/data/person';
import fs from 'fs';
import BrowserDetection from '../../models/browserDetection';
import AndroidImage from '../../models/data/android_image';

@Component
export default class AndroidImageUploadStatus extends Vue {

    @Prop({ default: 0 })
    public galleryId?: number;

    @Prop({ default: 0 })
    public index?: number;

    public state: string = 'pending';

    public fileReader = new FileReader();

    public get androidImage(): AndroidImage | null {
        if (this.index != null) {
            return store.state.androidImagesToUpload[this.index];
        }

        return null;
    }

    public showImage: boolean = false;

    // Goes up to 100
    public progress: number = 0;

    public get fileName(): string {
        if (this.androidImage) {
            return this.androidImage.fileName;
        }

        return '';
    }

    public get androidImageIndexToUpload() {
        return store.state.androidImageIndexToUpload;
    }

    public get imageBase64Data(): string {
        if (this.index != null) {
            return store.state.androidImagesToUpload[this.index].base64Image;
        }

        return '';
    }

    public get animated(): boolean {
        switch (this.state) {
            case 'failed':
            case 'done':
                return false;
            default:
                return true;
        }
    }

    public get variant(): string {

        switch (this.state) {
            case 'failed':
                return 'danger';
            case 'processing':
                return 'warning';
            case 'done':
                return 'success';
            default:
                return 'default';
        }
    }

    private fileSize: number = 0;

    private req: XMLHttpRequest = new XMLHttpRequest();

    public getFileData() {
        // window.console.log('AndroidImageUploadStatus.getFileData()');

        if (BrowserDetection.isXamarinApp() && BrowserDetection.isAndroid() && this.androidImage) {
            // Xamarin Android App should pick up this route
            // window.console.log(`requesting image data for ${this.androidImage.path}`);
            window.location.href = `/xamarin_request_android_image_data/${this.androidImage.index}`;
        }
    }

    protected mounted() {
        // window.console.log('AndroidImageUploadStatus.mounted() called');
    }

    @Watch('androidImageIndexToUpload')
    private async upload() {
        // window.console.log('AndroidImageUploadStatus.upload()');

        if (this.galleryId && this.androidImage &&
                this.index === this.androidImageIndexToUpload &&
                this.state === 'pending' && this.androidImage.base64Image) {


                // window.console.log(`uploading android image`);
                const res = await fetch(this.androidImage.base64Image);
                const blob = await res.arrayBuffer();
                const file = new File([blob], this.fileName, {type: this.androidImage.mimeType});
                this.androidImage.file = file;

                this.fileReader.onload = this.fileReaderOnLoad;

                this.fileReader.readAsDataURL(this.androidImage.file);

                this.state = 'uploading';

                this.fileSize = this.androidImage.file.size;
                this.progress = 1;

                this.req = new XMLHttpRequest();
                this.req.responseType = 'json';
                const formData = new FormData();

                formData.append('picture', this.androidImage.file);
                formData.append('gallery_id', this.galleryId.toString());

                this.req.onload = this.onLoad;
                this.req.upload.onprogress = this.updateProgress;
                this.req.onerror = this.transferFailed;

                this.req.open('POST', `${configs.BaseApiUrl}${configs.ImageAPI}`);
                this.req.setRequestHeader('Authorization', `Bearer ${store.state.access_token}`);
                this.req.send(formData);
        }
    }

    private updateProgress(progress: any) {
        // window.console.log('AndroidImageUploadStatus.updateProgress()');

        this.progress = Math.min(100, progress.loaded / this.fileSize * 100);

        if (this.progress > 99) {
            this.state = 'processing';
            this.$emit('finishedUpload', this.index);
        }
    }

    private onLoad(e: any) {
        // window.console.log('AndroidImageUploadStatus.onLoad()');

        if (this.req.status === 200) {
            this.state = 'done';
            this.$emit('finishedProcessing', this.index);

            // Remove image to save memory
            if (BrowserDetection.isAndroid() || BrowserDetection.is_iOS()) {
                const img = document.getElementById(`thumbnail-img-${this.index}`) as HTMLImageElement;
                img.src = '';
                this.showImage = false;
            }

        } else {
            this.transferFailed(e);
        }
    }

    private transferFailed(e: any) {
        this.state = 'failed';
        this.$emit('finishedUpload', this.index);
        this.$emit('finishedProcessing', this.index);
    }

    private fileReaderOnLoad(e: any) {
        // window.console.log('AndroidImageUploadStatus.fileReaderOnLoad()');

        const img = document.getElementById(`thumbnail-img-${this.index}`) as HTMLImageElement;
        img.src = e.target.result;
        this.showImage = true;
    }
}
</script>

<style scoped>
.thumbnail {
    max-width: 100%;
    max-height: 100px;
    font-size: small;
}

.row {
    margin-top: 20px;
}

.done {
    color: green;
}

.failed {
    color: red;
}

.uploading {
    color: navy;
}

.processing {
    color: darkorange;
}

.pending {
    color: #777;
}
</style>
