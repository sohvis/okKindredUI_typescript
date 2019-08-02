<template>
<div class="row">
  <div class="col-sm">
    <img :src="splitRelation.fromPersonImage" class="split-rel-image"/>
    <div>
      {{ splitRelation.fromPersonName }}
    </div>
  </div>
  <div class="col-sm">
      <b-button variant="warning" class="split-button">
        <span class="oi oi-link-broken" aria-hidden="true"></span>
      </b-button>
      <div>
        {{ $t(splitRelation.relationName) }}
      </div>
  </div>
  <div class="col-sm">
      <img :src="splitRelation.toPersonImage" class="split-rel-image" />
      <div>
        {{ splitRelation.toPersonName }}
      </div>
  </div>
</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import SplitRelation from '../../models/data/split_relation';

@Component
export default class SplitRelationItem extends Vue {

  @Prop({default: null})
  public splitRelation?: SplitRelation;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.split-button {
  opacity: 0.9;
  padding-left: 10px;
  font-size: 1em;
  box-shadow: 2px 2px 5px black;
  border-radius: 20px;
  margin-left: auto;
  margin-right: auto;
}

.split-rel-image {
  width: 30px;
  height: 30px;
  margin-left: auto;
  margin-right: auto;
}
</style>
