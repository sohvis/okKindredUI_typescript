<template>
    <b-modal 
        ref="deleteTagsModal"
        centered
        button-size="lg"
        :ok-title="$t('message.Close')"
        :title="$t('message.DeleteTags')"
        ok-only>
        <div class="container">
            <TagToDelete 
                v-for="tag of tags" 
                :key="tag.id" 
                :tag="tag"
                :image="image"
                @tagDeleted="tagDeleted"/>
        </div>
        <Loading v-show="loading" :zIndex="1051"/>

    </b-modal>
</template>

<script lang="ts">
import { Component, Vue, Watch} from 'vue-property-decorator';
import * as request from 'request-promise-native';
import store from '../../store/store';
import config from '../../config';
import { BModal } from 'bootstrap-vue';
import Loading from '../common/Loading.vue';
import Tag from '../../models/data/tag';
import Image from '../../models/data/image';
import TagToDelete from './TagToDelete.vue';

@Component({
  components: {
      Loading,
      TagToDelete,
  },
})
export default class DeleteTags extends Vue {

    public tags: Tag[] = [];

    public image: Image | null = null;

    private loading: boolean = false;

    public async show(tags: Tag[], image: Image) {
        window.console.log('DeleteTags.show()');

        this.tags = tags;
        this.image = image;

        this.$nextTick(() => {
            (this.$refs.deleteTagsModal as BModal).show();
        });
    }

    protected async mounted() {
        window.console.log('DeleteTags.vue mounted() call');
    }

    private tagDeleted(tagId: number) {
        this.tags = this.tags.filter((t) => t.id !== tagId);
        this.$emit('tagDeleted', tagId);
    }
}
</script>

<style scoped>

</style>
