<template>
  <div id="tree-container" class="tree-container">
      <canvas id="tree-canvas" v-bind:class="treeCanvasClass"></canvas>
      <TreeNavControls v-if="!editMode" @zoomIn="zoomIn" @zoomOut="zoomOut" />
      <TreeEditControl v-if="!editMode" @click="edit" />
      <TreeCancelEditControl v-if="editMode" @click="cancelEdit" />
      <AddAncestor v-if="editMode" />
      <AddDescendant v-if="editMode" />
      <AddPartner v-if="editMode" />
      <DeletePerson v-if="editMode"/>
      <SplitRelations v-if="editMode"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

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
import SplitRelations from './SplitRelations.vue';
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
    SplitRelations,
  },
})
export default class FamilyTree extends Vue {

    public editMode: boolean = false;
    public treeCanvasClass: string = 'tree-canvas';

    public get people(): Person[] {
      return store.state.people;
    }

    public get relations(): Relation[] {
      return store.state.relations;
    }

    @Watch('people', {deep: true})
    public onPeopleChanged() {
      this.initializeTree();
    }

    @Watch('relations', {deep: true})
    public onRelationsChanged() {
      this.initializeTree();
    }

    public get selectedPersonId(): string {
      return store.state.person_id;
    }

    public initializeTree() {
      window.console.log(`FamilyTree.initializeTree()`);

      const canvas = document.getElementById('tree-canvas') as HTMLCanvasElement;

      if (canvas.offsetParent) {
        this.setCanvasSize();

        if (this.people && this.relations && this.people.length > 0) {

          const tree = new Tree(canvas, this.people, this.relations);
          (Scroller as any).initialize(canvas, tree);
          tree.setDisabled(this.editMode);
          tree.render();
        }
      }
    }

    protected mounted() {
      window.console.log('FamilyTree.vue mounted() call');

      this.setCanvasSize();

      window.addEventListener('resize', () => this.initializeTree(), false);

      this.monitorHeightChange(0);
    }

    @Watch('selectedPersonId')
    private onSelectedPersonChange() {
      window.console.log(`FamilyTree.onSelectedPersonChange()`);

      const canvas = document.getElementById('tree-canvas') as HTMLCanvasElement;
      if (canvas.offsetParent && canvas.clientHeight > 0) {
        const tree = (Scroller as any).tree as Tree;
        if (tree.selectedPersonId !== this.selectedPersonId) {
          this.initializeTree();
        }
      }
    }

    private monitorHeightChange(previousCanvasTop: number) {
      window.console.log('FamilyTree.monitorHeightChange()');

      const canvas = document.getElementById('tree-canvas') as HTMLCanvasElement;

      if (canvas) {
        if (canvas.offsetParent) {
          // If height has reduced, we need to redraw canvas
          const newCanvasTop = canvas.getBoundingClientRect().top;

          if (newCanvasTop + 10 < previousCanvasTop) {

            this.initializeTree();

          }

          window.setTimeout(() => this.monitorHeightChange(newCanvasTop), 1500);
        }
      }
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

      if (canvas.offsetParent) {
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
