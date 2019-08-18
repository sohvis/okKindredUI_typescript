<template>
    <div>
        <p>
            {{ $t('message.UploadingImagePleaseWait') }}
        </p>

        <b-progress :value="progress" :max="100" height="2rem" show-progress animated></b-progress>

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

    public upload(data: CropArgs) {
        window.console.log('ImageUpload.upload()');
        store.commit('updateLoading', true);

        this.progress = 1;
        this.fileSize = data.file.size;

        this.req = new XMLHttpRequest();
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
        this.progress = Math.min(98, 1 + progress.loaded / this.fileSize * 97);
    }

    private onLoad(e: any) {
        window.console.log('ImageUpload.onLoad()');
        if (this.req.status === 200) {
            // Note: .response instead of .responseText
            window.console.log('ImageUpload TransferDone');
            this.progress = 100;

            store.dispatch('updatePerson', this.req.response);
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
</style>
