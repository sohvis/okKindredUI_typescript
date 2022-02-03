<template>
    <b-button class="btn-profile" variant="primary" 
        v-if="displayButton" @click="click">
      <span class="oi oi-image" aria-hidden="true"></span>
      {{ $t('message.Photos') }}
    </b-button>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import APIException from '@/models/data/api_exception';
import Image from '../../models/data/image';
import PagedResult from '../../models/data/paged_results';
import store from '../../store/store';
import { configs } from '../../config';

@Component({})
export default class ProfileGalleryButton extends Vue {

  @Prop({default: null})
  public personId?: string | null;

  public displayButton: boolean = false;


  public async initialize() {
      // window.console.log('ProfileGalleryButton.vue initialize() called');
  }

  protected async mounted() {
    // window.console.log('ProfileGalleryButton.vue mounted() called');
    this.displayButton = await this.doesPersonHaveTaggedPictures();
  }

  private async doesPersonHaveTaggedPictures() {

    // window.console.log('ProfileGalleryButton.vue doesPersonHaveTaggedPictures() called');

    if (!this.personId) {
      return false;
    }

    // Check if any pending email invites
    const options: AxiosRequestConfig = {
        url: `${configs.BaseApiUrl}${configs.ImageAPI}?person_id=${this.personId}`,
        headers: store.getters.ajaxHeader,
        method: 'GET',
        responseType: 'json',
    };

    try {
        const response = await axios.request(options) as AxiosResponse<PagedResult<Image>>;
        return response.data.count > 0;

    } catch (error) {
        const axiosError = error as AxiosError<APIException>;
        store.commit('setErrorMessage', axiosError?.response?.data?.detail || (error as Error).toString());
        return false;
    }

  }

  private click() {
    this.$router.push(`/person_gallery/?page=1`);
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
