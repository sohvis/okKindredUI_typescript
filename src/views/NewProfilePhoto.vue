<template>
  <div class="container">
    <h2>{{ $t('message.NewProfilePhoto') }}</h2>
    <ChooseFile v-show="state==='ChooseFile'" @fileSelected="fileSelected"/>
    <CropFile ref="cropFile" v-show="state==='CropFile'" @back="setState('ChooseFile')"/>
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

    protected async mounted() {
      window.console.log('NewProfilePhoto.vue mounted() call');
      this.setState('ChooseFile');
    }

    private fileSelected(file: File) {
      window.console.log('NewProfilePhoto.fileSelected()');
      window.console.log('file:');
      window.console.log(file);

      this.setState('CropFile');

      (this.$refs.cropFile as CropFile).loadFile(file);
    }

    private setState(state: string) {
      this.state = state;
    }
}
</script>

<!-- "scoped" attribute removed to fill screen -->
<style scoped>
</style>
