<template>
    <div>
      <p>
        <img :src="currentPhoto" />
      </p>
      <p>
        {{ $t('message.UploadNewProfilePhoto', { personName: name }) }}
      </p>
      <button class="btn btn-lg btn-success" @click="buttonClick">
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
import Person from '../../models/data/person';


@Component
export default class ChooseFile extends Vue {

  public name: string = '';

  public currentPhoto: string = '';

  protected mounted() {
    // window.console.log('ChooseFile.vue mounted() called');

    const selectedPerson = store.getters.selectedPerson as Person;

    // No selected person or data go back to family view
    if (selectedPerson) {
      this.name = selectedPerson.name;
      if (selectedPerson.small_thumbnail) {
        this.currentPhoto = selectedPerson.small_thumbnail;
      } else {
        this.currentPhoto = 'img/portrait_80.png';
      }

    } else {
      this.$router.push('/family/tree/');
    }
  }

  // Opens input file
  private buttonClick() {
    const input = document.getElementById('file-input') as HTMLInputElement;
    input.click();
  }

  private fileSelected(e: any) {

    // window.console.log(`ChooseFile.fileSelected()`);

    const files = e.target.files || e.dataTransfer.files;
    if (files.length === 1) {

      // window.console.log(files[0]);
      this.$emit('fileSelected', files[0]);
    }
  }
}
</script>

<style scoped>
</style>
