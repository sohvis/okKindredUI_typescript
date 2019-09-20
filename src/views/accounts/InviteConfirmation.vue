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
            
            <b-button type="submit" :disabled="submitDisabled" variant="primary">{{ $t("message.Confirm") }}</b-button>

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
import * as request from 'request-promise-native';
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
        window.console.log(`InviteConfirmation.mounted()`);
        this.confirmationToken = this.$route.params.confirmationToken;
        window.console.log(`this.confirmationToken: ${this.confirmationToken}`);

        store.commit('updateLoading', true);

        try {

            const options = {
                uri: `${config.BaseApiUrl}${config.InviteEmailConfirmationAPI}${this.confirmationToken}/`,
                json: true,
            };

            const invite = await request.get(options) as InviteEmail;
            window.console.log(invite);

            i18n.locale = localeMatch.match(invite.language);
            this.name = invite.person_name;
            this.emailAddress = invite.email_address;
            this.userWhoInvitedYou = invite.username_who_invited_person;
            this.loaded = true;
        } catch (error) {

            this.errorMessage = error.toString();
            window.console.log(error);
            this.confirmationTokenInvalid = true;
        }

        store.commit('updateLoading', false);
    }


    private async onSubmit() {
        window.console.log(`InviteConfirmation.OnSubmit()`);

        this.errorMessage = '';

        // Check for pwned password
        this.isPwnedPassword = false;

        store.commit('updateLoading', true);

        const breachCount = await PwnedPasswordChecker.getNumberOfPasswordBreaches(this.password);
        if (breachCount > 0) {
            this.isPwnedPassword = true;

        } else {

            try {

                const options = {
                    uri: `${config.BaseApiUrl}${config.InviteEmailConfirmationAPI}${this.confirmationToken}/`,
                    body: {
                        password: this.password,
                    },
                    json: true,
                };

                const invite = await request.patch(options) as InviteEmail;
                window.console.log(invite);

                await this.$store.dispatch('login', {
                    email: this.emailAddress,
                    password: this.password,
                });

                this.$router.push('/family/tree/');

            } catch (error) {

                this.errorMessage = error.toString();
                window.console.log(error);
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

</style>
