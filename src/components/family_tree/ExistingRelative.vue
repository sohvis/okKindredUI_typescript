<template>
    <div class="container">
        <input id="relative-search-box"
            type="text" 
            class="form-control" 
            :placeholder="$t('message.Search')" 
            :aria-label="$t('message.Search')" 
            v-model="searchValue" 
            @input="evt=>searchValue=evt.target.value"
            autocomplete="off">
        <b-list-group>
            <b-list-group-item v-for="person of peopleResults" 
                    :key="person.id" 
                    @click="selectPerson(person)"
                    :active="person === selectedPerson">
                <img class="search-thumb" :src="person.small_thumbnail" />
                {{ person.name }}
            </b-list-group-item>
        </b-list-group>

    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import APIException from '@/models/data/api_exception';
import store from '../../store/store';
import { configs } from '../../config';
import Relation from '../../models/data/relation';
import Person from '../../models/data/person';
import RelationPredictor from '../../models/relation_predicter/relation_predictor';


@Component
export default class ExistingRelative extends Vue {

    @Prop({default: 1})
    public relationType?: number;

    public relationPredictor?: RelationPredictor;

    public searchValue: string = '';

    public peopleResults: Person[] = [];

    public selectedPerson: Person | null = null;

    public async submit() {
        // window.console.log(`ExitingRelative.submit()`);

        if (!this.selectedPerson) {
            this.$emit('onError');
            return;
        }

        try {
            const fromPersonId = Number(store.state.person_id);

            const options: AxiosRequestConfig = {
                url: `${configs.BaseApiUrl}${configs.RelationAPI}`,
                headers: store.getters.ajaxHeader,
                data: {
                    from_person_id: fromPersonId,
                    to_person_id: Number(this.selectedPerson.id),
                    relation_type: this.relationType,
                },
                responseType: 'json',
                method: 'POST',
            };

            const response = await axios.request(options) as AxiosResponse<Relation>;

            store.dispatch('addRelations', [response.data]);

            this.$emit('relationCreated');

        } catch (ex) {
            const axiosError = ex as AxiosError<APIException>;
            this.$emit('onError', axiosError?.response?.data?.detail);
        }

    }

    protected mounted() {
        // window.console.log(`ExistingRelative.mounted()`);
        this.predictRelations();
        this.selectedPerson = null;
    }

    @Watch('searchValue')
    private onChange() {
        this.selectedPerson = null;

        if (this.searchValue.length > 0) {
            const result = store.state.people.filter((p) =>
                p.name.toLocaleLowerCase().indexOf(this.searchValue.toLocaleLowerCase()) > -1,
            );

            // window.console.log(result);

            for (const person of result) {
                if (!person.small_thumbnail) {
                    person.small_thumbnail = 'img/portrait_80.png';
                }
            }

            this.peopleResults = result;

        } else {
            this.predictRelations();
        }
    }

    private predictRelations() {
        const people = store.state.people;
        const relations = store.state.relations;
        const selectedPersonId = store.state.person_id;
        this.relationPredictor = new RelationPredictor(people, relations, selectedPersonId);
        this.peopleResults = this.relationPredictor.getRelationshipSuggestions(this.relationType || 1);
    }

    private async selectPerson(person: Person) {
        // window.console.log(`ExistingRelative.selectPerson() person.name: ${person.name}`);
        this.selectedPerson = person;
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
