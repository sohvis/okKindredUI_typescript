<template>
    <b-button class="btn-profile" variant="primary" v-if="displayButton">{{ $t('message.InviteToJoin') }}</b-button>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Promise } from 'q';
import Person from './../models/data/person';
import InviteEmail from './../models/data/invite_email';
import * as request from 'request-promise-native';
import store from '../store/store';
import { configs } from '../config';

@Component({})
export default class InviteToJoinButton extends Vue {

  @Prop({default: null})
  public personId?: string | null;

  @Prop({default: 0})
  public yearOfDeath?: number;

  @Prop({default: null})
  public personUserId?: number | null;

  public displayButton: boolean = false;

  // Look to do something with this is UI
  public pendingInvite?: InviteEmail;

  private profileIsCurrentUser(): boolean {
    if (this.personId) {
      return store.state.users_person_id === this.personId;
    } else {
      return false;
    }
  }

  private async invite_allowed() {
    window.console.log('InviteToJoinButton.vue invite_allowed() called');
    if (!this.personId || this.profileIsCurrentUser()) {
      return false;
    }

    // Can invite if person is not already a user and not dead
    if (this.personUserId || this.yearOfDeath !== 0) {
          return false;

    } else {

        // Check if any pending email invites
        const options = {
            uri: `${configs.BaseApiUrl}${configs.InviteEmailAPI}/${this.personId}`,
            headers: store.getters.ajaxHeader,
            json: true,
        };

        try {
            const inviteEmail = await request.get(options) as InviteEmail;
            window.console.log(`Invite Email found:`);
            window.console.log(inviteEmail);
            this.pendingInvite = inviteEmail;
            return false;

        } catch (error) {
            window.console.log(error)
            return true;
        }
    }
  }

 
  public async initialize() {
      window.console.log('InviteToJoinButton.vue initialize() called');
  }

  protected async mounted() {
    window.console.log('InviteToJoinButton.vue mounted() called');
    this.displayButton = await this.invite_allowed();
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
