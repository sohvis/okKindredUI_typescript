import Person from '../data/person';
import Relation from '../data/relation';
import RelationTypes from '../data/relation_types';

export default class RelationPrediction {

    public fromPerson: Person;
    public toPerson: Person;
    public relationType: number;

    constructor(fromPerson: Person, toPerson: Person, relationType: number) {
        this.fromPerson = fromPerson;
        this.toPerson = toPerson;
        this.relationType = relationType;
    }
}
