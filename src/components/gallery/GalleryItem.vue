<template>
    <router-link 
        class="gallery-thumb-container"
        :to="`/gallery/${this.gallery.id}/`">
        <img v-if="hasThumbnail"
            :src="gallery.thumbnail" 
            :width="gallery.display_width"
            :height="gallery.display_height"/>
        <div v-if="!hasThumbnail"
            class="default-gallery-thumbnail"
            v-bind:style="{width: width, height: height}">
            <img src="img/gallery/folder.svg" 
                :width="gallery.display_width / 2"
                :height="gallery.display_height / 2" />
            <!-- <span class="oi oi-folder" aria-hidden="true"></span> -->
        </div>
        <div v-bind:style="{width: width }" class="bottom-left">{{ gallery.title }}</div>
    </router-link>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop} from 'vue-property-decorator';
import config from '../../config';
import Gallery from '../../models/data/gallery';

@Component({
  components: {
  },
})
export default class GalleryItem extends Vue {

    @Prop()
    public gallery?: Gallery;

    public get hasThumbnail(): boolean {
        if (this.gallery && this.gallery.thumbnail) {
            return true;
        } else {
            return false;
        }
    }

    public get width(): string {
        if (this.gallery && this.gallery.display_width) {
            return  this.gallery.display_width.toString() + 'px';
        } else {
            return '200px';
        }
    }

    public get height(): string {
        if (this.gallery && this.gallery.display_height) {
            return this.gallery.display_height.toString() + 'px';
        } else {
            return '200px';
        }
    }
}

</script>

<style scoped>

.gallery-thumb-container {
    position: relative;
    float: left;
    background-color: #647;
}

.default-gallery-thumbnail {
    padding: 30px;
    text-align: center;
    vertical-align: center;
}


.gallery-thumb-container :hover {
    opacity: 0.5;
}

.bottom-left {
    position: absolute;
    bottom: 0px;
    left: 0px;
    padding: 5px;
    background: #000;
    opacity: 0.7;
    color: white
}
</style>
