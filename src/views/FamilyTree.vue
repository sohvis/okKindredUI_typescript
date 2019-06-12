<template>
  <div class="tree-container">
      <canvas id="tree-canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { Promise } from 'q';
import Person from './../models/person';
import Relation from './../models/relation';
import Tree from './../models/tree';
import * as request from 'request-promise-native';
import Scroller from './../models/scroller.js';


@Component
export default class FamilyTree extends Vue {

    public people: Person[] = [];
    public relations: Relation[] = [];
    public tree: Tree | null = null;

    protected mounted() {

        window.console.log('FamilyTree.vue mounted() call');


        const htmlCanvas = document.getElementById('tree-canvas') as HTMLCanvasElement;
        if (!htmlCanvas) { return; }
        htmlCanvas.width = window.innerWidth;
        htmlCanvas.height = window.innerHeight;

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

              window.console.log(`Building Tree`);
              this.tree = new Tree(htmlCanvas, this.people, this.relations);

              Scroller.initialize(htmlCanvas, this.tree);
              this.tree.render();

              window.addEventListener('resize', this.ResizeCanvasToFitWindow, false);

            } else {
              this.$router.push('/accounts/login/');
            }
        });
    }



    private ResizeCanvasToFitWindow() {
        const htmlCanvas = document.getElementById('tree-canvas') as HTMLCanvasElement;
        htmlCanvas.width = window.innerWidth;
        htmlCanvas.height = window.innerHeight;

        if (this.tree) {
          this.tree.render();
        }
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

#tree-container {
    position: absolute;
    left: 20px;
    top: 20px;
    bottom: 20px;
    right: 20px;
    border: 5px solid black;
    cursor: default;
    overflow: hidden;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
}

#tree-canvas { 
  background-color: thistle;
}
</style>
