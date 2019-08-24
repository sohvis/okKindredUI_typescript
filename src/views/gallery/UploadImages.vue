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
            v-if="!uploading"
            class="btn btn-lg btn-success" 
            @click="selectFilesClick">
            <span class="oi oi-plus" aria-hidden="true"></span>
            {{ $t('message.SelectFiles') }}
        </button>

        <input 
          id="file-input" 
          type="file" 
          multiple
          hidden 
          accept="image/x-png,image/gif,image/jpeg"
          @change="filesSelected" />

          <ImageUploadStatus v-for="(file, index) in files" 
                :key="index" 
                v-bind:gallerId="galleryId"
                v-bind:uploadIndex="index"
                :ref="`imageUploadStatus_${index}`"
                @finishedUpload="finishedUpload">
          </ImageUploadStatus>
      
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop} from 'vue-property-decorator';
import * as request from 'request-promise-native';
import store from '../../store/store';
import config from '../../config';
import ImageUploadStatus from '../../components/gallery/ImageUploadStatus.vue';

@Component({
  components: {
      ImageUploadStatus,
  },
})
export default class UploadImages extends Vue {

    @Prop()
    public galleryId?: number;

    public files: File[] = [];

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

    protected async mounted() {
        window.console.log('UploadImages.vue mounted() call');

        this.selectFilesClick();
    }

    private selectFilesClick() {
        const input = document.getElementById('file-input') as HTMLInputElement;
        input.click();
    }

    private filesSelected(e: any) {
        window.console.log('UploadImages.filesSelected()');

        const files = e.target.files || e.dataTransfer.files;
        if (files.length === 0) {
            this.$router.push(`/gallery/${this.galleryId}/?page=${this.page}`);
        } else {
            this.files = files;
            this.uploading = true;
            this.uploadingIndex = 0;

            this.$nextTick(() => this.startUpload);
        }
    }

    private startUpload() {
        for (let i = 0; i < this.files.length; i++) {
            const ref = `imageUploadStatus_${i}`;
            const file = this.files[i];

            const uploadStatus = this.$refs[ref] as ImageUploadStatus;
            if (uploadStatus) {
                uploadStatus.loadFile(file);
            }
        }

        const firstUpload = this.$refs[`imageUploadStatus_0`] as ImageUploadStatus;
        firstUpload.upload();
    }

    private finishedUpload(fileIndex: number) {
        const nextUpload = this.$refs[`imageUploadStatus_${fileIndex + 1}`] as ImageUploadStatus;
        nextUpload.upload();
    }
}
</script>

<style scoped>

</style>
