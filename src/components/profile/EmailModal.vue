<template>
    <b-modal 
        :title="$t('message.InviteToJoin')"
        ref="emailModalForm"
        centered
        @ok="submit" 
        @busy ="busy"
        button-size="lg">

      <b-form @submit="submit">
        <label :for="email">{{ $t("message.EmailAddress") }}</label>
        <b-form-input 
            type="email"
            v-model="email"
            :placeholder='$t("message.EmailAddress")'
            autocomplete="off">
        </b-form-input>
      </b-form>

      <b-alert variant="danger" v-model="showError">
          {{ errorMessage }}
      </b-alert>

      <Loading v-show="busy"/>

    </b-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Promise } from 'q';
import Person from '../../models/data/person';
import * as request from 'request-promise-native';
import store from '../../store/store';
import { configs } from '../../config';
import Loading from '../common/Loading.vue';
import { BModal } from 'bootstrap-vue';

@Component({
  components: {
      Loading,
  },
})
export default class EmailModal extends Vue {

  @Prop({default: null})
  public personId?: string | null;

  public email: string = '';

  public busy: boolean = false;

  public errorMessage: string = '';

  public get showError(): boolean {
      if (this.errorMessage && this.errorMessage.length > 0) {
          return true;
      } else {
          return false;
      }
  }

  public initialize() {
      window.console.log('EmailModal.initialize()');
      (this.$refs.emailModalForm as BModal).show();
  }

  private async submit(evt: Event) {
    window.console.log('EmailModal.submit()');

    evt.preventDefault();
    this.errorMessage = '';
    this.busy = true;

    const options = {
        uri: `${configs.BaseApiUrl}${configs.PersonAPI}${this.personId}/`,
        headers: store.getters.ajaxHeader,
        body: {
          fieldName: 'email',
          value: this.email,
        },
        json: true,
    };

    try {
      const response = await request.patch(options) as Person;
      window.console.log(response);
      this.$emit('emailSet');
      (this.$refs.emailModalForm as BModal).hide();
    } catch (ex) {
      this.errorMessage = ex.toString();
    }

    this.busy = false;
  }
}
</script>

<!-- "scoped" attribute removed to fill screen -->
<style scoped>
</style>
