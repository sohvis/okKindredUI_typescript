<template>
<div v-show="showTagging" 
      v-bind:style="overlayStyle" 
      class="tagging-overlay"
      @click="overlayClicked">
    <span class="oi oi-x top-corner" @click="closeClicked"></span>
    <div class="add-tags-message">{{ $t('message.AddTags') }}</div>
    <TagBox 
        v-for="tag of tags" 
        :ref="`tagBox${tag.id}`"
        :key="tag.id" 
        :tag="tag">
    </TagBox> 
    <Loading v-show="loading" />
    <WhoIsThis ref="whoIsThis" @tagCreated="tagCreated" />
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import * as request from 'request-promise-native';
import config from '../../config';
import Image from '../../models/data/image';
import Tag from '../../models/data/tag';
import Loading from '../common/Loading.vue';
import store from '../../store/store';
import PhotoSwipeWrapper from '../../models/lightbox/photoswipeWrapper';
import PhotoSwipeItem from '../../models/lightbox/photoswipe_item';
import TagBox from './TagBox.vue';
import WhoIsThis from './WhoIsThis.vue';

@Component({
  components: {
    Loading,
    TagBox,
    WhoIsThis,
  },
})
export default class TaggingOverlay extends Vue {

    public loading: boolean = false;

    public showTagging: boolean = false;

    public tags: Tag[] = [];

    public overlayStyle = {};

    public image: Image | null = null;

    public imageElement: HTMLImageElement | null = null;

    public closedClicked = false;

    public async toggle(photoswipeWrapper: PhotoSwipeWrapper) {
      window.console.log(`TaggingOverlay.toggle()`);

      this.showTagging = !this.showTagging;
      if (this.showTagging) {
          const image = (photoswipeWrapper.photoswipe.currItem as PhotoSwipeItem).image;
          await this.initialise(image, photoswipeWrapper);

      } else {
         this.destroy();
      }
    }

    public async initialise(image: Image, photoswipeWrapper: PhotoSwipeWrapper) {
      window.console.log(`TaggingOverlay.initialise()`);
      this.loading = true;
      this.closedClicked = false;

      this.image = image;
      photoswipeWrapper.photoswipe.listen('destroy', this.destroy);
      this.sizeOverlay();

      try {
          const options = {
              uri: `${config.BaseApiUrl}${config.ImageTaggingAPI}${image.id}`,
              headers: store.getters.ajaxHeader,
              json: true,
          };

          this.tags = await request.get(options) as Tag[];

        } finally {

          this.loading = false;
        }
    }

    public destroy() {
      window.console.log(`TaggingOverlay.destroy()`);
      this.showTagging = false;
      this.tags = [];
      this.overlayStyle = {
        top: `0px`,
        left: `0px`,
        width: `0px`,
        height: `$0px`,
      };
    }

    protected mounted() {
      window.addEventListener('resize', () => this.sizeOverlay(), false);
    }

    private sizeOverlay() {
      window.console.log(`TaggingOverlay.sizeOverlay()`);

      if (this.image && this.showTagging) {

        this.imageElement = this.getImageElement(this.image);

        if (this.imageElement) {

          const dimensions = this.imageElement.getBoundingClientRect();
          this.overlayStyle = {
            top: `${dimensions.top}px`,
            left: `${dimensions.left}px`,
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
          };

          for (const tag of this.tags) {
            ((this.$refs[`tagBox${tag.id}`] as Vue[])[0] as TagBox).updateStyle();
          }
        }
      }
    }

    private getImageElement(image: Image): HTMLImageElement | null {
      window.console.log(`TaggingOverlay.getImageElement()`);

      // Gets image element
      const pswpImg = document.getElementsByClassName('pswp__img');

      for (const htmlElement of pswpImg) {
        const imgElement = htmlElement as HTMLImageElement;
        if (imgElement && imgElement.src.includes(image.large_thumbnail)) {
          return imgElement;
        }
      }

      window.console.log(`no image element found`);
      return null;
    }

    private closeClicked(evt: MouseEvent) {
      this.closedClicked = true;
      this.destroy();
    }

    private async overlayClicked(evt: MouseEvent) {
      window.console.log(`TaggingOverlay.overlayClicked()`);
      window.console.log(evt);

      if (this.imageElement && this.image) {
        const imageDimensions = this.imageElement.getBoundingClientRect();

        // Ensure area is a square, 4% or 30px whichever is bigger
        const horizSize = Math.max(0.04, 30 / imageDimensions.width);
        const vertSize = horizSize / imageDimensions.height * imageDimensions.width;

        let x1 = Math.max(evt.offsetX / imageDimensions.width - horizSize, 0);
        let x2 = x1 + 2 * horizSize;

        if (x2 > 1) {
          x2 = 1;
          x1 = x2 - 2 * horizSize;
        }

        let y1 = Math.max(evt.offsetY / imageDimensions.height - vertSize, 0);
        let y2 = y1 + 2 * vertSize;

        if (y2 > 1) {
          y2 = 1;
          y1 = y2 - 2 * vertSize;
        }

        window.console.log(`x1: ${x1}, x2: ${x2}, y1: ${y1}, y2: ${y2}`);

        const image = this.image;
        this.$nextTick(() => {
          if (!this.closedClicked) {
            (this.$refs.whoIsThis as WhoIsThis).show(x1, x2, y1, y2, image);
          }
        });
      }
    }

    private tagCreated(newTag: Tag) {
      this.tags.push(newTag);
    }
}
</script>


<style scoped>
.tagging-overlay{
  position: absolute;
  z-index: 1031;
  background-color: rgba(0, 0, 0, 0.6);
}

.top-corner {
    position: absolute;
    right: 3px;
    top: 3px;
    font-size: 1.3em;
    cursor: pointer;
    z-index: 1030;
    color: white;
    background-color: rgba(0, 0, 0, 0.4);
    border-style: solid;
    border-width: 1px;
    border-color: rgba(0, 0, 0, 0.4); 
    border-radius: 4px;
    padding-top: 2px;
    padding-bottom: 6px;
    padding-left: 4px;
    padding-right: 4px;
    opacity: 1.0;
}

.top-corner:hover {
    color: gray;
    background-color: black;
    border-color: black; 
}

.add-tags-message {
  color: white;
  left: 3px;
  top: 3px;
  padding-left: 5px;
  padding-top: 3px;
  font-size: 0.8em;
}
</style>
