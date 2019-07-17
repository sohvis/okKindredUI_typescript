<template>
  <div class="container">
    <form 
        v-if="!submitted"
        role="form" 
        v-on:submit.prevent="OnSubmit()">
        <h2>{{ $t("message.PasswordResetConfirmation") }}</h2>
        <p>{{ $t("message.PasswordResetConfirmationDescription") }}</p>
        <div class="form-group">
            <label for="password">{{ $t("message.Password") }}</label>
            <input type="password" class="form-control" v-model="password" required>
        </div>
        <div class="form-group">
            <label for="password2">{{ $t("message.PasswordConfirmation") }}</label>
            <input type="password" class="form-control" v-model="password2" required>
        </div>

        <div class="alert alert-danger" v-show="passwordsNotMatching">{{ $t("message.PasswordsNotMatching") }}</div>

        <b-button type="submit" variant="primary">{{ $t("message.ResetMyPassword") }}</b-button>

    </form>

  </div>
</template>

<script lang="ts">
import * as request from 'request-promise-native';
import { Component, Vue, Prop} from 'vue-property-decorator';
import store from '../../store/store';
import { configs } from '../../config';

@Component
export default class PasswordResetConfirmation extends Vue {

    public token: string = '';

    public password: string = '';

    public password2: string = '';

    public passwordsNotMatching: boolean = false;

    protected mounted() {

        try {
            // Get token from get parameter
            window.console.log(this.$route.query.token);
            this.token = this.$route.query.token as string;

        } catch {
            window.console.log(`no token specified, redirecting to login screen`);
            this.$router.push('/accounts/login/');
        }
    }

    private async OnSubmit() {
        window.console.log(`PasswordResetConfirmation.OnSubmit()`);

        if (this.password !== this.password2) {
            this.passwordsNotMatching = true;
            return;
        }

        store.commit('updateLoading', true);
        try {
            const textbox = document.getElementById('search-box') as HTMLInputElement;
            const options = {
                uri: `${configs.BaseApiUrl}${configs.PasswordResetAPI}confirm/`,
                body: {
                    password: this.password,
                    token: this.token,
                },
                json: true,
            };

            const result = await request.post(options);
            this.$router.push('/accounts/login/');

        } catch (ex) {
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
