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
            <input type="password" id="password" name="password" class="form-control" v-model="loginDetails.password" required>
        </div>
        <div class="alert alert-danger" v-show="loginInvalid">{{ $t("message.InvalidLogin") }}</div>
        <button class="btn btn-lg btn-primary btn-block" type="submit">{{ $t("message.SignIn") }}</button>

        <a href="#">{{ $t("message.IForgotMyPassword") }}</a>
        
        
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Login extends Vue {

    public loginDetails = {
                email: '',
                password: '',
        };

    public loginInvalid = false;

    public OnSubmit() {
        window.console.log(`OnSubmit() called from Login ${this.loginDetails.email} ${this.loginDetails.password}`);
        this.$store.dispatch('login', {
            email: this.loginDetails.email,
            password: this.loginDetails.password,
        })
        .then(() => {
            this.$router.push('/tree/');
        }).catch((error) => {
            window.console.log(error);
            this.loginInvalid = true;
        });
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
