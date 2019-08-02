<template>
<div>
    <b-button variant="warning" class="split-control" 
        v-bind:style="positionStyle" v-if="hasRelations" v-b-modal.split-modal>
      <span class="oi oi-link-broken" aria-hidden="true"></span>
    </b-button>

    <b-modal 
        id="split-modal" 
        centered
        ok-only
        :title="$t('message.SplitLinks')"
        :okTitle="$t('message.Close')">
      
      <SplitRelationItem 
            v-for="relation of relations" 
            :key="relation.id" 
            v-bind:splitRelation="relation"/>
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
import SplitRelation from '../../models/data/split_relation';
import SplitRelationItem from './SplitRelationItem.vue';


@Component({
  components: {
    SplitRelationItem,
  },
})
export default class SplitRelations extends Vue {

  public static LEFT_MARGIN = -25;
  public static HEIGHT = 60;

  public relations: SplitRelation[] = [];
  public get hasRelations(): boolean {
    return this.relations.length > 0;
  }

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
    window.console.log(`SplitRelations.mounted()`);

    const selectedPersonId = Number(store.state.person_id);

    this.relations = SplitRelation.createSplitRelations(
                                        selectedPersonId,
                                        store.state.relations,
                                        store.state.people);
    window.console.log('this.relations:');
    window.console.log(this.relations);
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
