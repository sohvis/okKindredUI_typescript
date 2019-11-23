import { ActionTree, ActionContext } from 'vuex';
import * as request from 'request-promise-native';
import { configs } from '../config';
import IState from './IState';
import { i18n } from '../main';
import Person from '../models/data/person';
import Relation from '../models/data/relation';
import Gallery from '../models/data/gallery';
import router from '../router';

const actions: ActionTree<IState, IState> = {
    changeLanguage(context, payload) {
        // window.console.log(`changeLanguage called new language: ${payload}`);

        context.commit('changeLanguage', payload);
        window.localStorage.setItem('language', payload);
    },

    async changePerson(context, payload) {
        // window.console.log(`changePerson called new person id: ${payload}`);
        let personId = payload;

        // if people loaded into state, make sure person exists inloaded people
        if (context.state.people.length > 0) {
            personId = context.state.users_person_id;
            for (const person of context.state.people) {
                if (Number(person.id) === Number(payload)) {
                    personId = person.id;
                }
            }
        }

        context.commit('changePerson', personId);

        // Make sure local storage is done asynchronously
        await null;
        window.localStorage.setItem('person_id', personId);
    },

    async restoreSession(context) {
        // window.console.log('restoreSession() called');

        context.commit('updateLoading', true);

        // Restore access toke from local storage
        context.dispatch('restoreState');

        if (!context.state.access_token) {
            // No Access token
            // window.console.log('No Access token');
            context.commit('updateLoading', false);
            throw new Error('No Access token');


        } else {
            // Access token found, verify it
            // window.console.log(`Access token found: ${context.state.access_token}`);

            try {
                await context.dispatch('verifyToken');
            } catch {
                throw new Error('Token verification failed');
            }
        }

        context.commit('updateLoading', false);
    },

    async saveState(context) {
        // window.console.log(`saving credentials as local storage, access token: ${context.state.access_token}`);
        // window.console.log(context.state);

        // Make sure local storage is done asynchronously
        await null;
        window.localStorage.setItem('access_token', context.state.access_token);
        window.localStorage.setItem('refresh_token', context.state.refresh_token);
        window.localStorage.setItem('language', context.state.language);
        window.localStorage.setItem('person_id', context.state.person_id.toString());
        window.localStorage.setItem('users_person_id', context.state.users_person_id);
    },

    restoreState(context) {
        // window.console.log('retrieving credentials from local storage');
        context.state.access_token = window.localStorage.getItem('access_token') || '';
        context.state.refresh_token = window.localStorage.getItem('refresh_token') || '';
        context.state.language = window.localStorage.getItem('language') || '';
        context.state.person_id = window.localStorage.getItem('person_id') || '0';
        context.state.users_person_id = window.localStorage.getItem('users_person_id') || '0';

        // window.console.log(`access token: ${context.state.access_token}`);
        // window.console.log(context.state);

        if (i18n.locale !== context.state.language) {
            i18n.locale = context.state.language;
        }
    },

    async login(context, payload) {

        // window.console.log('login() action called');
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
            // window.console.log(`login response:`);
            // window.console.log(response);

            // Save access tokens in state
            context.commit('login', {
                access_token: response.access,
                refresh_token: response.refresh,
                language: response.language,
                person_id: response.person_id,
                users_person_id: response.person_id,
            });

            // Save access tokens in session
            context.dispatch('saveState');

        } catch (error) {
            // window.console.log(error);
            throw error;

        } finally {
            context.commit('updateLoading', false);
        }
    },

    async logout(context) {
        // window.console.log('logout() action called');

        context.commit('updateLoading', true);
        context.commit('logout');
        await context.dispatch('saveState');
        context.commit('updateLoading', false);
    },

    async verifyToken(context) {
        // window.console.log(`verifyToken() Called`);
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
            // window.console.log(response);
            // window.console.log(`Token Verified`);
            context.commit('login', {
                access_token: context.state.access_token,
                refresh_token: context.state.refresh_token,
                language: context.state.language,
                person_id: context.state.person_id,
                users_person_id: context.state.users_person_id,
            });

        } catch (error) {
            // window.console.log(`Token Verification Failed ${error}, attempting refresh`);


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
        // window.console.log(`refreshToken() Called`);
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
            // window.console.log(response);

            // window.console.log(`Token Refreshed: ${response.access}`);

            context.commit('login', {
                access_token: response.access,
                refresh_token: context.state.refresh_token,
                language: context.state.language,
                person_id: context.state.person_id,
                users_person_id: context.state.users_person_id,
            });

            context.dispatch('saveState');

        } catch (error) {
            // window.console.log(error);
            throw error;
        } finally {
            context.commit('updateLoading', false);
        }
    },

    async loadTreeData(context) {
        // window.console.log(`loadTreeData() Called`);
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

            // Ensure selected person id is in people
            context.commit('changePerson', context.state.person_id);

        } catch (error) {
            // window.console.log(`: ${error}`);
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
        // window.console.log(`updatePerson() action called person:`);
        // window.console.log(person);
        context.commit('updatePerson', person);
    },

    async loadCurrentGalleryInfo(context, galleryId: number) {
        // window.console.log(`loadGallery() Called`);

        if (!context.state.currentGallery || context.state.currentGallery.id !== galleryId) {
            context.commit('updateLoading', true);

            const options = {
                uri: `${configs.BaseApiUrl}${configs.GalleryAPI}${galleryId}/`,
                headers: context.getters.ajaxHeader,
                json: true,
            };

            try {
                const response = await request.get(options) as Gallery;

                context.commit('changeCurrentGallery', response);
            } catch (error) {
                throw error;
            } finally {
                context.commit('updateLoading', false);
            }
        }
    },

    updateCurrentGallery(context, gallery: Gallery) {
        context.commit('changeCurrentGallery', gallery);
    },

    setInitialRoute(context, route: string) {
        context.commit('setInitialRoute', route);
    },

    updateRouteLoaded(context) {
        const currentRoute = router.currentRoute.path;
        if (context.state.initialRoute.startsWith(currentRoute)) {
            context.commit('setInitialRoute', '');
        }
    },

    setFilesToUpload(context, files: File[]) {
        context.commit('setFilesToUpload', files);
    },

    setUserAgent(context, userAgent: string) {
        context.commit('setUserAgent', userAgent);
    },
};

export default actions;
