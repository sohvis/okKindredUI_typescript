<template>
  <div class="login-container">
    <form class="form-signin" role="form" v-on:submit.prevent="OnSubmit()">
        <h2 class="form-signin-heading">{{ $t("message.PleaseSignIn") }}</h2>
        <div class="form-group">
            <label for="username">{{ $t("message.EmailAddress") }}</label>
            <input type="email" id="username" name="username" class="form-control" v-model="loginDetails.email" required autofocus>
        </div>
        <div class="form-group">
            <label for="password">{{ $t("message.Password") }}</label>
            <PasswordBox v-model="loginDetails.password" />
        </div>
        <div class="alert alert-danger" v-show="loginInvalid">{{ $t("message.InvalidLogin") }}</div>
        <div class="alert alert-danger" v-show="accountLocked">{{ $t("message.AccountLocked") }}</div>
        <button class="btn btn-lg btn-primary btn-block" type="submit">{{ $t("message.SignIn") }}</button>

        <router-link to="/accounts/password_reset/">{{ $t("message.IForgotMyPassword") }}</router-link>

    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PwnedPasswordChecker from '../../models/pwnedPasswordChecker';
import store from '../../store/store';
import ErrorModal from '../../components/common/ErrorModal.vue';
import PasswordBox from '../../components/common/PasswordBox.vue';
import config from '../../config';

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

    public loginAttempts: number = 0;

    public get accountLocked(): boolean {
        return this.loginAttempts >= config.MaxLoginAttempts;
    }

    public async OnSubmit() {
        window.console.log(`OnSubmit() called from Login ${this.loginDetails.email} ${this.loginDetails.password}`);

        try {
            await this.$store.dispatch('login', {
                email: this.loginDetails.email,
                password: this.loginDetails.password,
            });

            // Check if password is used in a breach
            const numBreaches = await PwnedPasswordChecker.getNumberOfPasswordBreaches(this.loginDetails.password);
            if (numBreaches > 0) {
                window.console.log(`Password breach, numBreaches: ${numBreaches}`);
                store.commit('setErrorMessage', ErrorModal.passwordBreached);
            }

            this.$router.push('/family/');

        } catch (error) {
            window.console.log(error);
            this.loginAttempts++;
            this.loginInvalid = true;
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

</style>
