<template>
  <div class="container">
    <form 
        v-if="!submitted"
        role="form" 
        v-on:submit.prevent="OnSubmit()">

        <h2>{{ $t("message.ChangePassword") }}</h2>
        <p>{{ $t("message.ChangePasswordDescription") }}</p>

        <div class="form-group">
            <label for="old_password">{{ $t("message.OldPassword") }}</label>
            <PasswordBox v-model="oldPassword" />
        </div>

        <div class="form-group">
            <label for="password">{{ $t("message.NewPassword") }}</label>
            <PasswordBox v-model="password" />
        </div>

        <div class="form-group">
            <label for="password2">{{ $t("message.PasswordConfirmation") }}</label>
            <PasswordBox v-model="password2" />
        </div>

        <div class="alert alert-danger" v-show="isPwnedPassword">
            <strong>{{ $t('message.PasswordBreach1') }}</strong>
            <div>{{ $t('message.PasswordBreach2') }}</div>
            <div>
            {{ $t('message.ForMoreInformation') }}
            <a href="https://haveibeenpwned.com/Passwords">https://haveibeenpwned.com/Passwords</a>
            </div>
        </div>

        <b-button type="submit" :disabled="submitDisabled" variant="primary">{{ $t("message.UpdateMyPassword") }}</b-button>

        <p class="spinner-container">
            <b-spinner v-show="saving"></b-spinner>

            <span v-show="saved" class="saved-message">
                <span class="oi oi-check" aria-hidden="true"></span>
                {{ $t('message.PasswordUpdated') }}
            </span>
        </p>
    </form>

  </div>
</template>

<script lang="ts">
import * as request from 'request-promise-native';
import { Component, Vue, Prop} from 'vue-property-decorator';
import store from '../../store/store';
import { configs } from '../../config';
import PwnedPasswordChecker from '../../models/pwnedPasswordChecker';

import PasswordBox from '../../components/common/PasswordBox.vue';

@Component({
  components: {
    PasswordBox,
  },
})
export default class ChangePassword extends Vue {

    public oldPassword: string = '';

    public password: string = '';

    public password2: string = '';

    public isPwnedPassword: boolean = false;

    get submitDisabled() {

        if (!this.oldPassword || this.oldPassword.length < 5) {
            return true;
        }

        if (!this.password || this.password.length < 8) {
            return true;
        }

        if (this.password !== this.password2) {
            return true;
        }

        return false;
    }

    private async OnSubmit() {
        window.console.log(`PasswordResetConfirmation.OnSubmit()`);

        // Check for pwned password
        this.isPwnedPassword = false;

        const breachCount = await PwnedPasswordChecker.getNumberOfPasswordBreaches(this.password);
        if (breachCount > 0) {
            this.isPwnedPassword = true;
            return;
        }

        store.commit('updateLoading', true);
        try {
            const textbox = document.getElementById('search-box') as HTMLInputElement;
            const options = {
                uri: `${configs.BaseApiUrl}${configs.PasswordChangeAPI}`,
                headers: store.getters.ajaxHeader,
                body: {
                    old_password: this.oldPassword,
                    new_password: this.password,
                },
                json: true,
            };

            const result = await request.post(options);

        } catch (ex) {

            // TODO Various error messages based on exception
            store.commit('setErrorMessage', ex);
        }

        store.commit('updateLoading', false);
    }
}
</script>

<style scoped>
    .form-password-reset {
        max-width: 500px;
    }

</style>
