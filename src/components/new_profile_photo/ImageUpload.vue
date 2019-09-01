<template>
    <div>
        <p>
            {{ $t('message.UploadingImagePleaseWait') }}
        </p>

        <b-progress :value="progress" :max="100" height="2rem" show-progress animated :variant="variant"></b-progress>
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
export default class ImageUpload extends Vue {

    // Goes up to 100
    public progress: number = 3;

    private fileSize: number = 0;

    private req: XMLHttpRequest = new XMLHttpRequest();

    private state: string = `uploading`;

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

    public upload(data: CropArgs) {
        window.console.log('ImageUpload.upload()');
        store.commit('updateLoading', true);

        this.state = 'uploading';
        this.progress = 0;
        this.fileSize = data.file.size;

        this.req = new XMLHttpRequest();
        this.req.responseType = 'json';
        const formData = new FormData();

        formData.append('picture', data.file);
        formData.append('x', data.cropX.toString());
        formData.append('y', data.cropY.toString());
        formData.append('w', data.cropWidth.toString());
        formData.append('h', data.cropHeight.toString());
        formData.append('r', data.antiClockwiseRotation.toString());

        this.req.onload = this.onLoad;
        this.req.upload.onprogress = this.updateProgress;
        this.req.onerror = this.transferFailed;

        this.req.open('PUT', `${configs.BaseApiUrl}${configs.ProfileImageAPI}${data.personId}/`);
        this.req.setRequestHeader('Authorization', `Bearer ${store.state.access_token}`);
        // this.req.setRequestHeader('Content-Type', 'application/json');
        this.req.send(formData);
    }

    protected mounted() {
        window.console.log('ImageUpload.vue mounted() called');
    }

    private updateProgress(progress: any) {
        window.console.log('ImageUpload.updateProgress()');

        // Start at 3 and end at 98 to allow for processing time
        this.progress = Math.min(100, progress.loaded / this.fileSize * 100);

        if (this.progress > 99) {
            this.state = 'processing';
        }
    }

    private onLoad(e: any) {
        window.console.log('ImageUpload.onLoad()');
        if (this.req.status === 200) {
            // Note: .response instead of .responseText
            window.console.log('ImageUpload TransferDone');
            this.progress = 100;

            const updatedPerson =  this.req.response as Person;

            store.dispatch('updatePerson', updatedPerson);
            store.commit('updateLoading', false);

            this.$emit('done');
        } else {
            this.transferFailed(e);
        }
    }

    private transferFailed(error: any) {
        window.console.log('ImageUpload.transferFailed()');

        window.console.log(error);


        store.commit('updateLoading', false);
        store.commit('setErrorMessage', this.req.response);

        this.$emit('failed');
    }
}
</script>

<style scoped>
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
