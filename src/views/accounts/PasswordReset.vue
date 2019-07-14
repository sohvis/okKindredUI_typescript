<template>
  <div class="login-container">
    <form 
        class="form-password-reset" 
        v-if="!submitted"
        role="form" 
        v-on:submit.prevent="OnSubmit()">
        <h2 class="form-password-reset-heading">{{ $t("message.ForgottenPassword") }}</h2>
        <div class="form-group">
            <label for="username">{{ $t("message.EmailAddress") }}</label>
            <input type="email" id="username" name="username" class="form-control" v-model="email" required autofocus>
        </div>
        <button class="btn btn-lg btn-primary btn-block" type="submit">{{ $t("message.ResetMyPassword") }}</button>
    </form>
    <div class="after-submit-message" v-if="submitted">
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class PasswordReset extends Vue {

    public email: string = '';

    public submitted: boolean = false;

    public OnSubmit() {
        window.console.log(`PasswordReset.OnSubmit() called from Login ${this.email}`);
        this.submitted = true;
    }
}
</script>

<style scoped>
    .form-password-reset {
        max-width: 330px;
        padding: 15px;
        margin: 0 auto;
    }

</style>
