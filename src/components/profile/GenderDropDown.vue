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
import store from '../../store/store';
import Person from '../../models/data/person';
import configs from '../../config';
import { setTimeout } from 'timers';
import * as request from 'request-promise-native';
import GenderOptionsBuilder from '../../models/data/gender_options_builder';
import GenderOption from '../../models/data/gender_option';
import ProfileEmitArgs from '../../models/profile_emit_args';
import { Dictionary } from 'vuex';

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

  public options: GenderOption[] = [];

  public genderDisplayByValue: { [id: string]: string; } = {};

  public valueEdited?: string = '';

  public editMode: boolean = false;

  protected mounted() {
    window.console.log('GenderDropDown.vue mounted() called');

    const genderBuilder = new GenderOptionsBuilder(this);
    this.genderDisplayByValue = genderBuilder.localisedGendersByKey;
    this.options = genderBuilder.createDropDownOptions();
  }

  private edit() {
    window.console.log(`GenderDropDown.edit()`);
    this.valueEdited = this.value;
    this.editMode = true;
  }

  private async onChange() {
    window.console.log(`GenderDropDown.onBlur() called`);
    await this.endEdit();
  }

  private async endEdit() {
    this.editMode = false;

    store.commit('updateLoading', true);
    await this.save();
    store.commit('updateLoading', false);
  }

  private async save() {

    window.console.log(`GenderDropDown.save() called`);

    if (this.value !== this.valueEdited) {

      const options = {
          uri: `${configs.BaseApiUrl}${configs.PersonAPI}/${this.personId}`,
          headers: store.getters.ajaxHeader,
          body: {
            fieldName: GenderDropDown.propertyName,
            value: this.valueEdited,
          },
          json: true,
      };

      try {
        const response = await request.put(options) as Person;
        window.console.log(response);
        const param = new ProfileEmitArgs(
                            response,
                            GenderDropDown.propertyName,
                            this.valueEdited,
                            this.value);

        this.$emit('valueUpdated', param);
      } catch (ex) {
        store.commit('setErrorMessage', ex);
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
