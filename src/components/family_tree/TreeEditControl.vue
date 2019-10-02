<template>
  <div class="tree-edit-control-container">
    <button :title="$t('message.Edit')" type="button" 
      class="btn btn-secondary btn-round" @click="click">
      <span class="oi oi-pencil edit-button" aria-hidden="true"></span>
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class TreeNavControls extends Vue {

  private click() {
    // window.console.log(`TreeNavControls.click()`);
    this.$emit('click');
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.tree-edit-control-container {
  z-index: 3;
  position: absolute;
  right: 20px;
  bottom: 20px;
}

.edit-button {
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
