<template>
  <div class="tree-cancel-edit-control-container">
    <button type="button" class="btn btn-success btn-round" @click="click">
      <span class="oi oi-check cancel-button" aria-hidden="true"></span>
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class TreeCancelEditControls extends Vue {

  private click() {
    window.console.log(`TreeCancelEditControls.click()`);
    this.$emit('click');
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.tree-cancel-edit-control-container {
  z-index: 3;
  position: absolute;
  right: 20px;
  bottom: 20px;
}

.cancel-button {
  font-size: 2.5em;
}

.btn-round {
  border-radius: 50%;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 12px;
  padding-right: 12px;
  box-shadow: 2px 2px 5px black;
}

</style>
