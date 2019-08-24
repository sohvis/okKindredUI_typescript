import Vue from 'vue';
import Vuex from 'vuex';
import { configs } from '../config';
import * as request from 'request-promise-native';
import { localeMatch } from '../localization/localization';
import { i18n } from '../main';
import Person from '../models/data/person';
import Relation from '../models/data/relation';

Vue.use(Vuex);


export default new Vuex.Store({

  state: {
    logged_in: false,

    // JWT tokens
    access_token: '',
    refresh_token: '',

    language: '',

    // Multiple components can signal loading and finished loading
    loading_count: 0,

    // The person that the app should be focused on.  On login it should be the user's person id
    person_id: '0',
    users_person_id: '',

    error_message: '',
    debug_message: '',

    people: new Array<Person>(),
    relations: new Array<Relation>(),

  },

  getters: {
    language: (state): string => {
        const locale = localeMatch.match(state.language);

        window.console.log(`store.language(state) locale: ${locale}`);
        return locale;
    },

    loading: (state): boolean => state.loading_count > 0,

    ajaxHeader: (state) => {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.access_token}`,
        };
    },

    selectedPerson: (state): Person | null => {

        for (const person of state.people) {
            if (Number(state.person_id) === Number(person.id)) {
                return person;
            }
        }

        return null;
    },
  },

  mutations: {

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
        state.users_person_id = payload.person_id;

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
            if (state.people[i].id === person.id) {
                state.people[i] = person;
            }
        }
    },
  },

  actions: {
    changeLanguage(context, payload) {
        window.console.log(`changeLanguage called new language: ${payload}`);

        context.commit('changeLanguage', payload);
        window.localStorage.setItem('language', payload);
    },

    async changePerson(context, payload) {
        window.console.log(`changePerson called new person id: ${payload}`);
        context.commit('changePerson', payload);

        // Make sure local storage is done asynchronously
        await null;
        window.localStorage.setItem('person_id', payload);
    },

    async restoreSession(context) {
        window.console.log('restoreSession() called');

        context.commit('updateLoading', true);

        // Restore access toke from local storage
        context.dispatch('restoreState');

        if (!context.state.access_token) {
            // No Access token
            window.console.log('No Access token');
            context.commit('updateLoading', false);
            throw new Error('No Access token');


        } else {
            // Access token found, verify it
            window.console.log(`Access token found: ${context.state.access_token}`);

            try {
                await context.dispatch('verifyToken');
            } catch {
                throw new Error('Token verification failed');
            }

        }


        context.commit('updateLoading', false);
    },

    async saveState(context) {
        window.console.log(`saving credentials as local storage, access token: ${context.state.access_token}`);
        window.console.log(context.state);

        // Make sure local storage is done asynchronously
        await null;
        window.localStorage.setItem('access_token', context.state.access_token);
        window.localStorage.setItem('refresh_token', context.state.refresh_token);
        window.localStorage.setItem('language', context.state.language);
        window.localStorage.setItem('person_id', context.state.person_id.toString());
        window.localStorage.setItem('users_person_id', context.state.users_person_id);
    },

    restoreState(context) {
        window.console.log('retrieving credentials from local storage');
        context.state.access_token = window.localStorage.getItem('access_token') || '';
        context.state.refresh_token = window.localStorage.getItem('refresh_token') || '';
        context.state.language = window.localStorage.getItem('language') || '';
        context.state.person_id = window.localStorage.getItem('person_id') || '0';
        context.state.users_person_id = window.localStorage.getItem('users_person_id') || '0';

        window.console.log(`access token: ${context.state.access_token}`);
        window.console.log(context.state);

        if (i18n.locale !== context.state.language) {
            i18n.locale = context.state.language;
        }
    },

    async login(context, payload) {

        window.console.log('login() action called');
        context.commit('updateLoading', true);

        const options = {
            uri: `${configs.BaseApiUrl}${configs.ObtainTokenAPI}`,
            body: {
                email: payload.email,
                password: payload.password,
            },
            json: true,
        };

        try {
            const response = await request.post(options);
            window.console.log(`login response:`);
            window.console.log(response);

            // Save access tokens in state
            context.commit('login', {
                access_token: response.access,
                refresh_token: response.refresh,
                language: response.language,
                person_id: response.person_id,
            });

            // Save access tokens in session
            context.dispatch('saveState');

        } catch (error) {
            window.console.log(error);
            throw error;

        } finally {
            context.commit('updateLoading', false);
        }
    },

    async logout(context) {
        window.console.log('logout() action called');

        context.commit('updateLoading', true);
        context.commit('logout');
        await context.dispatch('saveState');
        context.commit('updateLoading', false);
    },

    async verifyToken(context) {
        window.console.log(`verifyToken() Called`);
        context.commit('updateLoading', true);

        const options = {
            uri: `${configs.BaseApiUrl}${configs.VerifyTokenAPI}`,
            body: {
                token: context.state.access_token,
            },
            json: true,
        };

        try {
            const response = await request.post(options);
            window.console.log(response);
            window.console.log(`Token Verified`);
            context.commit('login', {
                access_token: context.state.access_token,
                refresh_token: context.state.refresh_token,
                language: context.state.language,
                person_id: context.state.person_id,
            });

        } catch (error) {
            window.console.log(`Token Verification Failed ${error}, attempting refresh`);


            // Verify token fails, so refresh it
            try {
                await context.dispatch('refreshToken');
            } catch (refreshError) {
                throw refreshError;
            }

        } finally {
            context.commit('updateLoading', false);
        }
    },

    async refreshToken(context) {
        window.console.log(`refreshToken() Called`);
        context.commit('updateLoading', true);

        const options = {
            uri: `${configs.BaseApiUrl}${configs.RefreshTokenAPI}`,
            body: {
                refresh: context.state.refresh_token,
            },
            json: true,
        };

        try {
            const response = await request.post(options);
            window.console.log(response);

            window.console.log(`Token Refreshed: ${response.access}`);

            context.commit('login', {
                access_token: response.access,
                refresh_token: context.state.refresh_token,
                language: context.state.language,
                person_id: context.state.person_id,
            });

            context.dispatch('saveState');

        } catch (error) {
            throw error;
        } finally {
            context.commit('updateLoading', false);
        }
    },

    async loadTreeData(context) {
        window.console.log(`loadTreeData() Called`);
        context.commit('updateLoading', true);

        const optionsPerson = {
            uri: `${configs.BaseApiUrl}${configs.PersonAPI}`,
            headers: context.getters.ajaxHeader,
            json: true,
        };

        const optionsRelation = {
            uri: `${configs.BaseApiUrl}${configs.RelationAPI}`,
            headers: context.getters.ajaxHeader,
            json: true,
        };

        try {
            const personTask = request.get(optionsPerson);
            const relationTask = request.get(optionsRelation);

            const people = (await personTask) as Person[];
            const relations = (await relationTask) as Relation[];

            context.commit('setPeople', people);
            context.commit('setRelations', relations);

        } catch (error) {
            window.console.log(`: ${error}`);
            context.commit('setErrorMessage', error);
        }

        context.commit('updateLoading', false);
    },

    async removePerson(context, personId: string) {

        const personIdNum = Number(personId);

        const getNextPersonId = (relsToRemove: Relation[], pId: number): number => {

            // Change selected person to closest relative, default to user id if not possible
            const selectedPersonId = context.state.users_person_id;


            for (const rel of relsToRemove) {
              if (context.state.people
                  .filter((p) => Number(p.id) === rel.from_person_id && pId !== rel.from_person_id)
                  .length) {
                      return Number(rel.from_person_id);
                  }

              if (context.state.people
                  .filter((p) => Number(p.id) === rel.to_person_id  && pId !== rel.to_person_id)
                  .length) {
                      return Number(rel.to_person_id);
                  }
            }

            return Number(selectedPersonId);
        };

        // Remove associated relations
        const relationsToRemove = new Array<Relation>();
        for (const rel of context.state.relations) {
            if (rel.from_person_id === personIdNum || rel.to_person_id === personIdNum) {
            relationsToRemove.push(rel);
            }
        }

        const newSelectedPerson = getNextPersonId(relationsToRemove, personIdNum);
        context.dispatch('changePerson', newSelectedPerson.toString());

        const person = context.state.people.filter((p) => p.id.toString() === personId.toString());
        context.commit('removeRelations', relationsToRemove);
        context.commit('removePeople', person);
    },

    removeRelations(context, relations: Relation[]) {
        context.commit('removeRelations', relations);
    },

    addPeople(context, people: Person[]) {
        context.commit('addPeople', people);
    },

    addRelations(context, relations: Relation[]) {
        context.commit('addRelations', relations);
    },

    updatePerson(context, person: Person) {
        context.commit('updatePerson', person);
    },
  },
});
