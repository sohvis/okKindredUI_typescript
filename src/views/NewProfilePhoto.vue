<template>
  <div class="container">
    <h2>{{ $t('message.NewProfilePhoto') }}</h2>
    <ChooseFile v-show="state==='ChooseFile'"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as request from 'request-promise-native';
import store from '../store/store';
import { configs } from '../config';
import ChooseFile from '../components/NewProfilePhoto/ChooseFile.vue';
 
@Component({
  components: {
    ChooseFile,
  },
})
export default class NewProfilePhoto extends Vue {

    public state: string = 'ChooseFile';

    protected async mounted() {
      window.console.log('NewProfilePhoto.vue mounted() call');
      this.state = 'ChooseFile';
    }
}
</script>

<!-- "scoped" attribute removed to fill screen -->
<style scoped>
</style>
