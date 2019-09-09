import { GetterTree } from 'vuex';
import IState from './IState';
import Person from '../models/data/person';
import { localeMatch } from '../localization/localization';

const getters: GetterTree<IState, IState> = {
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
        window.console.log(`store.selectedPerson(state)`);
        window.console.log(`state.person_id: ${state.person_id}`);
        for (const person of state.people) {
            if (Number(state.person_id) === Number(person.id)) {
                return person;
            }
        }

        return null;
    },
};

export default getters;
