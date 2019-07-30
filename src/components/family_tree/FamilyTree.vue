<template>
  <div id="tree-container" class="tree-container">
      <canvas id="tree-canvas" v-bind:class="treeCanvasClass"></canvas>
      <TreeNavControls v-if="!editMode" @zoomIn="zoomIn" @zoomOut="zoomOut" />
      <TreeEditControl v-if="!editMode" @click="edit" />
      <TreeCancelEditControl v-if="editMode" @click="cancelEdit" />
      <AddAncestor v-if="editMode" @personCreated="personCreated" />
      <AddDescendant v-if="editMode" @personCreated="personCreated" />
      <AddPartner v-if="editMode" @personCreated="personCreated" />
      <DeletePerson v-if="editMode" @personRemoved="personRemoved"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { Promise } from 'q';
import store from '../../store/store';
import Person from '../../models/data/person';
import Relation from '../../models/data/relation';
import Tree from '../../models/tree/tree';
import * as request from 'request-promise-native';
import Scroller from '../../models/tree/scroller.js';
import TreeNavControls from './TreeNavControls.vue';
import TreeEditControl from './TreeEditControl.vue';
import TreeCancelEditControl from './TreeCancelEditControl.vue';
import AddAncestor from './AddAncestor.vue';
import AddDescendant from './AddDescendant.vue';
import AddPartner from './AddPartner.vue';
import DeletePerson from './DeletePerson.vue';
import NewPersonResponse from '../../models/data/new_person_response';

@Component({
  components: {
    TreeNavControls,
    TreeEditControl,
    TreeCancelEditControl,
    AddAncestor,
    AddDescendant,
    AddPartner,
    DeletePerson,
  },
})
export default class FamilyTree extends Vue {

    public editMode: boolean = false;
    public people: Person[] = [];
    public relations: Relation[] = [];
    public treeCanvasClass: string = 'tree-canvas';

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
          tree.setDisabled(this.editMode);
          tree.render(true);
        }
      }
    }

    protected mounted() {
      window.console.log('FamilyTree.vue mounted() call');

      this.setCanvasSize();

      window.addEventListener('resize', () => this.initializeTree(this.people, this.relations), false);
    }

    private zoomIn() {

      const midy = (Scroller as any).canvas.height / 2;
      const midx = (Scroller as any).canvas.width / 2;

      (Scroller as any).ctx.translate(-midx, -midy);
      (Scroller as any).ctx.scale(1.1, 1.1);
      (Scroller as any).ctx.translate(midx, midy);

      (Scroller as any).tree.render();
    }

    private edit() {
      window.console.log('FamilyTree.vue edit() call');
      const tree = (Scroller as any).tree as Tree;
      (Scroller as any).smoothTranslateAndZoomTo(tree.selectedNode.xMid, tree.selectedNode.yMid, 1);

      window.setTimeout(() => {
        this.editMode = true;
        tree.setDisabled(true);
        tree.render(false);
        this.treeCanvasClass = 'tree-canvas-disabled';
      }, 300);
    }

    private cancelEdit() {
      this.editMode = false;
      const tree = (Scroller as any).tree as Tree;
      tree.setDisabled(false);
      tree.render(false);
      this.treeCanvasClass = 'tree-canvas';
    }


    private zoomOut() {
      const midy = (Scroller as any).canvas.height / 2;
      const midx = (Scroller as any).canvas.width / 2;

      (Scroller as any).ctx.translate(-midx, -midy);
      (Scroller as any).ctx.scale(0.9, 0.9);
      (Scroller as any).ctx.translate(midx, midy);

      (Scroller as any).tree.render();
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

    private personRemoved(personId: number) {
      window.console.log(`FamilyTree.personRemoved()`);

      this.$emit('personRemoved', Number(personId));
    }

    private personCreated(newPersonData: NewPersonResponse) {
      window.console.log(`FamilyTree.personCreated()`);

      this.$emit('personCreated', newPersonData);
    }
}
</script>

<!-- "scoped" attribute removed to fill screen -->
<style scoped>

#tree-container, #tree-canvas {
  /* height:100%;
  width:100%; */
  padding:0px;
  margin:0px;
  overflow: hidden;
}

.tree-canvas {
  background-color: thistle;
}

.tree-canvas-disabled {
  background-color: #555;
}

</style>
