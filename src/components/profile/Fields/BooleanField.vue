<template>
    <div>
        <b-form-checkbox 
            v-model="valueEdited" 
            name="check-button" 
            switch
            @change="onChange">
        </b-form-checkbox>
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
export default class BooleanField extends Vue {

  @Prop({default: ''})
  public personId?: string;

  @Prop({default: ''})
  public propertyName?: string;

  @Prop({default: false})
  public value?: boolean;

  public valueEdited?: boolean = false;

  protected mounted() {
    this.valueEdited = this.value;
  }

  private async onChange() {
    // window.console.log(`BooleanField.onChange() called`);

    // Checkboxes need a few miliseconds to register change
    setTimeout(async () => {
        await this.save();
    }, 200);
  }

  private async save() {

    // window.console.log(`BooleanField.save() called`);
    store.commit('updateLoading', true);

    if (this.value !== this.valueEdited) {

      const options: AxiosRequestConfig = {
          url: `${configs.BaseApiUrl}${configs.PersonAPI}${this.personId}/`,
          headers: store.getters.ajaxHeader,
          data: {
            fieldName: this.propertyName,
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
                            this.propertyName || '',
                            this.valueEdited,
                            this.value);

        this.$emit('valueUpdated', param);
      } catch (ex) {
        const axiosError = ex as AxiosError<APIException>;
        store.commit('setErrorMessage', axiosError?.response?.data?.detail || ex.toString());
      }
    }

    store.commit('updateLoading', false);
  }
}
</script>

<!-- "scoped" attribute removed to fill screen -->
<style scoped>
</style>
