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
import { Promise } from 'q';
import Person from '../../models/data/person';
import InviteEmail from '../../models/data/invite_email';
import * as request from 'request-promise-native';
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
      window.console.log('ProfileInviteToJoinButton.vue initialize() called');
  }

  protected async mounted() {
    window.console.log('ProfileInviteToJoinButton.vue mounted() called');
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
    window.console.log('ProfileInviteToJoinButton.vue invite_allowed() called');
    if (!this.personId || this.profileIsCurrentUser()) {
      return false;
    }

    // Can invite if person is not already a user and not dead
    if (this.personUserId || this.yearOfDeath !== 0) {
          return false;

    } else {

        // Check if any pending email invites
        const options = {
            uri: `${configs.BaseApiUrl}${configs.InviteEmailAPI}${this.personId}/`,
            headers: store.getters.ajaxHeader,
            json: true,
        };

        try {
            const inviteEmail = await request.get(options) as InviteEmail;
            window.console.log(inviteEmail);
            this.pendingInvite = inviteEmail;
            const email = this.email || '';

            // Allow invite if email address is different
            return email !== inviteEmail.email_address;

        } catch (error) {
            window.console.log(error);
            return true;
        }
    }
  }

  private async inviteClicked() {
    window.console.log('ProfileInviteToJoinButton.inviteClicked()');

    // Need to capture email and language
    (this.$refs.emailModal as EmailModal).initialize();
  }

  private async profileUpdated() {
    await this.createInvite();

    this.$emit('profileUpdated');
  }

  private async createInvite() {
    window.console.log('ProfileInviteToJoinButton.createInvite()');

    const options = {
        uri: `${configs.BaseApiUrl}${configs.InviteEmailAPI}`,
        headers: store.getters.ajaxHeader,
        body: {
            person_id: this.personId,
          },
        json: true,
      };

    try {
      store.commit('updateLoading', true);
      const inviteEmail = await request.post(options) as InviteEmail;
      window.console.log(inviteEmail);
      this.displayButton = false;

    } catch (error) {
        store.commit('setErrorMessage', error);
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
