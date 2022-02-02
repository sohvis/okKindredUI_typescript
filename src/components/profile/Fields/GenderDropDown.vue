<template>
    <div>
      <a class="editable-link" v-if="!editMode" href="#" v-on:click="edit()">
        {{genderDisplayByValue[value]}}
      </a>

      <b-form-select 
          v-if="editMode"
          v-model="valueEdited" 
          :options="options"
          @change="onChange">
      </b-form-select>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import store from '../../../store/store';
import Person from '../../../models/data/person';
import configs from '../../../config';
import { setTimeout } from 'timers';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import APIException from '@/models/data/api_exception';
import GenderOptionsBuilder from '../../../models/data/gender_options_builder';
import SelectOption from '../../../models/data/select_option';
import ProfileEmitArgs from '../../../models/profile_emit_args';

@Component({
  components: {
  },
})
export default class GenderDropDown extends Vue {

  public static propertyName = `gender`;

  @Prop({default: ''})
  public personId?: string;

  @Prop({default: ''})
  public value?: string;

  public options: SelectOption[] = [];

  public genderDisplayByValue: { [id: string]: string; } = {};

  public valueEdited?: string = '';

  public editMode: boolean = false;

  protected mounted() {
    // window.console.log('GenderDropDown.vue mounted() called');

    const genderBuilder = new GenderOptionsBuilder(this);
    this.genderDisplayByValue = genderBuilder.localisedGendersByKey;
    this.options = genderBuilder.createDropDownOptions();
  }

  private edit() {
    // window.console.log(`GenderDropDown.edit()`);
    this.valueEdited = this.value;
    this.editMode = true;
  }

  private async onChange() {
    // window.console.log(`GenderDropDown.onBlur() called`);
    await this.endEdit();
  }

  private async endEdit() {
    this.editMode = false;

    store.commit('updateLoading', true);
    await this.save();
    store.commit('updateLoading', false);
  }

  private async save() {

    // window.console.log(`GenderDropDown.save() called`);

    if (this.value !== this.valueEdited) {

      const options: AxiosRequestConfig = {
          url: `${configs.BaseApiUrl}${configs.PersonAPI}${this.personId}/`,
          headers: store.getters.ajaxHeader,
          data: {
            fieldName: GenderDropDown.propertyName,
            value: this.valueEdited,
          },
          method: 'PATCH',
          responseType: 'json',
      };

      try {
        const response = await axios.request(options) as AxiosResponse<Person>;

        // window.console.log(response);
        const param = new ProfileEmitArgs(
                            response.data,
                            GenderDropDown.propertyName,
                            this.valueEdited,
                            this.value);

        this.$emit('valueUpdated', param);
      } catch (ex) {
        const axiosError = ex as AxiosError<APIException>;
        store.commit('setErrorMessage', axiosError?.response?.data?.detail || (ex as Error).toString());
      }
    }
  }
}
</script>

<!-- "scoped" attribute removed to fill screen -->
<style scoped>
  .editable-link {
    border-bottom: 1px dotted #007bff;
    text-decoration: none;
  }
</style>
