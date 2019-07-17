<template>
  <div class="error-overlay">
    <div class="container">
      <b-alert 
        class="alert-position"
        v-bind="showDismissibleAlert" 
        variant="danger" 
        dismissible
        @dismissed="onDismissed">
        {{ errorMessage }}
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

  @Prop({default: ''})
  public errorMessage!: string;

  get showDismissibleAlert() {
    if (this.errorMessage) {
      return this.errorMessage.length > 0;
    }

    return false;
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
