<template>
    <div class="row">
        <div class="col-2">
            <img :src="imgData" class="thumbnail" />
        </div>
        <div class="col-8">
            <b-progress :value="progress" :max="100" height="2rem" show-progress animated></b-progress>
        </div>
        <div class="col-2">
            <div v-if="state==='pending'">
                {{ $t('message.Pending') }}
            </div>
            <div v-if="state==='uploading'">
                {{ $t('message.Uploading') }}
            </div>
            <div v-if="state==='processing'">
                <span class="spinner-border spinner-border-sm" role="status">
                </span>
                {{ $t('message.Processing') }}
            </div>
            <div v-if="state==='done'">
                <span class="oi oi-check"></span>
                {{ $t('message.Done') }}
            </div>
            <div v-if="state==='failed'">
                <span class="oi oi-x"></span>
                {{ $t('message.Failed') }}
            </div>
        </div>
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

    public imgData: string = '';

    public fileReader = new FileReader();

    public file: File | null = null;

    // Goes up to 100
    public progress: number = 0;

    private fileSize: number = 0;

    private req: XMLHttpRequest = new XMLHttpRequest();

    public loadFile(file: File) {
        this.file = file;
        this.state = 'pending';
        this.progress = 0;
        this.fileReader.onload = this.fileReaderOnLoad;
        this.fileReader.readAsDataURL(file);
    }

    public upload() {
        window.console.log('ImageUploadStatus.upload()');

        if (this.galleryId && this.file) {

            this.state = 'uploading';

            this.fileSize = this.file.size;
            this.progress = 1;

            this.req = new XMLHttpRequest();
            const formData = new FormData();

            formData.append('picture', this.file);
            formData.append('gallery_id', this.galleryId.toString());

            this.req.onload = this.onLoad;
            this.req.upload.onprogress = this.updateProgress;
            this.req.onerror = this.transferFailed;

            this.req.open('PUT', `${configs.BaseApiUrl}${configs.ImageAPI}/`);
            this.req.setRequestHeader('Authorization', `Bearer ${store.state.access_token}`);
            this.req.send(formData);
        }
    }

    protected mounted() {
        window.console.log('ImageUploadStatus.vue mounted() called');
    }

    private updateProgress(progress: any) {
        window.console.log('ImageUploadStatus.updateProgress()');

        this.progress = Math.min(100, progress.loaded / this.fileSize * 100);

        if (this.progress > 99) {
            this.state = 'processing';
            this.$emit('finishedUpload', this.uploadIndex);
        }
    }

    private onLoad(e: any) {
        window.console.log('ImageUploadStatus.onLoad()');
        if (this.req.status === 200) {
            this.state = 'done';
        } else {
            this.state = 'failed';
            this.$emit('finishedUpload', this.uploadIndex);
        }
    }

    private transferFailed() {
        this.state = 'failed';
        this.$emit('uploaded', this.uploadIndex);
    }

    private fileReaderOnLoad(e: any) {
        window.console.log('ImageUploadStatus.fileReaderOnLoad()');

        this.imgData = e.target.result;
    }
}
</script>

<style scoped>
.thumbnail {
    width: 100%;
}
</style>
