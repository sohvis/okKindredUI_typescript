<template>
    <b-modal 
        ref="whoIsThisFromSuggestedModal"
        hide-footer
        hide-header 
        centered
        button-size="lg"
        @hidden="onHidden">
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
            <input id="suggested-tag-search-box"
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
import * as request from 'request-promise-native';
import Person from '../../models/data/person';
import Image from '../../models/data/image';
import store from '../../store/store';
import config from '../../config';
import { BModal } from 'bootstrap-vue';
import Loading from '../common/Loading.vue';
import SuggestedTag from '../../models/data/suggested_tag';
import Tag from '../../models/data/tag';

@Component({
  components: {
      Loading,
  },
})
export default class WhoIsThisFromSuggested extends Vue {

    public suggestedTag?: SuggestedTag;

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

    public async show(suggestedTag: SuggestedTag, image: Image) {
        window.console.log('WhoIsThisFromSuggested.show()');

        this.suggestedTag = suggestedTag;
        this.searchValue = '';
        this.x1 = suggestedTag.x1;
        this.x2 = suggestedTag.x2;
        this.y1 = suggestedTag.y1;
        this.y2 = suggestedTag.y2;
        this.image = image;

        const width = (this.x2 - this.x1) * image.large_thumbnail_width;
        const height = (this.y2 - this.y1) * image.large_thumbnail_height;

        this.cropDiv = {
            width: `${width}px`,
            height: `${height}px`,
        };

        this.cropImg = {
            'margin-left': `-${this.x1 * image.large_thumbnail_width}px`,
            'margin-top': `-${this.y1 * image.large_thumbnail_height}px`,
        };

        await this.addSuggestedPeople();

        this.$nextTick(() => {
            (this.$refs.whoIsThisFromSuggestedModal as any).show();

            this.$nextTick(() => {
                const textbox = document.getElementById('suggested-tag-search-box') as HTMLInputElement;
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
        // window.console.log('WhoIsThisFromSuggested.vue mounted() call');
    }

    @Watch('searchValue')
    private async onChange() {
        // window.console.log('WhoIsThisFromSuggested.vue onChange() call');

        if (this.timeOutHandle) {
            window.clearTimeout(this.timeOutHandle);
        }

        this.loadingResults = true;

        this.timeOutHandle = setTimeout(async () => {
            await this.search();
        }, 400);
    }

    private async addSuggestedPeople() {
        window.console.log('WhoIsThisFromSuggested.addSuggestedPeople()');
        if (this.suggestedTag && this.suggestedTag.person_id) {

            if (!store.state.people || store.state.people.length === 0) {
                await store.dispatch('loadTreeData');
            }

            const suggestedPersonId = Number(this.suggestedTag.person_id);
            window.console.log(`suggestedPersonId: ${suggestedPersonId}`);

            const result = store.state.people.filter((p) => Number(p.id) === suggestedPersonId);

            for (const person of result) {
                if (!person.small_thumbnail) {
                    person.small_thumbnail = 'img/portrait_80.png';
                }
            }

            window.console.log(result);

            this.people = result;
        }
    }

    private async search() {
        // window.console.log('WhoIsThisFromSuggested.vue search() call');

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
                this.addSuggestedPeople();
            }

        } catch (ex) {
            store.commit('setErrorMessage', ex);
        }

        this.loadingResults = false;
    }

    private async selectPerson(person: Person) {

        if (this.image && this.suggestedTag) {
            this.loading = true;

            try {
                const options = {
                    uri: `${config.BaseApiUrl}${config.SuggestedTaggingAPI}${this.suggestedTag.id}/`,
                    headers: store.getters.ajaxHeader,
                    body: {
                        person_id: person.id,
                    },
                    json: true,
                };

                const newTag = await request.patch(options) as Tag;
                this.$emit('suggestedTagConverted', this.suggestedTag, newTag);

                (this.$refs.whoIsThisFromSuggestedModal as BModal).hide();

            } finally {
                this.loading = false;
            }
        }
    }

    private onHidden() {
        this.$emit('hidden');
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

#suggested-tag-search-box {
    border-radius: 20px;
}
</style>
