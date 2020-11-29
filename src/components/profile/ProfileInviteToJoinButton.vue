<template>
    <b-button class="btn-profile" variant="outline-secondary" 
      v-if="displayButton" @click="inviteClicked">
      <span class="oi oi-envelope-closed" aria-hidden="true"></span>
      {{ $t('message.InviteToJoin') }}

        <EmailModal 
          ref="emailModal"
          :personId="personId"
          :email="email"
          :language="language"
          @profileUpdated="profileUpdated" />
    </b-button>

</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import APIException from '@/models/data/api_exception';
import Person from '../../models/data/person';
import InviteEmail from '../../models/data/invite_email';
import store from '../../store/store';
import { configs } from '../../config';
import EmailModal from './EmailModal.vue';


@Component({
  components: {
      EmailModal,
  },
})
export default class ProfileInviteToJoinButton extends Vue {

  @Prop({default: null})
  public personId?: string | null;

  @Prop({default: 0})
  public yearOfDeath?: number;

  @Prop({default: null})
  public personUserId?: number | null;

  @Prop({default: ''})
  public email?: string;

  @Prop({default: ''})
  public language?: string;

  public displayButton: boolean = false;

  // Look to do something with this is UI
  public pendingInvite?: InviteEmail;


  public async initialize() {
      // window.console.log('ProfileInviteToJoinButton.vue initialize() called');
  }

  protected async mounted() {
    // window.console.log('ProfileInviteToJoinButton.vue mounted() called');
    this.displayButton = await this.invite_allowed();
  }

  private profileIsCurrentUser(): boolean {
    if (this.personId) {
      return store.state.users_person_id === this.personId;
    } else {
      return false;
    }
  }

  private async invite_allowed() {
    // window.console.log('ProfileInviteToJoinButton.vue invite_allowed() called');
    if (!this.personId || this.profileIsCurrentUser()) {
      return false;
    }

    // Can invite if person is not already a user and not dead
    if (this.personUserId || this.yearOfDeath !== 0) {
          return false;

    } else {

        // Check if any pending email invites
        const options: AxiosRequestConfig = {
            url: `${configs.BaseApiUrl}${configs.InviteEmailAPI}${this.personId}/`,
            headers: store.getters.ajaxHeader,
            method: 'GET',
            responseType: 'json',
        };

        try {
            const response = await axios.request(options) as AxiosResponse<InviteEmail>;
            // window.console.log(response);
            this.pendingInvite = response.data;
            const email = this.email || '';

            // Allow invite if email address is different
            return email !== response.data.email_address;

        } catch (error) {
            // window.console.log(error);
            return true;
        }
    }
  }

  private async inviteClicked() {
    // window.console.log('ProfileInviteToJoinButton.inviteClicked()');

    // Need to capture email and language
    (this.$refs.emailModal as EmailModal).initialize();
  }

  private async profileUpdated() {
    await this.createInvite();

    this.$emit('profileUpdated');
  }

  private async createInvite() {
    // window.console.log('ProfileInviteToJoinButton.createInvite()');

    const options: AxiosRequestConfig = {
        url: `${configs.BaseApiUrl}${configs.InviteEmailAPI}`,
        headers: store.getters.ajaxHeader,
        data: {
            person_id: this.personId,
          },
        method: 'POST',
        responseType: 'text',
      };

    try {
      store.commit('updateLoading', true);
      const response = await axios.request(options) as AxiosResponse<InviteEmail>;
      // window.console.log(response);
      this.displayButton = false;

    } catch (error) {
      const axiosError = error as AxiosError<APIException>;
      store.commit('setErrorMessage', axiosError?.response?.data?.detail || error.toString());
    }

    store.commit('updateLoading', false);
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
