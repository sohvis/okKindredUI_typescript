<template>
    <div class="container">
        <b-form-input 
                id="search-box"
                size="sm"
                v-model="searchValue"
                :placeholder='$t("message.Search")'
                @input="onChange">
        </b-form-input>

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
import { Component, Vue, Prop } from 'vue-property-decorator';
import * as request from 'request-promise-native';
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
        window.console.log(`ExitingRelative.submit()`);

        if (!this.selectedPerson) {
            this.$emit('onError');
            return;
        }

        try {
            const fromPersonId = Number(store.state.person_id);

            const options = {
                uri: `${configs.BaseApiUrl}${configs.RelationAPI}`,
                headers: store.getters.ajaxHeader,
                body: {
                    from_person_id: fromPersonId,
                    to_person_id: Number(this.selectedPerson.id),
                    relation_type: this.relationType,
                },
                json: true,
            };

            const relation = await request.post(options) as Relation;

            store.dispatch('addRelations', [relation]);

            this.$emit('relationCreated');

        } catch (ex) {
                window.console.log(ex);
                this.$emit('onError', ex);
        }

    }

    protected mounted() {
        window.console.log(`ExistingRelative.mounted()`);
        this.predictRelations();
        this.selectedPerson = null;
    }

    private onChange() {
        const textbox = document.getElementById('search-box') as HTMLInputElement;

        this.selectedPerson = null;

        if (textbox.value.length > 0) {
            const result = store.state.people.filter((p) =>
                p.name.toLocaleLowerCase().indexOf(textbox.value.toLocaleLowerCase()) > -1,
            );

            window.console.log(result);

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
        window.console.log(`ExistingRelative.selectPerson() person.name: ${person.name}`);
        this.selectedPerson = person;
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
