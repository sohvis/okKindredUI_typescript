<template>

    <a href="#" class="image-thumb-container">
        <img :src="image.thumbnail" 
            :width="image.display_width"
            :height="image.display_height"/>
    </a>

</template>

<script lang="ts">
import { Component, Vue, Watch, Prop} from 'vue-property-decorator';
import config from '../../config';
import Image from '../../models/data/image';

@Component({
  components: {
  },
})
export default class ImageItem extends Vue {

    @Prop()
    public image?: Image;
}

</script>

<style scoped>

.image-thumb-container {
    position: relative;
    float: left;
}

.image-thumb-container :hover {
    opacity: 0.5;
}

</style>
