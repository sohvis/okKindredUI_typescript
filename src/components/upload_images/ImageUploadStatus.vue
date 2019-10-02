<template>
<div>
    <div class="row align-items-center">
        <div class="col-2">
            <img :id="`thumbnail-img-${uploadIndex}`" class="thumbnail" />
        </div>
        <div class="col-6">
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
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as request from 'request-promise-native';
import store from '../../store/store';
import configs from '../../config';
import CropArgs from '../../models/data/crop_args';
import Person from '../../models/data/person';
import fs from 'fs';

@Component
export default class ImageUploadStatus extends Vue {

    @Prop({ default: 0 })
    public galleryId?: number;

    @Prop({ default: 0 })
    public uploadIndex?: number;

    public state: string = 'pending';

    public fileReader = new FileReader();

    public file: File | null = null;

    // Goes up to 100
    public progress: number = 0;

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

    public loadFile(file: File) {
        // window.console.log('ImageUploadStatus.loadFile()');
        // window.console.log(file);

        this.file = file;
        this.state = 'pending';
        this.progress = 0;
        this.fileReader.onload = this.fileReaderOnLoad;
        this.fileReader.readAsDataURL(file);
    }

    public upload() {
        // window.console.log('ImageUploadStatus.upload()');

        // window.console.log(`this.galleryId: ${this.galleryId}`);
        if (this.galleryId && this.file && this.state === 'pending') {

            this.state = 'uploading';

            this.fileSize = this.file.size;
            this.progress = 1;

            this.req = new XMLHttpRequest();
            this.req.responseType = 'json';
            const formData = new FormData();

            formData.append('picture', this.file);
            formData.append('gallery_id', this.galleryId.toString());

            this.req.onload = this.onLoad;
            this.req.upload.onprogress = this.updateProgress;
            this.req.onerror = this.transferFailed;

            this.req.open('POST', `${configs.BaseApiUrl}${configs.ImageAPI}`);
            this.req.setRequestHeader('Authorization', `Bearer ${store.state.access_token}`);
            this.req.send(formData);
        }
    }

    protected mounted() {
        // window.console.log('ImageUploadStatus.vue mounted() called');
    }

    private updateProgress(progress: any) {
        // window.console.log('ImageUploadStatus.updateProgress()');

        this.progress = Math.min(100, progress.loaded / this.fileSize * 100);

        if (this.progress > 99) {
            this.state = 'processing';
            this.$emit('finishedUpload', this.uploadIndex);
        }
    }

    private onLoad(e: any) {
        // window.console.log('ImageUploadStatus.onLoad()');

        if (this.req.status === 200) {
            this.state = 'done';
            this.$emit('finishedProcessing', this.uploadIndex);
        } else {
            this.transferFailed(e);
        }
    }

    private transferFailed(e: any) {
        this.state = 'failed';
        this.$emit('finishedUpload', this.uploadIndex);
        this.$emit('finishedProcessing', this.uploadIndex);
    }

    private fileReaderOnLoad(e: any) {
        // window.console.log('ImageUploadStatus.fileReaderOnLoad()');
        // window.console.log(e);

        const img = document.getElementById(`thumbnail-img-${this.uploadIndex}`) as HTMLImageElement;
        img.src = e.target.result;
    }
}
</script>

<style scoped>
.thumbnail {
    max-width: 100%;
    max-height: 100px;
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
