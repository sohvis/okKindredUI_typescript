<template>
  <div class="container">
    <h2 id="new-profile-photo-header">{{ $t('message.NewProfilePhoto') }}</h2>

    <ChooseFile 
        v-show="state==='ChooseFile'" 
        @fileSelected="fileSelected"/>

    <CropFile 
        ref="cropFile" 
        v-show="state==='CropFile'" 
        @back="chooseFile()"
        @next="uploadFile"/>

    <ImageUpload 
        ref="imageUpload" 
        v-show="state==='ImageUpload'" 
        @done="uploadDone"
        @failed="chooseFile()"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch} from 'vue-property-decorator';
import * as request from 'request-promise-native';
import store from '../store/store';
import { configs } from '../config';
import CropArgs from '../models/data/crop_args';
import ChooseFile from '../components/new_profile_photo/ChooseFile.vue';
import CropFile from '../components/new_profile_photo/CropFile.vue';
import ImageUpload from '../components/new_profile_photo/ImageUpload.vue';

@Component({
  components: {
    ChooseFile,
    CropFile,
    ImageUpload,
  },
})
export default class NewProfilePhoto extends Vue {

    public state: string = 'ChooseFile';

    public get appFilesToUpload(): File[] {
        return store.state.filesToUpload;
    }

    protected async mounted() {
      // window.console.log('NewProfilePhoto.vue mounted() call');
      this.chooseFile();

      store.dispatch('updateRouteLoaded');
    }

    private chooseFile() {
      (this.$refs.cropFile as CropFile).resetRotation();


      if (store.state.filesToUpload.length === 0) {
        this.setState('ChooseFile');

      } else {
        this.fileSelected(store.state.filesToUpload[0]);
      }
    }

    @Watch('appFilesToUpload')
    private filesUploadedFromApp() {
        // check component is showing
        const header = document.getElementById('new-profile-photo-header') as HTMLHtmlElement;
        if (header.offsetParent) {

            if ( this.appFilesToUpload.length > 0) {
                this.fileSelected(this.appFilesToUpload[0]);
            }
        }
    }

    private fileSelected(file: File) {
      // window.console.log('NewProfilePhoto.fileSelected()');
      // window.console.log('file:');
      // window.console.log(file);

      this.setState('CropFile');

      (this.$refs.cropFile as CropFile).loadFile(file);
    }

    private setState(state: string) {
      this.state = state;
    }

    private async uploadFile(cropArgs: CropArgs) {
      this.setState('ImageUpload');

      // Clear the files in state to be uploaded
      store.dispatch('setFilesToUpload', []);

      await (this.$refs.imageUpload as ImageUpload).upload(cropArgs);
    }

    private uploadDone() {
      this.$router.push(`/family/tree/`);
    }
}
</script>

