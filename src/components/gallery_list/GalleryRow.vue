<template>
    <div class="gallery-row">
        <!-- Wierd index forces re-render when display width changes-->
        <GalleryItem 
            v-for="gallery of galleryItems" 
            :key="gallery.id + '_' + gallery.display_width" 
            :gallery="gallery"
            :editMode="editMode"
            @selectionChanged="selectionChanged">
        </GalleryItem>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop} from 'vue-property-decorator';
import config from '../../config';
import Gallery from '../../models/data/gallery';
import GalleryItem from './GalleryItem.vue';

@Component({
  components: {
      GalleryItem,
  },
})
export default class GalleryRow extends Vue {

    public static DEFAULT_HEIGHT = 200;
    public static MAX_HEIGHT = 300;

    @Prop({ default: [] })
    public galleryRow?: Gallery[];

    public galleryItems: Gallery[] = [];

    @Prop({ default: 800 })
    public width?: number;

    @Prop({ default: false})
    public editMode?: boolean;

    @Watch('galleryRow')
    public renderGalleryItems(): void {
        // window.console.log(`GalleryRow.render()`);

        // window.console.log(`this.width: ${this.width}`);

        if (this.galleryRow && this.width) {
            const h = this.getHeight();

            for (const gallery of this.galleryRow) {
                let scale = 1;
                if (gallery.thumbnail_height > 0) {
                    scale = h / gallery.thumbnail_height;
                }

                gallery.display_height = gallery.thumbnail_height * scale;
                gallery.display_width = gallery.thumbnail_width * scale;
            }

            this.galleryItems = this.galleryRow as Gallery[];
        }
    }

    protected mounted() {
        this.renderGalleryItems();
    }

    private getHeight(): number {

        // window.console.log(`GalleryRow.getHeight()`);

        if (!this.galleryRow || !this.width) {
            return GalleryRow.DEFAULT_HEIGHT;
        }

        let sum = 0;
        for (const gallery of this.galleryRow) {
            if (gallery.thumbnail_height > 0) {
                sum += (gallery.thumbnail_width / gallery.thumbnail_height);
            }
        }
        const value = this.width / sum;

        // window.console.log(`getHeight(): ${value}`);
        return Math.min(GalleryRow.MAX_HEIGHT, value);
    }

    private selectionChanged(galleryId: number, checked: boolean) {
        this.$emit('selectionChanged', galleryId, checked);
    }
}
</script>

<style scoped>

.gallery-row {
    overflow: hidden;
}
</style>
