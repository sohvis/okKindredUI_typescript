<template>
  <div class="error-overlay" v-show="true">
    <div class="container">
      <b-alert class="alert-position"
          variant="danger" 
          dismissible
          @dismissed="onDismissed"
          v-model="showStandardError">
        {{ errorMessage }}
      </b-alert>

      <b-alert class="alert-position"
          variant="danger" 
          dismissible
          @dismissed="onDismissed"
          v-model="showPasswordBreach">
        <strong>{{ $t('message.PasswordBreach1') }}</strong>
        <div>{{ $t('message.PasswordBreach2') }}</div>
        <div>
          {{ $t('message.PasswordBreach3') }}
          <router-link to="/accounts/change_password/">{{ $t("message.Settings") }}</router-link>
        </div>
        <div>
          {{ $t('message.ForMoreInformation') }}
          <a href="https://haveibeenpwned.com/Passwords">https://haveibeenpwned.com/Passwords</a>
        </div>
      </b-alert>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { mapState } from 'vuex';
import store from '../../store/store';

@Component({})
export default class ErrorModal extends Vue {

  // Special errors
  public static passwordBreached = 'passwordBreached';

  public specialErrors: string[] = [
    ErrorModal.passwordBreached,
  ];

  get errorMessage(): string {
    return store.state.error_message;
  }

  get showStandardError(): boolean {
    if (store.state.error_message
        && this.specialErrors.indexOf(store.state.error_message) < 0) {
      return store.state.error_message.length > 0;
    }

    return false;
  }

  set showStandardError(value: boolean) {
    if (!value) {
      store.commit('setErrorMessage', '');
    }
  }

  get showPasswordBreach() {
     return store.state.error_message === ErrorModal.passwordBreached;
  }

  private onDismissed() {
    // Reset error message
    store.commit('setErrorMessage', '');
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .error-overlay {
    position: fixed;
    z-index: 10;
    width:100%;
  }

  .alert-position {
    margin-top: 50px;
    width:100%;
  }
</style>
