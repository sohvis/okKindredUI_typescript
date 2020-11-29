<template>
    <b-modal 
        ref="whoIsThisModal"
        hide-footer
        hide-header 
        centered
        button-size="lg">
        <div>
            <div v-bind:style="cropDiv" class="crop-div">
                <img v-bind:style="cropImg" :src="thumbnail">
            </div>
            <p>{{ $t('message.WhoIsThis') }}</p>
        </div>
        <div class="input-group">
            <div class="input-group-prepend">
                 <h2>
                    <span class="oi oi-magnifying-glass search-prepend" aria-hidden="true"></span>
                </h2>
            </div>
            <input id="tag-search-box"
                type="text" 
                class="form-control" 
                :placeholder="$t('message.Search')" 
                :aria-label="$t('message.Search')" 
                v-model="searchValue" 
                @input="evt=>searchValue=evt.target.value"
                autocomplete="off">
        </div>

        <div class="text-center spinner-container" v-show="loadingResults">
            <b-spinner></b-spinner>
        </div>

        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <tbody>
                    <tr v-for="person of people" :key="person.id" @click="selectPerson(person)">
                        <td class="search-thumb-col">
                            <img class="search-thumb" :src="person.small_thumbnail" />
                        </td>
                        <td>
                            {{ person.name }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <Loading v-show="loading" :zIndex="1051"/>

    </b-modal>
</template>

<script lang="ts">
import { Component, Vue, Watch} from 'vue-property-decorator';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import APIException from '@/models/data/api_exception';
import Person from '../../models/data/person';
import Image from '../../models/data/image';
import store from '../../store/store';
import config from '../../config';
import { BModal } from 'bootstrap-vue';
import Loading from '../common/Loading.vue';
import Tag from '../../models/data/tag';

@Component({
  components: {
      Loading,
  },
})
export default class WhoIsThis extends Vue {

    public searchValue: string = '';

    public people: Person[] = [];

    public loadingResults: boolean = false;

    public x1: number = 0;

    public x2: number = 0;

    public y1: number = 0;

    public y2: number = 0;

    public image: Image | null = null;

    public get thumbnail(): string {
        if (this.image) {
            return this.image.large_thumbnail;
        }

        return '';
    }

    public cropDiv = {};

    public cropImg = {};

    private timeOutHandle: any;

    private loading: boolean = false;

    public async show(x1: number, x2: number, y1: number, y2: number, image: Image) {
        window.console.log('WhoIsThis.show()');

        this.searchValue = '';
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
        this.image = image;

        const width = (x2 - x1) * image.large_thumbnail_width;
        const height = (y2 - y1) * image.large_thumbnail_height;

        this.cropDiv = {
            width: `${width}px`,
            height: `${height}px`,
        };

        this.cropImg = {
            'margin-left': `-${x1 * image.large_thumbnail_width}px`,
            'margin-top': `-${y1 * image.large_thumbnail_height}px`,
        };

        this.$nextTick(() => {
            (this.$refs.whoIsThisModal as any).show();

            this.$nextTick(() => {
                const textbox = document.getElementById('tag-search-box') as HTMLInputElement;
                if (textbox) {
                    setTimeout(() => {
                        textbox.focus();
                        textbox.select();
                    }, 100);
                }
            });
        });
    }

    protected async mounted() {
        // window.console.log('WhoIsThis.vue mounted() call');
    }

    @Watch('searchValue')
    private async onChange() {
        // window.console.log('WhoIsThis.vue onChange() call');

        if (this.timeOutHandle) {
            window.clearTimeout(this.timeOutHandle);
        }

        this.loadingResults = true;

        this.timeOutHandle = setTimeout(async () => {
            await this.search();
        }, 400);
    }

    private async search() {
        // window.console.log('Search.vue search() call');

        try {

            if (!store.state.people || store.state.people.length === 0) {
                await store.dispatch('loadTreeData');
            }

            if (this.searchValue && this.searchValue.length > 0) {
                const result = store.state.people.filter((p) =>
                    p.name.toLocaleLowerCase().indexOf(this.searchValue.toLocaleLowerCase()) > -1,
                );

                // window.console.log(result);

                for (const person of result) {
                    if (!person.small_thumbnail) {
                        person.small_thumbnail = 'img/portrait_80.png';
                    }
                }

                this.people = result;

            } else {
                this.people = [];
            }

        } catch (ex) {
            const axiosError = ex as AxiosError<APIException>;
            store.commit('setErrorMessage', axiosError?.response?.data?.detail || ex.toString());
        }

        this.loadingResults = false;
    }

    private async selectPerson(person: Person) {

        if (this.image) {
            this.loading = true;

            try {
                const options: AxiosRequestConfig = {
                    url: `${config.BaseApiUrl}${config.ImageTaggingAPI}`,
                    headers: store.getters.ajaxHeader,
                    data: {
                        x1: this.x1,
                        x2: this.x2,
                        y1: this.y1,
                        y2: this.y2,
                        image_id: this.image.id,
                        person_id: person.id,
                    },
                    method: 'POST',
                    responseType: 'json',
                };

                const response = await axios.request(options) as AxiosResponse<Tag>;
                this.$emit('tagCreated', response.data);

                (this.$refs.whoIsThisModal as BModal).hide();

            } finally {
                this.loading = false;
            }
        }
    }

}
</script>

<style scoped>
.crop-div {
    overflow: hidden;
}

.search-thumb {
    height: 60px;
}

.search-thumb-col {
    width: 80px !important;
}

.table > tbody > tr > td {
    vertical-align: middle;
    cursor: pointer;
}

.spinner-container {
    margin-top: 10px;
}

.search-prepend {
    margin-top: 5px;
    margin-right: 5px;
}

#tag-search-box {
    border-radius: 20px;
}
</style>
