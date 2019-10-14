<template>
<div>
    <b-button :title="$t('message.Delete')" 
      variant="danger" class="delete-control" 
      v-bind:style="positionStyle" v-if="deleteAllowed" 
      v-b-modal.delete-modal>
      <span class="oi oi-trash" aria-hidden="true"></span>
    </b-button>

    <b-modal id="delete-modal" 
        ref="modal"
        centered
        @ok="handleOk" 
        okVariant="danger"
        :title="$t('message.Delete')"
        :okTitle="$t('message.Delete')"
        :cancelTitle="$t('message.Cancel')" >
      <p> {{ $t('message.AreYouSureDelete') }}</p>
    </b-modal>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as request from 'request-promise-native';
import store from '../../store/store';
import { configs } from '../../config';
import TreeNode from '../../models/tree/treeNode';
import Person from '../../models/data/person';

@Component
export default class DeletePerson extends Vue {

  public static LEFT_MARGIN = -25;
  public static HEIGHT = 60;

  public deleteAllowed: boolean = false;

  public positionStyle: any = {};

  constructor() {
    super();

    const height = DeletePerson.HEIGHT;
    const width = DeletePerson.HEIGHT;

    this.positionStyle.width = `${width}px`;
    this.positionStyle['margin-left'] = `${-TreeNode.WIDTH / 2 - width - DeletePerson.LEFT_MARGIN}px`;

    this.positionStyle.height = `${height}px`;
    this.positionStyle['margin-top'] = `${-height / 2 + 100}px`;
    this.positionStyle['border-radius'] = `${height / 2}px`;
  }

  public async handleOk() {
    // window.console.log(`DeletePerson.handleOk()`);

    try {
      store.commit('updateLoading', true);
      const selectedPersonId = store.state.person_id;

      const options = {
          uri: `${configs.BaseApiUrl}${configs.PersonAPI}${selectedPersonId}/`,
          headers: store.getters.ajaxHeader,
          json: true,
      };

      await request.delete(options);
      await store.dispatch('removePerson', selectedPersonId);

} catch (ex) {
        // window.console.log(ex);
        store.commit('setErrorMessage', ex);
    }
    store.commit('updateLoading', false);
    (this.$refs.modal as any).hide();
  }

  protected async mounted() {
    // window.console.log(`DeletePerson.mounted()`);

    const selectedPerson = store.state.person_id;

    const options = {
        uri: `${configs.BaseApiUrl}${configs.PersonAPI}${selectedPerson}/`,
        headers: store.getters.ajaxHeader,
        json: true,
    };

    const person = await request.get(options) as Person;
    // window.console.log(person);
    if (!person.user_id) {
      this.deleteAllowed = true;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.delete-control {
  position: absolute;
  left: 50%;
  top: 50%;
  opacity: 0.9;
  padding-left: 16px;
  font-size: 2em;
  box-shadow: 2px 2px 5px black;
}


</style>
