<template>
<div :id="'parent_' + splitRelation.id" class="row text-center split-rel-row">
  <canvas :id="'lineCanvas' + splitRelation.id" class="lineCanvas"></canvas>
  <div class="col split-rel-col">
    <img :id="'from_' + splitRelation.id" :src="splitRelation.fromPersonImage" class="split-rel-image"/>
    <div class="split-rel-desc">
      {{ splitRelation.fromPersonName }}
    </div>
  </div>
  <div class="col split-rel-col">
      <b-button variant="danger" class="split-button" :id="'button_' + splitRelation.id" @click="click">
        <span class="oi oi-x" aria-hidden="true"></span>
      </b-button>
      <div class="split-rel-desc">
        {{ $t(splitRelation.relationName) }}
      </div>
  </div>
  <div class="col split-rel-col">
      <img :id="'to_' + splitRelation.id" :src="splitRelation.toPersonImage" class="split-rel-image" />
      <div class="split-rel-desc">
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
    // window.console.log(`SplitRelationItem.mounted()`);

    window.setTimeout(() => this.drawLines(), 200);
  }
  protected drawLines() {
    // window.console.log(`SplitRelationItem.drawLines()`);

    if (this.splitRelation) {
      const canvas = document.getElementById('lineCanvas' + this.splitRelation.id) as HTMLCanvasElement;
      const ctx  = this.setupCanvas(canvas);


      const parent = (document.getElementById('parent_' + this.splitRelation.id) as HTMLElement)
                                    .getBoundingClientRect();
      const fromImage = (document.getElementById('from_' + this.splitRelation.id) as HTMLElement)
                                    .getBoundingClientRect();

      const button = (document.getElementById('button_' + this.splitRelation.id) as HTMLElement)
                                    .getBoundingClientRect();

      const toImage = (document.getElementById('to_' + this.splitRelation.id) as HTMLElement)
                                    .getBoundingClientRect();

      const start1 = new Point(fromImage.left - parent.left + fromImage.width, fromImage.height / 2);
      const end1 = new Point(toImage.left - parent.left, fromImage.height / 2);
      const line1 = new Line(start1, end1, SplitRelationItem.STROKE_STYLE, SplitRelationItem.LINE_WIDTH);

      line1.draw(ctx);
    }
  }

  private setupCanvas(canvas: HTMLCanvasElement): CanvasRenderingContext2D {

    // Get the device pixel ratio, falling back to 1.
    const dpr = window.devicePixelRatio || 1;

    // Get the size of the canvas in CSS pixels.
    const rect = canvas.getBoundingClientRect();

    // Give the canvas pixel dimensions of their CSS
    // size * the device pixel ratio.
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('No 2d canvas element!');
    }

    // Scale all drawing operations by the dpr, so you
    // don't have to worry about the difference.
    ctx.scale(dpr, dpr);
    return ctx;
  }

  private click() {
    this.$emit('split', this.splitRelation);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.split-button {
  margin-top: 10px;
  padding-left: 10px;
  padding-right: 8px;
  font-size: 1.2em;
  box-shadow: 1px 1px 2px black;
  border-radius: 50px;
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
  min-height: 80px;
}

.lineCanvas {
  position: absolute;
  height: 80px;
  width: 100%;
}

.split-rel-desc {
  word-wrap: break-word;
}

@media only screen 
and (max-width : 400px) {
  .split-rel-image {
    width: 40px;
    height: 40px;
    margin-left: auto;
    margin-right: auto;
  }

  .split-button {
    margin-top: 5px;
    padding-left: 10px;
    padding-right: 8px;
    font-size: 0.8em;
    box-shadow: 1px 1px 2px black;
    border-radius: 50px;
  }

  .split-rel-desc {
    font-size: 0.8em;
  }
}
</style>
