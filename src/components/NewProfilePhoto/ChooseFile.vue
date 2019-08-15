<template>
    <div>
      <p>
        {{ $t('message.UploadNewProfilePhoto') }}
      </p>
      <button class="btn btn-success" @click="buttonClick">
        <span class="oi oi-plus" aria-hidden="true"></span>
        {{ $t('message.SelectFile') }}
        <input 
          id="file-input" 
          type="file" 
          hidden accept="image/x-png,image/gif,image/jpeg"
          @change="fileSelected" />
      </button>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import store from '../../store/store';
import configs from '../../config';


@Component
export default class ChooseFile extends Vue {

  protected mounted() {
    window.console.log('ChooseFile.vue mounted() called');
  }

  // Opens input file
  private buttonClick() {
    const input = document.getElementById('file-input') as HTMLInputElement;
    input.click();
  }

  private fileSelected(e: any) {

    window.console.log(`ChooseFile.fileSelected()`);

    const files = e.target.files || e.dataTransfer.files;
    if (files.length === 1) {

      window.console.log(files[0]);
      this.$emit('fileSelected', files[0]);
    }
  }
}
</script>

<style scoped>
</style>
