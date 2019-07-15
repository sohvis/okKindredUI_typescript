<template>
    <div class="container">
        <h2>{{ $t('message.SearchName') }}</h2>
        <b-form-input 
                id="search-box"
                size="sm"
                v-model="searchValue"
                :placeholder='$t("message.Search")'
                @input="onChange">
        </b-form-input>

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

    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as request from 'request-promise-native';
import Person from './../models/data/person';
import store from '../store/store';
import { configs } from '../config';

@Component({
  components: {
  },
})
export default class Search extends Vue {

    public searchValue: string = '';

    public people: Person[] = [];

    private timeOutHandle: any;

    public loadingResults: boolean = false;

    protected mounted() {
        window.console.log('Searchbox.vue mounted() call');

        const textbox = document.getElementById('search-box') as HTMLInputElement;
        if (textbox) {
            setTimeout(() => {
                textbox.focus();
                textbox.select();
            }, 100);
        }
    }

    private async onChange() {
        window.console.log('Search.vue onChange() call');

        if (this.timeOutHandle) {
            window.clearTimeout(this.timeOutHandle);
        }

        this.loadingResults = true;

        this.timeOutHandle = setTimeout(async () => {
            await this.search();
        }, 1000);
    }

    private async search() {
        window.console.log('Search.vue search() call');

        try {
            const textbox = document.getElementById('search-box') as HTMLInputElement;
            const options = {
                uri: `${configs.BaseApiUrl}${configs.PersonAPI}?search=${this.searchValue}`,
                headers: store.getters.ajaxHeader,
                json: true,
            };

            const result = await request.get(options) as Person[];
            for (const person of result) {
                if (!person.small_thumbnail) {
                    person.small_thumbnail = 'img/portrait_80.png';
                }
            }

            this.people = result;
        } catch(ex) {
            store.commit('setErrorMessage', ex);
        }

        this.loadingResults = false;
    }

    private selectPerson(person: Person) {
        store.dispatch('changePerson', person.id).then(() => {
            this.$router.push('/family/');
        });
    }

}

</script>

<style scoped>
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
</style>
