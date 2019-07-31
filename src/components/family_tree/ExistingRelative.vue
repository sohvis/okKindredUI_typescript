<template>
    <div class="container">
        <b-form-input 
                id="search-box"
                size="sm"
                v-model="searchValue"
                :placeholder='$t("message.Search")'
                @input="onChange">
        </b-form-input>

        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <tbody>
                    <tr v-for="person of peopleResults" :key="person.id" @click="selectPerson(person)">
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

    public async submit() {
        window.console.log(`ExitingRelative.submit()`);

        try {
            const selectedPersonId = store.state.person_id;

            const options = {
                uri: `${configs.BaseApiUrl}${configs.PersonAPI}`,
                headers: store.getters.ajaxHeader,
                body: {
                    from_person_id: selectedPersonId,
                    to_person_id: 'todo',
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
        this.relationPredictor = new RelationPredictor(store.state.people, store.state.relations);
        this.peopleResults = this.relationPredictor.getRelationshipSuggestions(this.relationType || 1);
    }

    private onChange() {
        const textbox = document.getElementById('search-box') as HTMLInputElement;

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
    }

    private async selectPerson(person: Person) {
        window.console.log(`ExistingRelative.selectPerson() person.name: ${person.name}`);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
