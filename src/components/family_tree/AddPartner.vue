<template>
<div>
    <b-button variant="outline-primary" class="add-relative-control" v-bind:style="positionStyle" @click="click">
      <div>
      <img src='img/portrait_80.png' class="button-image"/>
      </div>
      <span class="oi oi-plus" aria-hidden="true"></span>
      {{ $t('message.AddPartner') }}
    </b-button>
    <div class="horizontal-line" v-bind:style="linePositionStyle"></div>
    <AddRelativeModal 
      ref="addRelativeModal"
      v-bind:title="$t('message.AddPartner')" 
      v-bind:relationType="relationType" />
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TreeNode from '../../models/tree/treeNode';
import RelationTypes from '../../models/data/relation_types';
import AddRelativeModal from './AddRelativeModal.vue';
import NewPersonResponse from '../../models/data/new_person_response';

@Component({
  components: {
    AddRelativeModal,
  },
})
export default class AddPartner extends Vue {

  public static LEFT_MARGIN = 10;
  public static HEIGHT = 100;

  public positionStyle: any = {};

  public linePositionStyle: any = {};

  public relationType: number = RelationTypes.PARTNERED;

  constructor() {
    super();

    const height = AddPartner.HEIGHT;
    const width = AddPartner.HEIGHT;

    this.positionStyle.width = `${width}px`;
    this.positionStyle['margin-left'] = `${TreeNode.WIDTH / 2 + AddPartner.LEFT_MARGIN}px`;

    this.positionStyle.height = `${height}px`;
    this.positionStyle['margin-top'] = `${-height / 2 + 25}px`;
    this.positionStyle['border-radius'] = `${height / 2}px`;

    this.linePositionStyle.width = `${AddPartner.LEFT_MARGIN - 14}px`;
    this.linePositionStyle['margin-left'] = `${TreeNode.WIDTH / 2 + 14}px`;
    this.linePositionStyle['margin-top'] = `${25}px`;

  }

  public click() {
    // window.console.log(`AddPartner.click()`);
    (this.$refs.addRelativeModal as AddRelativeModal).show();
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.add-relative-control {
  position: absolute;
  left: 50%;
  top: 50%;
  border-style: solid;
  border-color: #2e6f9a;
  border-width: 4px;
  opacity: 0.9;
  padding: 10px;
  background-color:white;
  font-size: 0.7em;
  box-shadow: 2px 2px 5px black;
}

.add-relative-control:hover {
  background-color: #2e6f9a;
}

.button-image {
  width: 25px;
  height: 25px;
}

.horizontal-line {
  position: absolute;
  border-top: 3px solid #2e6f9a;
  left: 50%;
  top: 50%;
}

</style>
