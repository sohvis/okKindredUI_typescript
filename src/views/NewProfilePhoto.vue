<template>
  <div class="container">
    <h2>{{ $t('message.NewProfilePhoto') }}</h2>
    <ChooseFile v-show="state==='ChooseFile'" @fileSelected="fileSelected"/>
    <CropFile v-show="state==='CropImage'" v-bind:file="file" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as request from 'request-promise-native';
import store from '../store/store';
import { configs } from '../config';
import ChooseFile from '../components/NewProfilePhoto/ChooseFile.vue';
import CropFile from '../components/NewProfilePhoto/CropFile.vue';
 
@Component({
  components: {
    ChooseFile,
    CropFile,
  },
})
export default class NewProfilePhoto extends Vue {

    public state: string = 'ChooseFile';

    public file: string = '';

    protected async mounted() {
      window.console.log('NewProfilePhoto.vue mounted() call');
      this.state = 'ChooseFile';
    }

    private fileSelected(file: string) {
      this.file = file;
      this.state = 'CropImage';
    }
}
</script>

<!-- "scoped" attribute removed to fill screen -->
<style scoped>
</style>
