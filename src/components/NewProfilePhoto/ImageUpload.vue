<template>
    <div>
        <p>
            {{ $t('message.UploadingImagePleaseWait') }}
        </p>

        <b-progress :value="progress" max="100" show-progress animated></b-progress>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import store from '../../store/store';
import configs from '../../config';
import CropArgs from '../../models/data/crop_args';

@Component
export default class ImageUpload extends Vue {

    // Goes up to 100
    public progress: number = 5;

    public upload(data: CropArgs) {
        window.console.log('ImageUpload.upload()');
    }

    protected mounted() {
        window.console.log('ImageUpload.vue mounted() called');
    }

}
</script>

<style scoped>
</style>
