import Person from '../models/data/person';
import Relation from '../models/data/relation';
import Gallery from '../models/data/gallery';
import IState from './IState';


const state: IState = {
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
    currentGallery: null,
};

export default state;
