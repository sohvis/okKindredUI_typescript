import Vue from 'vue';
import Vuex from 'vuex';
import IState from './IState';
import State from './state';
import Getters from './getters';
import Mutations from './mutations';
import Actions from './actions';

Vue.use(Vuex);

export default new Vuex.Store<IState>({
    state: State,
    getters: Getters,
    mutations: Mutations,
    actions: Actions,
});
