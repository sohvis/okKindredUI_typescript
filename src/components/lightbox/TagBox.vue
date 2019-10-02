<template>
<div 
  :id="`tag-box-${this.tag.id}`"
  class="tag-box"
  v-bind:style="tagboxStyle">
  <div
    class="tag-name"
    v-bind:style="tagnameStyle"
    @click="tagNameClick">
    {{ tag.person_name }}
  </div>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import * as request from 'request-promise-native';
import config from '../../config';
import Tag from '../../models/data/tag';
import store from '../../store/store';

@Component({
  components: {
  },
})
export default class TagBox extends Vue {

  @Prop({default: null})
  public tag?: Tag | null;

  public tagboxStyle = {};

  public tagnameStyle = {};

  @Watch('tag')
  public updateStyle() {
    // window.console.log('TagBox.updateStyle()');

    if (this.tag) {
      const tagBox = document.getElementById(`tag-box-${this.tag.id}`) as HTMLDivElement;
      const container = tagBox.parentNode as HTMLDivElement;

      const left = container.clientLeft + container.clientWidth * this.tag.x1;
      const width = container.clientLeft + container.clientWidth * this.tag.x2 - left;
      const top = container.clientTop + container.clientHeight * this.tag.y1;
      const height = container.clientTop + container.clientHeight * this.tag.y2 - top;

      this.tagboxStyle = {
        left: `${left}px`,
        width: `${width}px`,
        top: `${top}px`,
        height: `${height}px`,
      };

      this.tagnameStyle = {
        'margin-top': `${height}px`,
      };
    }
  }

  protected mounted() {
    // window.console.log('TagBox.mounted()');
    this.updateStyle();
  }

  private tagNameClick() {
    if (this.tag) {
      this.$router.push(`/family/tree/${this.tag.person_id}/`);
    }
  }
}
</script>


<style scoped>
.tag-box {
  border-color: white;
  border-style: solid;
  border-width: 2px;
  position: absolute;
  opacity: 1.0;
}

.tag-name {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  opacity: 1.0;
  text-align: center;
  font-size: 0.7em;
  padding: 2px;
  cursor: pointer;
}
</style>
