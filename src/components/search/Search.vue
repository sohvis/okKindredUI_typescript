<template>
    <b-modal ref="searchModal"
        hide-footer
        hide-header 
        button-size="lg">

        <div class="input-group">
            <div class="input-group-prepend">
                 <h2>
                    <span class="oi oi-magnifying-glass search-prepend" aria-hidden="true"></span>
                </h2>
            </div>
            <input id="search-box"
                type="text" 
                class="form-control" 
                :placeholder="$t('message.Search')" 
                :aria-label="$t('message.Search')" 
                aria-describedby="basic-addon1"
                v-model="searchValue" 
                @input="evt=>searchValue=evt.target.value"
                autocomplete="off">
        </div>

        <div class="text-center spinner-container" v-show="loadingResults">
            <b-spinner></b-spinner>
        </div>

        <div v-if="people.length > 0" class="table-responsive">
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

    </b-modal>
</template>

<script lang="ts">
import { Component, Vue, Watch} from 'vue-property-decorator';
import Person from '../../models/data/person';
import store from '../../store/store';
import { configs } from '../../config';
import { BModal } from 'bootstrap-vue';

@Component({
  components: {
  },
})
export default class Search extends Vue {

    public searchValue: string = '';

    public people: Person[] = [];

    public loadingResults: boolean = false;

    private timeOutHandle: any;

    public async show() {

        this.searchValue = '';
        (this.$refs.searchModal as BModal).show();

        this.$nextTick(() => {
            const textbox = document.getElementById('search-box') as HTMLInputElement;
            if (textbox) {
                setTimeout(() => {
                    textbox.focus();
                    textbox.select();
                }, 100);
            }
        });
    }

    protected async mounted() {
        // window.console.log('Search.vue mounted() call');
    }

    @Watch('searchValue')
    private async searchValueChanged() {
        // window.console.log('Search.onInput(evt)');

        if (this.timeOutHandle) {
            window.clearTimeout(this.timeOutHandle);
        }

        this.loadingResults = true;

        this.timeOutHandle = setTimeout(async () => {
            await this.search();
        }, 200);
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
            store.commit('setErrorMessage', ex);
        }

        this.loadingResults = false;
    }

    private selectPerson(person: Person) {
        store.dispatch('changePerson', person.id);

        if (this.$router.currentRoute.path.includes('/family/')) {
            store.dispatch('changePerson', person.id);
        } else {
            this.$router.push(`/family/tree/${person.id}/`);
        }

        (this.$refs.searchModal as BModal).hide();
    }

}
</script>

<style scoped>
#search-box {
    border-radius: 20px;
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
</style>
