<template>
    <div class="col-md-12">
        <h4>
          {{ $t('message.Biography') }}
          <b-button class="btn-edit" variant="outline-secondary" v-if="!locked && !editMode" v-on:click="edit()" >
            <span class="oi oi-pencil" aria-hidden="true"></span>
            {{ $t('message.Edit') }} 
          </b-button>

          <b-button class="btn-edit" variant="outline-success" v-if="editMode" v-on:click="doneEditing()" >
            <span class="oi oi-pencil" aria-hidden="true"></span>
            {{ $t('message.Done') }} 
          </b-button>
        </h4>
        <p 
          v-show="!editMode" 
          v-html="biographyDisplay"
          class="biography-paragraph">
        </p>

        <vue-editor 
          class="biography-editor" 
          v-show="editMode" 
          v-model="biographyEdited"
          :editorToolbar="customToolbar">
        </vue-editor>

    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import store from '../../store/store';
import Person from '../../models/data/person';
import configs from '../../config';
import { setTimeout } from 'timers';
import * as request from 'request-promise-native';
import ProfileEmitArgs from '../../models/profile_emit_args';
import { VueEditor } from 'vue2-editor';

@Component({
  components: {
      VueEditor,
  },
})
export default class Biography extends Vue {

  @Prop({default: ''})
  public personId?: string;

  @Prop({default: ''})
  public biography?: string;

  public biographyEdited?: string =  '';

  public customToolbar = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    [{ list: 'ordered'}, { list: 'bullet' }],
    [{ header: [1, 2, 3, false] }],
    [{ font: [] }],
  ];

  get biographyDisplay(): string {
    if (!this.biography) {
      return this.$t('message.BiographyNotExist').toString();
    }

    return this.biography;
  }

  @Prop({default: false})
  public locked?: boolean;

  public editMode: boolean = false;

  private timeOutHandle: any;

  protected mounted() {
    window.console.log('Biography.vue mounted() called');
  }

  private edit() {
    this.biographyEdited = this.biography;
    this.editMode = true;
  }

  private async onBlur() {
    window.console.log(`Biography.onBlur() called`);

    await this.doneEditing();
  }

  private async doneEditing() {

    window.console.log(`Biography.doneEditing() called`);

    this.editMode = false;

    if (this.timeOutHandle) {
      window.clearTimeout(this.timeOutHandle);
    }

    store.commit('updateLoading', true);
    await this.save();
    store.commit('updateLoading', false);
  }

  @Watch('biographyEdited')
  private async onChange() {
    window.console.log(`Biography.onChange() called`);

    if (this.biographyEdited !== this.biography) {
      if (this.timeOutHandle) {
        window.clearTimeout(this.timeOutHandle);
      }

      this.timeOutHandle = setTimeout(async () => {
        await this.save();
      }, 3000);
    }
  }

  private async save() {

    window.console.log(`Biography.save() called`);

    if (this.biography !== this.biographyEdited) {

      try {
        const options = {
            uri: `${configs.BaseApiUrl}${configs.PersonAPI}/${this.personId}`,
            headers: store.getters.ajaxHeader,
            body: {
              fieldName: 'biography',
              value: this.biographyEdited,
            },
            json: true,
        };

        const response = await request.put(options) as Person;
        window.console.log(response);
        const param = new ProfileEmitArgs(
                      response,
                      'biography',
                      this.biographyEdited,
                      this.biography);

        this.$emit('biographyUpdated', param);

      } catch (ex) {
        store.commit('setErrorMessage', ex);
      }
    }
  }
}
</script>

<!-- "scoped" attribute removed to fill screen -->
<style>
  .biography-editor {
    min-height: 500px;
    margin-bottom: 50px;
  }

  .biography-paragraph {
    min-height: 500px;
    margin-bottom: 50px;
  }

  .tox-statusbar__branding {
    display: none !important;
  }

  .tox-notification--in {
    display: none !important;
  }
</style>
