<template>
<div 
  :id="`suggested-tag-box-${this.suggestedTag.id}`"
  class="suggested-tag-box"
  v-bind:style="suggestedTagboxStyle"
  @click="suggestedTagNameClick">
  <div
    class="suggested-tag-name"
    v-bind:style="suggestedTagnameStyle">
    {{ $t('message.WhoIsThis') }}
  </div>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import * as request from 'request-promise-native';
import config from '../../config';
import SuggestedTag from '../../models/data/suggested_tag';
import store from '../../store/store';

@Component({
  components: {
  },
})
export default class SuggestedTagBox extends Vue {

  @Prop({default: null})
  public suggestedTag?: SuggestedTag | null;

  public suggestedTagboxStyle = {};

  public suggestedTagnameStyle = {};

  @Watch('suggestedTag')
  public updateStyle() {
    // window.console.log('TagBox.updateStyle()');

    if (this.suggestedTag) {
      const suggestedTagBox = document.getElementById(`suggested-tag-box-${this.suggestedTag.id}`) as HTMLDivElement;
      const container = suggestedTagBox.parentNode as HTMLDivElement;

      const left = container.clientLeft + container.clientWidth * this.suggestedTag.x1;
      const width = container.clientLeft + container.clientWidth * this.suggestedTag.x2 - left;
      const top = container.clientTop + container.clientHeight * this.suggestedTag.y1;
      const height = container.clientTop + container.clientHeight * this.suggestedTag.y2 - top;

      this.suggestedTagboxStyle = {
        left: `${left}px`,
        width: `${width}px`,
        top: `${top}px`,
        height: `${height}px`,
      };

      this.suggestedTagnameStyle = {
        'margin-top': `${height}px`,
      };
    }
  }

  protected mounted() {
    // window.console.log('TagBox.mounted()');
    this.updateStyle();
  }

  private suggestedTagNameClick(e: MouseEvent) {
    if (this.suggestedTag) {
      this.$emit('suggestedTagClick', this.suggestedTag);
    }
  }
}
</script>


<style scoped>
.suggested-tag-box {
  border-color: yellow;
  border-style: solid;
  border-width: 2px;
  position: absolute;
  opacity: 1.0;
  cursor: pointer;
}

.suggested-tag-name {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  color: yellow;
  opacity: 1.0;
  text-align: center;
  font-size: 0.7em;
  padding: 2px;
}
</style>
