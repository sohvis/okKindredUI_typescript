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
            v-model="editedEmail"
            :placeholder='$t("message.EmailAddress")'
            autocomplete="off">
        </b-form-input>

        <b-form-group
            :label="$t('message.LanguageLabel')"
            label-for="language">

            <b-form-select 
                v-model="editedLanguage" 
                :options="languageOptions">
            </b-form-select>
        </b-form-group>

      </b-form>

      <b-alert variant="danger" v-model="showError">
          {{ errorMessage }}
      </b-alert>

      <Loading v-show="busy"/>

    </b-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Person from '../../models/data/person';
import * as request from 'request-promise-native';
import store from '../../store/store';
import { configs } from '../../config';
import Loading from '../common/Loading.vue';
import { BModal } from 'bootstrap-vue';
import SelectOption from '../../models/data/select_option';
import LanguageOptionsBuilder from '../../models/data/language_options_builder';
import EmailHelper from '../../models/emailHelper';

@Component({
  components: {
      Loading,
  },
})
export default class EmailModal extends Vue {

  @Prop({default: null})
  public personId?: string | null;

  public languageOptions: SelectOption[] = [];

  public editedEmail: string = '';

  @Prop({default: null})
  public email?: string;

  public editedLanguage: string = 'en';

  @Prop({default: null})
  public language?: string;

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
      // window.console.log('EmailModal.initialize()');

      this.languageOptions = LanguageOptionsBuilder.createDropDownOptions();

      if (this.email) {
        this.editedEmail = this.email;
      }

      if (this.language) {
        this.editedLanguage = this.language;
      }

      (this.$refs.emailModalForm as BModal).show();
  }

  private async submit(evt: Event) {
    // window.console.log('EmailModal.submit()');

    evt.preventDefault();
    this.errorMessage = '';
    this.busy = true;
    try {

      if (!EmailHelper.validateEmail(this.editedEmail)) {
        throw this.$t('message.InvalidEmail').toString();
      }

      if (this.email !== this.editedEmail) {
        await this.updatePersonDetail('email', this.editedEmail);
      }

      if (this.language !== this.editedLanguage) {
        await this.updatePersonDetail('language', this.editedLanguage);
      }

      this.$emit('profileUpdated');

      (this.$refs.emailModalForm as BModal).hide();
    } catch (ex) {
      this.errorMessage = ex.toString();
    }

    this.busy = false;
  }

  private async updatePersonDetail(property: string, value: string): Promise<Person> {

    const options = {
        uri: `${configs.BaseApiUrl}${configs.PersonAPI}${this.personId}/`,
        headers: store.getters.ajaxHeader,
        body: {
          fieldName: property,
          value,
        },
        json: true,
    };

    const response = await request.patch(options) as Person;
    // window.console.log(response);

    return response;
  }


}
</script>

<!-- "scoped" attribute removed to fill screen -->
<style scoped>
</style>
