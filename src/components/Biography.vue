<template>
    <div class="col-md-12">
        <h4>
          {{ $t('message.Biography') }}
          <b-button class="btn-profile" variant="outline-secondary" v-if="!locked && !editMode" v-on:click="edit()" >
              <span class="oi oi-pencil" aria-hidden="true"></span>
          </b-button>
        </h4>
        <p v-if="!editMode" v-html="biographyDisplay"></p>
        <tinymce-editor 
            v-if="editMode" 
            class="biography-editor" 
            api-key:configs.TinyMceApiToken 
            v-model="biographyEdited"
            @onChange="onChange"
            @onBlur="onBlur">
        </tinymce-editor>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import store from '../store/store';
import Person from './../models/data/person';
import Editor from '@tinymce/tinymce-vue';
import configs from '../config';
import { setTimeout } from 'timers';
import * as request from 'request-promise-native';

@Component({
  components: {
    'tinymce-editor': Editor,
  },
})
export default class Biography extends Vue {

  @Prop({default: ''})
  public personId?: string;

  @Prop({default: ''})
  public biography?: string;

  public biographyEdited?: string;

  get biographyDisplay(): string {
    if (!this.biography) {
      return this.$t('message.BiographyNotExist').toString();
    }

    return this.biography;
  }

  @Prop({default: false})
  public locked?: boolean;

  public editMode: boolean = false;

  public saveCalled: boolean = false;

  protected mounted() {
    window.console.log('Biography.vue mounted() called');
  }

  private edit() {
    this.biographyEdited = this.biography;
    this.editMode = true;
  }

  private async onBlur() {
    window.console.log(`Biography.onBlur() called`);

    this.editMode = false;
    if (!this.saveCalled) {
      await this.save();
    }
  }

  private async onChange() {
    window.console.log(`Biography.onChange() called`);

    if (!this.saveCalled) {
      this.saveCalled = true;

      setTimeout(async () => {
        await this.save();
      }, 3000);
    }
  }

  private async save() {

    window.console.log(`Biography.save() called`);

    this.saveCalled = false;
    
    const options = {
        uri: `${configs.BaseApiUrl}${configs.PersonAPI}/${this.personId}`,
        headers: store.getters.ajaxHeader,
        body: {
          fieldName: 'biography',
          value: this.biographyEdited,
        },
        json: true,
    };

    const response = await request.put(options);
    window.console.log(response);
    this.$emit('biographyUpdated', this.biographyEdited);
  }
}
</script>

<!-- "scoped" attribute removed to fill screen -->
<style>
  .biography-editor {
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
