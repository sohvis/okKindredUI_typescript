<template>
    <div>
      <a class="editable-link" v-if="value != 0 && !editMode" href="#" v-on:click="edit()">
        {{value}}
      </a>

      <a class="editable-link" v-if="value == 0 && !editMode" href="#" v-on:click="edit()">
        {{ $t('message.ClickToEdit') }}
      </a>
      <b-form-input 
          :id="id"
          type="number"
          v-show="editMode" 
          v-model="valueEdited"
          @blur="onBlur">
      </b-form-input>
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
import Guid from '../../../models/guid';
import ProfileEmitArgs from '../../../models/profile_emit_args';

@Component({
  components: {
  },
})
export default class NumberField extends Vue {

  public id: string;

  @Prop({default: ''})
  public personId?: string;

  @Prop({default: ''})
  public propertyName?: string;

  @Prop({default: 10})
  public maxFieldLength?: number;

  @Prop({default: 0})
  public value?: number;

  public valueEdited?: number = 0;

  public editMode: boolean = false;

  constructor() {
    super();
    this.id = Guid.newGuid();
  }

  protected mounted() {
    // window.console.log('NumberField.vue mounted() called');

    const input = document.getElementById(this.id) as HTMLInputElement;
    if (input) {
      input.addEventListener('keyup', this.onKeyup);
    }
  }

  private async onKeyup(e: KeyboardEvent) {

    if (e.keyCode === 13) {
        await this.endEdit();
    }
  }

  private edit() {
    // window.console.log(`NumberField.edit() propertyName:${this.propertyName}`);
    this.valueEdited = this.value;
    this.editMode = true;
    const textbox = document.getElementById(this.id) as HTMLInputElement;

    if (textbox) {
      setTimeout(() => {
        textbox.focus();
        textbox.select();
      }, 100);

    }
  }

  private async onBlur() {
    // window.console.log(`NumberField.onBlur() called`);
    await this.endEdit();
  }

  private async endEdit() {
    this.editMode = false;
    store.commit('updateLoading', true);
    await this.save();
    store.commit('updateLoading', false);
  }

  private async save() {

    // window.console.log(`NumberField.save() called`);

    if (this.value !== this.valueEdited) {

      let value = this.valueEdited;
      if (!value) {
        value = 0;
      }

      const options: AxiosRequestConfig = {
          url: `${configs.BaseApiUrl}${configs.PersonAPI}${this.personId}/`,
          headers: store.getters.ajaxHeader,
          data: {
            fieldName: this.propertyName,
            value,
          },
          method: 'PATCH',
          responseType: 'json',
      };

      try {
        const response = await axios.request(options) as AxiosResponse<Person>;
        // window.console.log(response);
        const param = new ProfileEmitArgs(
                            response.data,
                            this.propertyName || '',
                            this.valueEdited,
                            this.value);

        this.$emit('valueUpdated', param);
      } catch (ex) {
        const axiosError = ex as AxiosError<APIException>;
        store.commit('setErrorMessage', axiosError?.response?.data?.detail || ex.toString());
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
