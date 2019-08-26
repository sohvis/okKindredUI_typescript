<template>

    <div class="image-thumb-container"
        @click="click">

        <img :src="image.thumbnail" 
            :width="image.display_width"
            :height="image.display_height"/>

        <CheckBox ref="checkBox" 
            v-if="editMode" 
            class="top-left"
            @checkboxChanged="checkboxChanged"/>
    </div>

</template>

<script lang="ts">
import { Component, Vue, Watch, Prop} from 'vue-property-decorator';
import config from '../../config';
import Image from '../../models/data/image';
import CheckBox from '../../components/common/CheckBox.vue';

@Component({
  components: {
      CheckBox,
  },
})
export default class ImageItem extends Vue {

    @Prop({ default:{} })
    public image?: Image;

    @Prop({ default: false })
    public editMode?: boolean;

    private checkboxChanged(checked: boolean) {
        if (this.image) {
            this.$emit('selectionChanged', this.image.id, checked);
        }
    }

    private click() {
        if (this.image) {
            if (this.editMode) {
                (this.$refs.checkBox as CheckBox).toggle();
            }
        }
    }
}

</script>

<style scoped>

.image-thumb-container {
    position: relative;
    float: left;
    cursor: pointer;
}

.image-thumb-container :hover {
    opacity: 0.5;
}

.top-left {
    position: absolute;
    top: 5px;
    left: 5px;
}
</style>
