<template>
  <div class="container signup-container">
    <div v-show="loaded">
        <h3>
            {{$t('message.InviteConfirmation')}} 
        </h3>

        <p>
            {{$t('message.HelloName', { name: name })}} 
        </p>

        <p>
            {{$t('message.YouHaveBeenInvited', { invitedBy: userWhoInvitedYou })}} 
        </p>

        <p>
            {{$t('message.PleaseCreatePassword')}} 
        </p>

        <form 
            v-if="hasConfirmationCode"
            role="form" 
            v-on:submit.prevent="onSubmit()"
            class="form-password-reset">

            <div class="form-group">
                <label for="password">{{ $t("message.Password") }}</label>
                <PasswordBox v-model="password" />
            </div>
            <div class="form-group">
                <label for="passwordConfirmation">{{ $t("message.PasswordConfirmation") }}</label>
                <PasswordBox v-model="passwordConfirmation" />
            </div>

            <div class="alert alert-danger" v-show="isPwnedPassword">
                <strong>{{ $t('message.PasswordBreach1') }}</strong>
                <div>{{ $t('message.PasswordBreach2') }}</div>
                <div>
                {{ $t('message.ForMoreInformation') }}
                <a href="https://haveibeenpwned.com/Passwords">https://haveibeenpwned.com/Passwords</a>
                </div>
            </div>

            <b-alert variant="danger" v-model="showError">
                {{ errorMessage }}
            </b-alert>
            
            <b-button class="submitButton" type="submit" :disabled="submitDisabled" variant="primary">
                {{ $t("message.Confirm") }}
            </b-button>

        </form>
    </div>
    <div v-show="confirmationTokenInvalid">
        <h3>
            {{$t('message.CannotFindInvite')}} 
        </h3>
        <p>
            {{$t('message.CannotFindInviteDescription')}} 
        </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import APIException from '@/models/data/api_exception';
import store from '../../store/store';
import ErrorModal from '../../components/common/ErrorModal.vue';
import config from '../../config';
import LanguageOptionsBuilder from '../../models/data/language_options_builder';
import { localeMatch } from '../../localization/localization';
import { i18n } from '../../main';
import PwnedPasswordChecker from '../../models/pwnedPasswordChecker';
import PasswordBox from '../../components/common/PasswordBox.vue';
import User from '../../models/data/user';
import InviteEmail from '../../models/data/invite_email';

@Component({
  components: {
    PasswordBox,
  },
})
export default class InviteConfirmation extends Vue {

    public password: string = '';
    public passwordConfirmation: string = '';
    public userWhoInvitedYou: string = '';
    public confirmationToken: string = '';
    public name: string = '';
    public emailAddress: string = '';
    public loaded: boolean = false;
    public confirmationTokenInvalid: boolean = false;

    public get hasConfirmationCode() {
        return this.confirmationToken.length > 0;
    }

    public get submitDisabled() {

        if (store.state.loading_count > 0) {
            return true;
        }

        if (!this.password || this.password.length < config.MinPasswordLength) {
            return true;
        }

        if (this.password !== this.passwordConfirmation) {
            return true;
        }

        return false;
    }

    public isPwnedPassword: boolean = false;

    public errorMessage: string = '';

    public get showError(): boolean {
        return this.errorMessage.length > 0;
    }

    protected async mounted() {
        // window.console.log(`InviteConfirmation.mounted()`);
        this.confirmationToken = this.$route.params.confirmationToken;
        // window.console.log(`this.confirmationToken: ${this.confirmationToken}`);

        store.commit('updateLoading', true);

        try {

            const options: AxiosRequestConfig = {
                url: `${config.BaseApiUrl}${config.InviteEmailConfirmationAPI}${this.confirmationToken}/`,
                method: 'GET',
                responseType: 'json',
            };

            const response = await axios.request(options) as AxiosResponse<InviteEmail>;
            // window.console.log(invite);

            i18n.locale = localeMatch.match(response.data.language);
            this.name = response.data.person_name;
            this.emailAddress = response.data.email_address;
            this.userWhoInvitedYou = response.data.username_who_invited_person;
            this.loaded = true;

            store.dispatch('updateRouteLoaded');
        } catch (error) {

            const axiosError = error as AxiosError<APIException>;
            this.errorMessage = axiosError?.response?.data?.detail || error.toString();

            this.confirmationTokenInvalid = true;
        }

        store.commit('updateLoading', false);
    }


    private async onSubmit() {
        // window.console.log(`InviteConfirmation.OnSubmit()`);

        this.errorMessage = '';

        // Check for pwned password
        this.isPwnedPassword = false;

        store.commit('updateLoading', true);

        const breachCount = await PwnedPasswordChecker.getNumberOfPasswordBreaches(this.password);
        if (breachCount > 0) {
            this.isPwnedPassword = true;

        } else {

            try {

                const options: AxiosRequestConfig = {
                    url: `${config.BaseApiUrl}${config.InviteEmailConfirmationAPI}${this.confirmationToken}/`,
                    data: {
                        password: this.password,
                    },
                    method: 'PATCH',
                    responseType: 'text',
                };

                const response = await axios.request(options) as AxiosResponse<InviteEmail>;
                // window.console.log(invite);

                await this.$store.dispatch('login', {
                    email: this.emailAddress,
                    password: this.password,
                });

                this.$router.push('/family/tree/');

            } catch (error) {

                const axiosError = error as AxiosError<APIException>;
                this.errorMessage = axiosError?.response?.data?.detail || error.toString();
            }
        }

        store.commit('updateLoading', false);
    }
}
</script>

<style scoped>
.signup-container {
    max-width: 600px;
    padding: 15px;
    margin: 0 auto;
}

.submitButton.disabled {
    background-color: #aaa;
    border-color: #aaa
}
</style>
