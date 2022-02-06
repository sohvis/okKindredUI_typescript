<template>
  <div class="container">
    <h2>{{ $t("message.ChangePassword") }}</h2>
    <p>{{ $t("message.ChangePasswordDescription") }}</p>

    <form 
        class="form-password-reset"
        role="form" 
        v-on:submit.prevent="OnSubmit()">

        <div class="mb-3">
            <label for="old_password">{{ $t("message.OldPassword") }}</label>
            <PasswordBox v-model="oldPassword" />
        </div>

        <div class="mb-3">
            <label for="password">{{ $t("message.NewPassword") }}</label>
            <PasswordBox v-model="password" />
        </div>

        <div class="mb-3">
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

        <b-spinner class="password-spinner" small v-show="saving"></b-spinner>

        <span v-show="saved" class="saved-message">
            <span class="oi oi-check" aria-hidden="true"></span>
            {{ $t('message.PasswordUpdated') }}
        </span>

    </form>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import APIException from '@/models/data/api_exception';
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

    public saving: boolean = false;

    public saved: boolean = false;

    get submitDisabled() {

        if (this.saving) {
            return true;
        }

        if (!this.oldPassword || this.oldPassword.length < 5) {
            return true;
        }

        if (!this.password || this.password.length < configs.MinPasswordLength) {
            return true;
        }

        if (this.password !== this.password2) {
            return true;
        }

        return false;
    }

    private async OnSubmit() {
        // window.console.log(`PasswordResetConfirmation.OnSubmit()`);

        this.saving = true;
        this.saved = false;

        // Check for pwned password
        this.isPwnedPassword = false;

        const breachCount = await PwnedPasswordChecker.getNumberOfPasswordBreaches(this.password);
        if (breachCount > 0) {
            this.isPwnedPassword = true;

        } else {

            try {
                const textbox = document.getElementById('search-box') as HTMLInputElement;
                const options: AxiosRequestConfig = {
                    url: `${configs.BaseApiUrl}${configs.PasswordChangeAPI}`,
                    headers: store.getters.ajaxHeader,
                    data: {
                        old_password: this.oldPassword,
                        new_password: this.password,
                    },
                    method: 'POST',
                    responseType: 'json',
                };

                const response = await axios.request(options);
                this.saved = true;

            } catch (ex) {

                const axiosError = ex as AxiosError<APIException>;
                let message = axiosError?.response?.data?.detail || (ex as Error).toString();

                // Various error messages based on exception
                if (axiosError?.toString()?.includes('Incorrect previous password')) {
                    message = this.$t('message.IncorrectOldPassword').toString();
                }
                store.commit('setErrorMessage', message);
            }

        }

        this.saving = false;
    }
}
</script>

<style scoped>
    .form-password-reset {
        max-width: 500px;
    }

    .password-spinner {
        margin-left: 15px;
    }

    .saved-message {
        color: darkgreen;
        margin-left: 15px;
    }

</style>
