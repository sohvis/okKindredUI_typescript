<template>
    <div class="image-row">
        <!-- Wierd index forces re-render when display width changes-->
        <ImageItem 
            v-for="image of imageItems" 
            :key="image.id + '_' + image.display_width" 
            v-bind:image="image">
        </ImageItem>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop} from 'vue-property-decorator';
import config from '../../config';
import Image from '../../models/data/image';
import ImageItem from './ImageItem.vue';

@Component({
  components: {
      ImageItem,
  },
})
export default class ImageRow extends Vue {

    public static DEFAULT_HEIGHT = 200;
    public static MAX_HEIGHT = 400;

    @Prop({ default: [] })
    public imageRow?: Image[];

    public imageItems: Image[] = [];

    @Prop({ default: 800 })
    public width?: number;

    @Watch('imageRow')
    public renderGalleryItems(): void {
        window.console.log(`ImageRow.render()`);

        window.console.log(`this.width: ${this.width}`);

        if (this.imageRow && this.width) {
            const h = this.getHeight();

            for (const gallery of this.imageRow) {
                let scale = 1;
                if (gallery.thumbnail_height > 0) {
                    scale = h / gallery.thumbnail_height;
                }

                gallery.display_height = gallery.thumbnail_height * scale;
                gallery.display_width = gallery.thumbnail_width * scale;
            }

            this.imageItems = this.imageRow;
        }
    }

    protected mounted() {
        this.renderGalleryItems();
    }

    private getHeight(): number {

        window.console.log(`ImageRow.getHeight()`);

        if (!this.imageRow || !this.width) {
            return ImageRow.DEFAULT_HEIGHT;
        }

        let sum = 0;
        for (const gallery of this.imageRow) {
            if (gallery.thumbnail_height > 0) {
                sum += (gallery.thumbnail_width / gallery.thumbnail_height);
            }
        }
        const value = this.width / sum;

        window.console.log(`getHeight(): ${value}`);
        return Math.min(ImageRow.MAX_HEIGHT, value);
    }
}
</script>

<style scoped>

.image-row {
    overflow: hidden;
}
</style>
