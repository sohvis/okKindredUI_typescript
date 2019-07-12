import Vue from 'vue';
import Vuex from 'vuex';
import { configs } from '../config';
import * as request from 'request-promise-native';
import { localeMatch } from '../localization/localization';

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
    users_person_id: '0',

    error_message: '',
    debug_message: '',
  },

  getters: {
    language: (state) => {
        const locale = localeMatch.match(state.language);

        window.console.log(`store.language(state) locale: ${locale}`);
        return locale;
    },

    loading: (state) => state.loading_count > 0,

    ajaxHeader: (state) => {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.access_token}`,
        };
    },
  },

  mutations: {

    // Set when a component starts and finishes loading
    updateLoading: (state, newState) => {

        if (newState) {
            state.loading_count++;
        } else if (state.loading_count > 0) {
            state.loading_count--;
        }
    },

    login: (state, payload) => {
        state.access_token = payload.access_token;
        state.refresh_token = payload.refresh_token;
        state.language = payload.language;
        state.logged_in = true;
        state.person_id = payload.person_id;
        state.users_person_id = payload.person_id;
    },

    logout: (state) => {
        state.access_token = '';
        state.refresh_token = '';
        state.logged_in = false;
        state.person_id = '0';
        state.users_person_id = '0';
    },

    // Sets the person on which app is focused on
    changePerson: (state, newPersonId) => {
        state.person_id = newPersonId;
    },

    setErrorMessage: (state, message) => {

        const text = message.toString();
        window.console.log(`state.setErrorMessage() message: ${text}`);
        state.error_message = text;
    },

    setDebugMessage: (state, message) => {
        window.console.log(message);
        state.debug_message = message;
    },
  },
  actions: {

    changePerson: (context, payload) => {
        window.console.log(`changePerson called new person id: ${payload}`);

        context.commit('changePerson', payload);

        return new Promise((resolve) => {
            window.localStorage.setItem('person_id', payload);
            resolve();
        });
    },

    restoreSession: (context) => {
        window.console.log('restoreSession() called');

        context.commit('updateLoading', true);
        return new Promise((resolve) => {

            // Restore access toke from local storage
            context.dispatch('restoreState')
            .then(() => {

                if (!context.state.access_token) {
                    // No Access token
                    window.console.log('No Access token');
                    resolve(false);


                } else {
                    // Access token found, verify it
                    window.console.log(`Access token found: ${context.state.access_token}`);
                    context.dispatch('verifyToken')
                    .then((result) => {

                        resolve(result);
                    });
                }
            })

            .finally(() => {
                context.commit('updateLoading', false);
            });
        });
    },

    saveState(context) {
        window.console.log(`saving credentials as local storage, access token: ${context.state.access_token}`);
        window.console.log(context.state);

        return new Promise((resolve) => {
            window.localStorage.setItem('access_token', context.state.access_token);
            window.localStorage.setItem('refresh_token', context.state.refresh_token);
            window.localStorage.setItem('language', context.state.language);
            window.localStorage.setItem('person_id', context.state.person_id.toString());
            window.localStorage.setItem('users_person_id', context.state.users_person_id.toString());
            resolve();
        });
    },

    restoreState(context) {
        window.console.log('retrieving credentials from local storage');

        return new Promise((resolve) => {
            context.state.access_token = window.localStorage.getItem('access_token') || '';
            context.state.refresh_token = window.localStorage.getItem('refresh_token') || '';
            context.state.language = window.localStorage.getItem('language') || '';
            context.state.person_id = window.localStorage.getItem('person_id') || '0';
            context.state.users_person_id = window.localStorage.getItem('users_person_id') || '0';

            window.console.log(`access token: ${context.state.access_token}`);
            window.console.log(context.state);
            resolve();
        });
    },

    login(context, payload) {

        window.console.log('login() action called');
        context.commit('updateLoading', true);

        return new Promise(async (resolve, reject) => {

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
                context.dispatch('saveState').then(() => {
                    resolve();
                });

            } catch (error) {
                window.console.log(error);
                reject(error);
            }

            context.commit('updateLoading', false);
        });
    },

    logout(context) {
        window.console.log('logout() action called');

        context.commit('updateLoading', true);
        return new Promise((resolve) => {
            context.commit('logout');

            context.dispatch('saveState').then(() => {
                context.commit('updateLoading', false);
                resolve();
            });
        });
    },

    verifyToken(context) {
        window.console.log(`verifyToken() Called`);
        context.commit('updateLoading', true);

        return new Promise(async (resolve) => {

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

                resolve(true);
            } catch (error) {
                window.console.log(`Token Verification Failed ${error}`);

                // Verify token fails, so refresh it
                context.dispatch('refreshToken')
                    .then(() => resolve(true))
                    .catch(() => resolve(false));
            }

            context.commit('updateLoading', false);

        });
    },

    refreshToken(context) {
        window.console.log(`refreshToken() Called`);
        context.commit('updateLoading', true);

        return new Promise(async (resolve, reject) => {

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

                context.dispatch('saveState').then(() => {
                    resolve();
                });

            } catch (error) {
                window.console.log(`Token Refresh Failed: ${error}`);
                reject();
            }

            context.commit('updateLoading', false);
        });
    },
  },
});
