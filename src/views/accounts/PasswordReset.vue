<template>
  <div class="container">
    <form 
        v-if="!submitted"
        role="form" 
        v-on:submit.prevent="OnSubmit()">
        <h2>{{ $t("message.PasswordReset") }}</h2>
        <p>{{ $t("message.PasswordResetDescription") }}</p>
        <div class="form-group form-password-reset">
            <label for="username">{{ $t("message.EmailAddress") }}</label>
            <input type="email" id="username" name="username" class="form-control" v-model="email" required autofocus>
        </div>

        <b-button type="submit" variant="primary">{{ $t("message.ResetMyPassword") }}</b-button>

    </form>
    <div v-if="submitted">
        <h2>{{ $t("message.PasswordResetRequested") }}</h2>
        <p>{{ $t("message.CheckYourEmailForReset") }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import * as request from 'request-promise-native';
import { Component, Vue } from 'vue-property-decorator';
import store from '../../store/store';
import { configs } from '../../config';

@Component
export default class PasswordReset extends Vue {

    public email: string = '';

    public submitted: boolean = false;

    public async OnSubmit() {
        // window.console.log(`PasswordReset.OnSubmit() called from Login ${this.email}`);

        store.commit('updateLoading', true);
        try {
            const textbox = document.getElementById('search-box') as HTMLInputElement;
            const options = {
                uri: `${configs.BaseApiUrl}${configs.PasswordResetAPI}`,
                body: {
                    email: this.email,
                },
                json: true,
            };

            const result = await request.post(options);
            this.submitted = true;

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
