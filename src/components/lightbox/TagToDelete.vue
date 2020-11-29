<template>
    <div class="row tag-row">
        <div class="col-xs-auto">
            <b-button variant="danger"
                :title="$t('message.Delete')" 
                @click="click">
                <span class="oi oi-trash" aria-hidden="true"></span>
            </b-button>
        </div>
        <div class="col">
            <div class="tag-name">{{ tag.person_name }}</div>
        </div>
        <div class="col-xs-auto">
            <b-spinner class="password-spinner" small v-show="saving"></b-spinner>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop} from 'vue-property-decorator';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import APIException from '@/models/data/api_exception';
import store from '../../store/store';
import config from '../../config';
import { BModal } from 'bootstrap-vue';
import Loading from '../common/Loading.vue';
import Tag from '../../models/data/tag';
import Image from '../../models/data/image';

@Component({
  components: {
      Loading,
  },
})
export default class TagToDelete extends Vue {

    @Prop({ default: null })
    public tag?: Tag | null;

    public saving: boolean = false;

    protected async mounted() {
        // window.console.log('DeleteTags.vue mounted() call');
    }

     private async click() {
        if (this.tag) {
            try {
                this.saving = true;
                const tagId = this.tag.id;

                const options: AxiosRequestConfig = {
                    url: `${config.BaseApiUrl}${config.ImageTaggingAPI}${tagId}/`,
                    headers: store.getters.ajaxHeader,
                    method: 'DELETE',
                    responseType: 'json',
                };

                await axios.request(options);
                this.$emit('tagDeleted', tagId);

            } finally {
                this.saving = false;
            }
        }
    }
}
</script>

<style scoped>
.crop-div {
    overflow: hidden;
}

.tag-row {
    padding-top: 8px;
    padding-bottom: 8px;
    border-bottom: 1px;
    border-top: 0px;
    border-left: 0px;
    border-right: 0px;
    border-style: solid;
    border-color: #eee;
}

.tag-name {
    padding-top: 4px;
    padding-right: 5px;
}
</style>
