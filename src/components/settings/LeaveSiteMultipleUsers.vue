<template>
  <div>
    
    <p>{{ $t('message.CurrentUsersAccessToFamilyData') }}</p>
    <ul>
      <li v-for="user in users" 
        v-bind:key="user.email">
        <strong>{{ user.name }}</strong> 
        {{ user.email }}
      </li>
    </ul>

    <p>{{ $t('message.LeaveSiteMultipleUsersDescription') }}</p>
    <p>{{ $t('message.LeaveSiteMultipleUsersDescription2') }}</p>

    <b-form class="leave-form" v-on:submit.prevent="leaveSite()">

      <b-form-group>
        <b-form-checkbox v-model="deleteProfile" name="check-button" switch>
          {{ $t('message.DeleteMyProfile') }}
        </b-form-checkbox>
      </b-form-group>

      <p> 
        <strong>
          <span v-if="!deleteProfile">{{ $t('message.LeaveSiteKeepMyProfile') }}</span>
          <span v-if="deleteProfile">{{ $t('message.LeaveSiteDeleteMyProfile') }}</span>
        </strong>
      </p>

      <b-form-group
        :label="$t('message.EnterYourPasswordToConfirm')"
        label-for="password">

        <PasswordBox v-model="password" />
      </b-form-group>

        <b-button type="submit" 
          :disabled="submitDisabled" 
          variant="danger">
          {{ $t("message.LeaveSite") }}
        </b-button>
    </b-form>
  </div>
</template>

<script lang="ts">
import * as request from 'request-promise-native';
import { Component, Vue, Prop } from 'vue-property-decorator';
import store from '../../store/store';
import { configs } from '../../config';
import PasswordBox from '../common/PasswordBox.vue';
import User from '../../models/data/user';

@Component({
  components: {
    PasswordBox,
  },
})
export default class LeaveSiteMultipleUsers extends Vue {

    @Prop({default: () => [] })
    public users?: User[];

    public password: string = '';

    public deleteProfile: boolean = false;

    public get submitDisabled(): boolean {
        if (this.password) {
            return this.password.length < configs.MinPasswordLength;
        }

        return true;
    }

    private async leaveSite() {
      window.console.log(`LeaveSiteMultipleUsers.leaveSite()`);

      store.commit('updateLoading', true);

      try {
        const options = {
            uri: `${configs.BaseApiUrl}${configs.LeaveSiteAPI}`,
            data: {
              delete_profile: this.deleteProfile,
              password: this.password,
            },
            headers: store.getters.ajaxHeader,
            json: true,
        };

        await request.post(options);

        this.$store.dispatch('logout')
        .then(() => {
            this.$router.push('/');
        });

      } catch (ex) {
          store.commit('setErrorMessage', ex);
      }

      store.commit('updateLoading', false);
    }

}
</script>

<style scoped>
    .leave-form {
        max-width: 500px;
    }
</style>
