<template>
  <div class="tree-nav-control-container">
    <div>
      <button type="button" class="btn btn-light zoom-control" @click="zoomIn()">
        <span class="oi oi-plus" aria-hidden="true"></span>
      </button>
    </div>
    <div>
      <button type="button" class="btn btn-light zoom-control" @click="zoomOut()">
        <span class="oi oi-minus" aria-hidden="true"></span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

/**
 * Only show controls if on desktop browser
 */
@Component
export default class TreeNavControls extends Vue {

  private zoomIn() {
    this.$emit('zoomIn');
  }

  private zoomOut() {
    this.$emit('zoomOut');
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.tree-nav-control-container {
  z-index: 3;
  position: absolute;
  left: 20px;
  bottom: 20px;
}

.zoom-control {
  margin-top:2px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 8px;
  padding-right: 8px;
  font-size: 0.8em;
}

</style>
