<template>
<div>
    <b-button :title="$t('message.BreakLinks')" variant="warning" class="split-control" 
        v-bind:style="positionStyle" v-if="hasRelations" v-b-modal.split-modal>
      <span class="oi oi-link-broken" aria-hidden="true"></span>
    </b-button>

    <b-modal 
        id="split-modal" 
        centered
        ok-only
        :title="$t('message.BreakLinks')"
        :okTitle="$t('message.Close')">
      
      <SplitRelationItem 
            v-for="relation of relations" 
            :key="relation.id" 
            v-bind:splitRelation="relation"
            @split="split"/>

      <Loading v-if="loading"/>
    </b-modal>
    
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import APIException from '@/models/data/api_exception';
import store from '../../store/store';
import { configs } from '../../config';
import TreeNode from '../../models/tree/treeNode';
import Person from '../../models/data/person';
import SplitRelation from '../../models/data/split_relation';
import SplitRelationItem from './SplitRelationItem.vue';
import Loading from '../common/Loading.vue';

@Component({
  components: {
    SplitRelationItem,
    Loading,
  },
})
export default class SplitRelations extends Vue {

  public static LEFT_MARGIN = -25;
  public static HEIGHT = 60;

  public relations: SplitRelation[] = [];
  public get hasRelations(): boolean {
    return this.relations.length > 0;
  }

  public loading: boolean = false;

  public positionStyle: any = {};

  constructor() {
    super();

    const height = SplitRelations.HEIGHT;
    const width = SplitRelations.HEIGHT;

    this.positionStyle.width = `${width}px`;
    this.positionStyle['margin-left'] = `${-TreeNode.WIDTH / 2 - width - SplitRelations.LEFT_MARGIN}px`;

    this.positionStyle.height = `${height}px`;
    this.positionStyle['margin-top'] = `${-height - TreeNode.HEIGHT / 2 + 50}px`;
    this.positionStyle['border-radius'] = `${height / 2}px`;
  }

  protected mounted() {
    // window.console.log(`SplitRelations.mounted()`);

    this.relations = SplitRelation.createSplitRelations(
                                        Number(store.state.person_id),
                                        store.state.relations,
                                        store.state.people);
  }

  private async split(relation: SplitRelation) {
    // window.console.log(`SplitRelations.split()`);

    try {
      this.loading = true;
      const options: AxiosRequestConfig = {
          url: `${configs.BaseApiUrl}${configs.RelationAPI}${relation.id}/`,
          headers: store.getters.ajaxHeader,
          method: 'DELETE',
          responseType: 'json',
      };

      await axios.request(options);

      store.dispatch('removeRelations', [relation.relation]);

      this.relations = SplitRelation.createSplitRelations(
                                    Number(store.state.person_id),
                                    store.state.relations,
                                    store.state.people);
    } catch (ex) {
      const axiosError = ex as AxiosError<APIException>;
      this.$emit('onError', axiosError?.response?.data?.detail);
    }

    this.loading = false;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.split-control {
  position: absolute;
  left: 50%;
  top: 50%;
  opacity: 0.9;
  padding-left: 14px;
  font-size: 2em;
  box-shadow: 2px 2px 5px black;
}


</style>
