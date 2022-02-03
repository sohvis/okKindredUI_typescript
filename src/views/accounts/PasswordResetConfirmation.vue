<template>
  <div class="container">

    <h2>{{ $t("message.PasswordResetConfirmation") }}</h2>
    <p>{{ $t("message.PasswordResetConfirmationDescription") }}</p>

    <form 
        v-if="!submitted"
        role="form" 
        v-on:submit.prevent="OnSubmit()"
        class="form-password-reset">

        <div class="form-group">
            <label for="password">{{ $t("message.Password") }}</label>
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

        <b-button class="submitButton" type="submit" :disabled="submitDisabled" variant="primary">
            {{ $t("message.UpdateMyPassword") }}
        </b-button>

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
import { localeMatch } from '../../localization/localization';
import { i18n } from '../../main';

@Component({
  components: {
    PasswordBox,
  },
})
export default class PasswordResetConfirmation extends Vue {

    public token: string = '';

    public password: string = '';

    public password2: string = '';

    public isPwnedPassword: boolean = false;

    get submitDisabled() {

        if (!this.password || this.password.length < configs.MinPasswordLength) {
            return true;
        }

        if (this.password !== this.password2) {
            return true;
        }

        return false;
    }

    protected mounted() {

        try {
            // Get token from get parameter
            // window.console.log(this.$route.query.token);
            this.token = this.$route.query.token as string;

            let language: string;
            if (this.$route.query.language) {
                language = this.$route.query.language as string;
            } else {
                language = navigator.language;
            }

            // window.console.log(`language: ${language}`);
            i18n.locale = localeMatch.match(language);

        } catch {
            // window.console.log(`no token specified, redirecting to login screen`);
            this.$router.push('/accounts/login/');
        }
    }

    private async OnSubmit() {
        // window.console.log(`PasswordResetConfirmation.OnSubmit()`);

        store.commit('updateLoading', true);

        this.isPwnedPassword = false;
        const breachCount = await PwnedPasswordChecker.getNumberOfPasswordBreaches(this.password);

        if (breachCount > 0) {
            this.isPwnedPassword = true;
        } else {

            try {
                const textbox = document.getElementById('search-box') as HTMLInputElement;
                const options: AxiosRequestConfig = {
                    url: `${configs.BaseApiUrl}${configs.PasswordResetAPI}confirm/`,
                    data: {
                        password: this.password,
                        token: this.token,
                    },
                    method: 'POST',
                    responseType: 'json',
                };

                const response = await axios.request(options);
                this.$router.push('/accounts/login/');

            } catch (ex) {
                const axiosError = ex as AxiosError<APIException>;
                store.commit('setErrorMessage', axiosError?.response?.data?.detail || (ex as Error).toString());
            }
        }
        store.commit('updateLoading', false);
    }
}
</script>

<style scoped>
.form-password-reset {
    max-width: 500px;
}

.submitButton.disabled {
    background-color: #aaa;
    border-color: #aaa
}
</style>
