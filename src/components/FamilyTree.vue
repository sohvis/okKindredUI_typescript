<template>
  <div id="tree-container" class="tree-container">
      <canvas id="tree-canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { Promise } from 'q';
import Person from './../models/data/person';
import Relation from './../models/data/relation';
import Tree from './../models/tree/tree';
import * as request from 'request-promise-native';

import Scroller from './../models/tree/scroller.js';


@Component
export default class FamilyTree extends Vue {

    public people: Person[] = [];
    public relations: Relation[] = [];

    public initializeTree(people: Person[], relations: Relation[]) {
      window.console.log(`initializeTree()`);

      const canvas = document.getElementById('tree-canvas') as HTMLCanvasElement;

      const computedStyle = window.getComputedStyle(canvas);

      if (computedStyle.display !== 'none') {
      this.setCanvasSize();

      if (people && relations) {
          this.people = people;
          this.relations = relations;

          const tree = new Tree(canvas, this.people, this.relations);

          (Scroller as any).initialize(canvas, tree);
          tree.render();
        }
      }
    }

    protected mounted() {
      window.console.log('FamilyTree.vue mounted() call');

      this.setCanvasSize();

      window.addEventListener('resize', () => this.initializeTree(this.people, this.relations), false);
    }

    private setCanvasSize() {
      const canvas = document.getElementById('tree-canvas') as HTMLCanvasElement;

      const computedStyle = window.getComputedStyle(canvas);

      if (computedStyle.display !== 'none') {
        const height = window.innerHeight - canvas.getBoundingClientRect().top - 10;

        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${height}px`;
      }
    }
}
</script>

<!-- "scoped" attribute removed to fill screen -->
<style scoped>

#tree-container, #tree-canvas {
  height:100%;
  width:100%;
  padding:0px;
  margin:0px;
  overflow: hidden;
  background-color: thistle;
}

</style>
