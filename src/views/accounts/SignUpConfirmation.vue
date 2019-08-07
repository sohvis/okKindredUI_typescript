<template>
  <div class="container signup-container">
    <h3>
        {{$t('message.AccountConfirmation')}} 
    </h3>

    <h4>
        {{$t('message.PleaseCreatePassword')}} 
    </h4>

    <form 
        v-if="!submitted"
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

@Component({
  components: {
    PasswordBox,
  },
})
export default class SignUp extends Vue {

    public password: string = '';
    public passwordConfirmation: string = '';

    @Prop()
    public confirmationToken: string = '';

    public get submitDisabled() {

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


    public async onSubmit() {
        window.console.log(`OnSubmit() called`);

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
                    uri: `${config.BaseApiUrl}${config.SignUpAPI}${this.confirmationToken}/`,
                    body: {
                        password: this.password,
                    },
                    json: true,
                };

                const response = await request.put(options);
                window.console.log(response);

            } catch (error) {

                this.errorMessage = error.toString();
                window.console.log(error);
            }
        }

        store.commit('updateLoading', false);
    }

    protected mounted() {
        window.console.log(`SignUpCOnfirmation.mounted()`);
        window.console.log(`this.confirmationToken: ${this.confirmationToken}`);
        i18n.locale = localeMatch.match(navigator.language);
        
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
