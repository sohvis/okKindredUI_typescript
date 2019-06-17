<template>
  <div class="tree-container">
      <canvas id="tree-canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

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

    protected mounted() {
      window.console.log('FamilyTree.vue mounted() call');


      // Load jwt from cookie and login
      this.$store.dispatch('restoreSession')
          .then(async (loggedIn) => {

          window.console.log(`loggedIn: ${loggedIn}`);

          if (loggedIn) {

            const task1 = this.LoadPersonData();
            const task2 = this.LoadRelationsData();

            await task1;
            await task2;

            window.console.log(this.people);
            window.console.log(this.relations);

            this.initializeTree();

            window.addEventListener('resize', this.initializeTree, false);

          } else {
            this.$router.push('/accounts/login/');
          }
      });
    }


    private initializeTree() {
      window.console.log(`initializeTree()`);

      const htmlCanvas = document.getElementById('tree-canvas') as HTMLCanvasElement;

    // Get the device pixel ratio, falling back to 1.
      const dpr = window.devicePixelRatio || 1;

      htmlCanvas.width = window.innerWidth * dpr;
      htmlCanvas.height = window.innerHeight * dpr;
      const ctx  = htmlCanvas.getContext('2d');
      if (!ctx) {
          throw new Error('No 2d canvas element!');
      }
      ctx.scale(dpr, dpr);
      const tree = new Tree(htmlCanvas, ctx, this.people, this.relations);

      (Scroller as any).initialize(htmlCanvas, tree);
      tree.render();
    }

    private async LoadPersonData(this: any) {

      window.console.log('LoadPersonData() call');

      this.$store.commit('updateLoading', true);

      const options = {
          uri: `${this.$config.BaseApiUrl}${this.$config.PersonAPI}`,
          headers: this.$store.getters.ajaxHeader,
          json: true,
      };

      this.people = await request.get(options);

      this.$store.commit('updateLoading', false);
    }

    private async LoadRelationsData(this: any) {
      window.console.log('LoadRelationsData() call');

      this.$store.commit('updateLoading', true);

      const options = {
          uri: `${this.$config.BaseApiUrl}${this.$config.RelationAPI}`,
          headers: this.$store.getters.ajaxHeader,
          json: true,
      };

      this.relations = await request.get(options);

      this.$store.commit('updateLoading', false);
    }
}
</script>

<!-- "scoped" attribute removed to fill screen -->
<style>

html, body, #tree-container, #tree-canvas {
  height:100%;
  width:100%;
  padding:0px;
  margin:0px;
  overflow: hidden;
}

#tree-canvas { 
  background-color: thistle;
}
</style>
