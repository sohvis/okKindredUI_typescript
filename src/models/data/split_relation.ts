import Relation from './relation';
import Person from './person';
import RelationTypes from './relation_types';

export default class SplitRelation {

    public static createSplitRelations(
                selectedPersonId: number,
                relations: Relation[],
                people: Person[]): SplitRelation[] {

        // Create a fast lookup
        const peopleById: { [id: string]: Person; } = {};
        for (const person of people) {
            peopleById[person.id] = person;
        }

        const result = new Array<SplitRelation>();
        for (const rel of relations) {
            if (rel.from_person_id === selectedPersonId
                  || rel.to_person_id === selectedPersonId) {

                const splitRelation = new SplitRelation(rel);
                splitRelation.setFromPerson(peopleById[rel.from_person_id]);
                splitRelation.setToPerson(peopleById[rel.to_person_id]);
                result.push(splitRelation);
            }
        }

        return result;
    }

    public id: string;
    public fromPersonId: string;
    public toPersonId: string;
    public relationType: number;
    public relationName: string;
    public fromPersonName: string = '';
    public toPersonName: string = '';
    public fromPersonImage: string = '';
    public toPersonImage: string = '';
    public relation: Relation;

    constructor(relation: Relation) {
        this.id = relation.id;
        this.fromPersonId = relation.from_person_id.toString();
        this.toPersonId = relation.to_person_id.toString();
        this.relationType = relation.relation_type;
        this.relationName = RelationTypes.NAMES[this.relationType];
        this.relation = relation;
    }

    public setFromPerson(person: Person) {
        this.fromPersonName = person.name;
        this.fromPersonImage = person.small_thumbnail;
        if (!this.fromPersonImage) {
            this.fromPersonImage = 'img/portrait_80.png';
        }
    }

    public setToPerson(person: Person) {
        this.toPersonName = person.name;
        this.toPersonImage = person.small_thumbnail;
        if (!this.toPersonImage) {
            this.toPersonImage = 'img/portrait_80.png';
        }
    }
}
