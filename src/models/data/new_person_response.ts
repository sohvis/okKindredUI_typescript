import Person from './person';
import Relation from './relation';

export default interface NewPersonResponse {
    person: Person;
    relation: Relation;
}
