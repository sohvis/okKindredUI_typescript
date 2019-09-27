import Vue from 'vue';
import { MutationTree } from 'vuex';
import IState from './IState';
import { i18n } from '../main';
import Person from '../models/data/person';
import Relation from '../models/data/relation';
import Gallery from '../models/data/gallery';

const mutations: MutationTree<IState> = {
    // Set when a component starts and finishes loading
    updateLoading(state, newState) {

        if (newState) {
            state.loading_count++;
        } else if (state.loading_count > 0) {
            state.loading_count--;
        }
    },

    login(state, payload) {
        state.access_token = payload.access_token;
        state.refresh_token = payload.refresh_token;
        state.language = payload.language;
        state.logged_in = true;
        state.person_id = payload.person_id;
        state.users_person_id = payload.users_person_id;

        if (i18n.locale !== state.language) {
            i18n.locale = state.language;
        }
    },

    logout(state) {
        state.access_token = '';
        state.refresh_token = '';
        state.logged_in = false;
        state.person_id = '0';
        state.users_person_id = '0';

        // Clear data
        state.people = [];
        state.relations = [];
    },

    changeLanguage(state, newLanguage: string) {
        state.language = newLanguage;

        // Cause language switch in UI
        if (i18n.locale !== newLanguage) {
            i18n.locale = newLanguage;
        }
    },

    // Sets the person on which app is focused on
    changePerson(state, newPersonId: string) {
        state.person_id = newPersonId;
    },

    setErrorMessage(state, message) {

        let text = message.toString();
        if (text.length > 500) {
            text = text.substring(0, 500);
        }

        window.console.log(`state.setErrorMessage() message: ${text}`);
        state.error_message = text;
    },

    setDebugMessage(state, message: string) {
        window.console.log(message);
        state.debug_message = message;
    },

    setPeople(state, people: Person[]) {
        state.people = people;
    },

    setRelations(state, relations: Relation[]) {
        state.relations = relations;
    },

    addPeople(state, people: Person[]) {

        state.people = [...state.people, ...people];
    },

    removePeople(state, people: Person[]) {
        state.people = state.people.filter((p) => people.indexOf(p) < 0);
    },

    addRelations(state, relations: Relation[]) {
        state.relations = [...state.relations, ...relations];
    },

    removeRelations(state, relations: Relation[]) {
        state.relations = state.relations.filter((r) => relations.indexOf(r) < 0);
    },

    updatePerson(state, person: Person) {
        for (let i = 0; i < state.people.length; i++) {
            if (Number(state.people[i].id) === Number(person.id)) {

                // https://stackoverflow.com/questions/40860592/vuex-getter-not-updating
                Vue.set(state.people, i, person);
            }
        }
    },

    changeCurrentGallery(state, newGallery: Gallery) {
        state.currentGallery = newGallery;
    },
};

export default mutations;
