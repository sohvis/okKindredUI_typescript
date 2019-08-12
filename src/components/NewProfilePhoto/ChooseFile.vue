<template>
    <div>
      <p>
        {{ $t('message.UploadNewProfilePhoto') }}
      </p>
      <b-button variant="success" @click="click">
        <span class="oi oi-plus" aria-hidden="true"></span>
        {{ $t('message.SelectFile') }}
      </b-button>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import store from '../../store/store';
import configs from '../../config';


@Component({
  components: {
  },
})
export default class ChooseFile extends Vue {

  
  protected mounted() {
    window.console.log('ChooseFile.vue mounted() called');
  }

}
</script>

<style scoped>
</style>
