<template>
  <div class="login-container">
    <form class="form-signin" role="form" v-on:submit.prevent="OnSubmit()">
        <h2 class="form-signin-heading" v-show="!accountLocked">{{ $t("message.PleaseSignIn") }}</h2>
        <div class="form-group" v-show="!accountLocked">
            <label for="username">{{ $t("message.EmailAddress") }}</label>
            <input type="email" id="username" name="username" class="form-control" v-model="loginDetails.email" required autofocus>
        </div>
        <div class="form-group" v-show="!accountLocked">
            <label for="password">{{ $t("message.Password") }}</label>
            <PasswordBox v-model="loginDetails.password" />
        </div>
        <div class="alert alert-danger" v-show="loginInvalid">{{ $t("message.InvalidLogin") }}</div>
        <div class="alert alert-danger" v-show="accountLocked">{{ $t("message.AccountLocked") }}</div>
        <button class="btn btn-lg btn-primary btn-block" type="submit">{{ $t("message.SignIn") }}</button>

        <router-link to="/accounts/password_reset/">{{ $t("message.IForgotMyPassword") }}</router-link>
    </form>

    <div class="signup">
        <hr/>
        {{ $t("message.NoAccount") }}
        <router-link to="/accounts/sign_up/">{{ $t("message.SignUp") }}</router-link>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as request from 'request-promise-native';
import PwnedPasswordChecker from '../../models/pwnedPasswordChecker';
import store from '../../store/store';
import ErrorModal from '../../components/common/ErrorModal.vue';
import PasswordBox from '../../components/common/PasswordBox.vue';
import config from '../../config';
import { localeMatch } from '../../localization/localization';
import { i18n } from '../../main';

@Component({
  components: {
    PasswordBox,
  },
})
export default class Login extends Vue {

    public loginDetails = {
                email: '',
                password: '',
    };

    public loginInvalid = false;

    public accountLocked: boolean = false;

    public async OnSubmit() {
        // window.console.log(`OnSubmit() called from Login ${this.loginDetails.email} ${this.loginDetails.password}`);

        try {
            await this.$store.dispatch('login', {
                email: this.loginDetails.email,
                password: this.loginDetails.password,
            });

            // Check if password is used in a breach
            const numBreaches = await PwnedPasswordChecker.getNumberOfPasswordBreaches(this.loginDetails.password);
            if (numBreaches > 0) {
                // window.console.log(`Password breach, numBreaches: ${numBreaches}`);
                store.commit('setErrorMessage', ErrorModal.passwordBreached);
            }

            let next: string;
            if (this.$route.query.next) {
                next = this.$route.query.next as string;
                // window.console.log(`next: ${next}`);
                this.$router.push(next);
            } else {
                this.$router.push('/family/tree/');
            }

        } catch (error) {
            this.loginInvalid = true;
            this.accountLocked = await this.isIpLocked();
        }
    }

    protected mounted() {
        if (!i18n.locale) {
            i18n.locale = localeMatch.match(navigator.language);
        }
    }

    private async isIpLocked(): Promise<boolean> {
        try {
            store.commit('updateLoading', true);
            const options = {
                uri: `${config.BaseApiUrl}${config.IsLockedAPI}`,
                json: true,
            };

            const isLocked =  await request.get(options) as boolean;

            return isLocked;
        } catch (error) {
            store.commit('setErrorMessage', error);
            return false;
        } finally {
            store.commit('updateLoading', false);
        }
    }
}
</script>

<style scoped>
    .form-signin {
        max-width: 330px;
        padding: 15px;
        margin: 0 auto;
    }

    .signup {
        opacity: 0.85;
        max-width: 330px;
        margin-top: 50px;
        padding: 15px;
        margin: 0 auto;
    }

</style>
