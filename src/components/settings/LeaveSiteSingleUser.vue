<template>
  <div>

    <p>{{ $t('message.LeaveSiteSingleUserDescription') }}</p>

    <b-form class="leave-form" v-on:submit.prevent="leaveSite()">

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
import { Component, Vue } from 'vue-property-decorator';
import store from '../../store/store';
import { configs } from '../../config';
import PasswordBox from '../common/PasswordBox.vue';

@Component({
  components: {
    PasswordBox,
  },
})
export default class LeaveSiteSingleUser extends Vue {

    public password: string = '';

    public get submitDisabled(): boolean {
        if (this.password) {
            return this.password.length < configs.MinPasswordLength;
        }

        return true;
    }

    private async leaveSite() {
        window.console.log('LeaveSiteSingleUser.leaveSite()');

        store.commit('updateLoading', true);

        try {
            const options = {
                uri: `${configs.BaseApiUrl}${configs.LeaveSiteAPI}`,
                headers: store.getters.ajaxHeader,
                body: {
                    password: this.password,
                },
                json: true,
            };

            await request.post(options);

            await this.$store.dispatch('logout');
            this.$router.push('/');

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
