<template>
    <b-button class="btn-profile" variant="primary" 
        v-if="displayButton" @click="click">
      <span class="oi oi-image" aria-hidden="true"></span>
      {{ $t('message.Photos') }}
    </b-button>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Promise } from 'q';
import Image from '../../models/data/image';
import PagedResult from '../../models/data/paged_results';
import * as request from 'request-promise-native';
import store from '../../store/store';
import { configs } from '../../config';

@Component({})
export default class ProfileGalleryButton extends Vue {

  @Prop({default: null})
  public personId?: string | null;

  public displayButton: boolean = false;


  public async initialize() {
      window.console.log('ProfileGalleryButton.vue initialize() called');
  }

  protected async mounted() {
    window.console.log('ProfileGalleryButton.vue mounted() called');
    this.displayButton = await this.doesPersonHaveTaggedPictures();
  }

  private async doesPersonHaveTaggedPictures() {

    window.console.log('ProfileGalleryButton.vue doesPersonHaveTaggedPictures() called');

    if (!this.personId) {
      return false;
    }

    // Check if any pending email invites
    const options = {
        uri: `${configs.BaseApiUrl}${configs.ImageAPI}?person_id=${this.personId}`,
        headers: store.getters.ajaxHeader,
        json: true,
    };

    try {
        const images = await request.get(options) as PagedResult<Image>;
        return images.count > 0;

    } catch (error) {
        store.commit('setErrorMessage', error);
        return false;
    }

  }

  private click() {
    this.$router.push(`/person_gallery/`);
  }
}
</script>

<!-- "scoped" attribute removed to fill screen -->
<style scoped>

  .btn-invite {
      width: 200px;
      margin: 5px 0px 5px 0px;
  }

</style>
