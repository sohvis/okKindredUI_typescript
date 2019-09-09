import Person from '../models/data/person';
import Relation from '../models/data/relation';
import Gallery from '../models/data/gallery';

interface IState {
    logged_in: boolean;
    access_token: string;
    refresh_token: string;
    language: string;
    loading_count: number;
    person_id: string;
    users_person_id: string;
    error_message: string;
    debug_message: string;
    people: Person[];
    relations: Relation[];
    currentGallery: Gallery | null;
}

export default IState;

