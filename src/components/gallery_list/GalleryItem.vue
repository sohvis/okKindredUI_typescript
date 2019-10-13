<template>
    <div class="gallery-thumb-container"
        @click="click"
        :to="`/gallery/${this.gallery.id}/?page=1`">
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
        </div>
        <div :style="{width: width }" class="bottom-left">{{ gallery.title }}</div>
        <CheckBox ref="checkBox" 
            v-if="editMode" 
            class="top-left"
            @checkboxChanged="checkboxChanged"/>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop} from 'vue-property-decorator';
import config from '../../config';
import Gallery from '../../models/data/gallery';
import CheckBox from '../common/CheckBox.vue';

@Component({
  components: {
      CheckBox,
  },
})
export default class GalleryItem extends Vue {

    @Prop()
    public gallery?: Gallery;

    @Prop({ default: false})
    public editMode?: boolean;

    public get checked(): boolean {
        return (this.$refs.checkBox as CheckBox).checked;
    }

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

    private click() {
        if (this.gallery) {
            if (this.editMode) {
                (this.$refs.checkBox as CheckBox).toggle();
            } else {
                this.$router.push(`/gallery/${this.gallery.id}/?page=1`);
            }
        }
    }

    private checkboxChanged(checked: boolean) {
        if (this.gallery) {
            this.$emit('selectionChanged', this.gallery.id, checked);
        }
    }
}
</script>

<style scoped>

.gallery-thumb-container {
    position: relative;
    float: left;
    background-color: #647;
    cursor: pointer;
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
    color: white;
    font-size: 0.7em;
}

.top-left {
    position: absolute;
    top: 5px;
    left: 5px;
}
</style>
