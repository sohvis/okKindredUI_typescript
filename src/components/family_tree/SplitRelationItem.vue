<template>
<div class="row text-center split-rel-row">
  <canvas id="lineCanvas" class="lineCanvas"></canvas>
  <div :id="'parent_' + splitRelation.id" class="col split-rel-col">
    <img :id="'from_' + splitRelation.id" :src="splitRelation.fromPersonImage" class="split-rel-image"/>
    <div>
      {{ splitRelation.fromPersonName }}
    </div>
  </div>
  <div class="col">
      <b-button variant="danger" class="split-button" :id="'button_' + splitRelation.id">
        <span class="oi oi-x" aria-hidden="true"></span>
      </b-button>
      <div>
        {{ $t(splitRelation.relationName) }}
      </div>
  </div>
  <div class="col">
      <img :id="'to_' + splitRelation.id" :src="splitRelation.toPersonImage" class="split-rel-image" />
      <div>
        {{ splitRelation.toPersonName }}
      </div>
  </div>
</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import SplitRelation from '../../models/data/split_relation';
import Line from '../../models/data/line';
import Point from '../../models/tree/point';

@Component
export default class SplitRelationItem extends Vue {

  public static STROKE_STYLE = '#2e6f9a';
  public static LINE_WIDTH = 2;

  @Prop({default: null})
  public splitRelation?: SplitRelation;


  protected mounted() {
    window.console.log(`SplitRelationItem.mounted()`);

    window.setTimeout(() => this.drawLines(), 200);
  }
  protected drawLines() {
    window.console.log(`SplitRelationItem.drawLines()`);
    const canvas = document.getElementById('lineCanvas') as HTMLCanvasElement;
    const ctx  = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('No 2d canvas element!');
    }

    if (this.splitRelation) {

      const parent = (document.getElementById('parent_' + this.splitRelation.id) as HTMLElement)
                                    .getBoundingClientRect();
      const fromImage = (document.getElementById('from_' + this.splitRelation.id) as HTMLElement)
                                    .getBoundingClientRect();

      const button = (document.getElementById('button_' + this.splitRelation.id) as HTMLElement)
                                    .getBoundingClientRect();

      const toImage = (document.getElementById('to_' + this.splitRelation.id) as HTMLElement)
                                    .getBoundingClientRect();

      window.console.log(fromImage);

      const start1 = new Point(fromImage.right - parent.left, 30);
      const end1 = new Point(button.left - parent.left, 30);
      const line1 = new Line(start1, end1, SplitRelationItem.STROKE_STYLE, SplitRelationItem.LINE_WIDTH);

      const start2 = new Point(button.right - parent.left, 30);
      const end2 = new Point(toImage.left - parent.left, 30);
      const line2 = new Line(start2, end2, SplitRelationItem.STROKE_STYLE, SplitRelationItem.LINE_WIDTH);
      
      line1.draw(ctx);
      line2.draw(ctx);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.split-button {
  opacity: 0.9;
  padding-left: 12px;
  padding-right: 10px;
  font-size: 1.2em;
  box-shadow: 1px 1px 2px black;
  border-radius: 40px;
}

.split-rel-image {
  width: 60px;
  height: 60px;
  margin-left: auto;
  margin-right: auto;
}

 .split-rel-row {
   margin-top: 25px;
   margin-bottom: 25px;
 }

 .split-rel-col {
   height: 80px;
 }

 .lineCanvas {
   position: absolute;
   height: 80px;
   width: 100%;
 }
</style>
