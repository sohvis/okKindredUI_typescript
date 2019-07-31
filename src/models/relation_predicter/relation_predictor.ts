import Person from '../data/person';
import Relation from '../data/relation';
import RelationTypes from '../data/relation_types';
import PersonAndRelationships from './person_and_relationships';
import store from '../../store/store';

export default class RelationPredictor {

    public personAndRelationshipById: { [id: string]: PersonAndRelationships; };

    public selectedPerson: PersonAndRelationships;

    constructor(people: Person[], relations: Relation[]) {
        this.personAndRelationshipById = {};

        for (const person of people) {
            this.personAndRelationshipById[person.id] = new PersonAndRelationships(person);
        }

        for (const relation of relations) {
            const fromPerson = this.personAndRelationshipById[relation.from_person_id];
            const toPerson = this.personAndRelationshipById[relation.to_person_id];

            if (relation.relation_type === RelationTypes.RAISED) {
                fromPerson.descendants.push(toPerson);
                toPerson.ancestors.push(fromPerson);

            } else { // Partnered
                fromPerson.partners.push(toPerson);
                toPerson.partners.push(fromPerson);
            }
        }

        const selectedPersonId = store.state.person_id;
        this.selectedPerson = this.personAndRelationshipById[selectedPersonId];
    }

    public getRelationshipSuggestions(relationType: number): Person[] {
        switch (relationType) {
            case RelationTypes.PARTNERED: {
               return this.getSuggestedPartners();
            }
            case RelationTypes.RAISED: {
                return this.getSuggestedDescendants();
            }
            case RelationTypes.RAISED_BY: {
                return this.getSuggestedAncestors();
            }
            default: {
                throw new Error(`Invalid relationType ${relationType}`);
            }
        }
    }

    // Look at ancestors of selected person's descendants
    public getSuggestedPartners(): Person[] {
        const suggestedPartners = new Array<Person>();

        for (const descendant of this.selectedPerson.descendants) {
            for (const ancestorOfDescendant of descendant.ancestors) {
                const id = ancestorOfDescendant.person.id;
                if (id !== this.selectedPerson.person.id
                        && !this.selectedPerson.partnersContain(id)) {
                    suggestedPartners.push(ancestorOfDescendant.person);
                }
            }
        }

        return suggestedPartners;
    }

    // Look at descendants of selected person's partners
    public getSuggestedDescendants(): Person[] {
        const suggestedDescendants = new Array<Person>();

        for (const partner of this.selectedPerson.partners) {
            for (const descendantOfPartner of partner.descendants) {
                const id = descendantOfPartner.person.id;
                if (id !== this.selectedPerson.person.id
                        && !this.selectedPerson.descendantsContain(id)) {
                    suggestedDescendants.push(descendantOfPartner.person);
                }
            }
        }

        return suggestedDescendants;
    }

    // Look at partners of selected person's ancestors
    public getSuggestedAncestors(): Person[] {
        const suggestedAncestors = new Array<Person>();

        for (const ancestor of this.selectedPerson.ancestors) {
            for (const partnerOfAncestor of ancestor.partners) {
                const id = partnerOfAncestor.person.id;
                if (id !== this.selectedPerson.person.id
                        && !this.selectedPerson.ancestorsContain(id)) {
                    suggestedAncestors.push(partnerOfAncestor.person);
                }
            }
        }

        return suggestedAncestors;
    }
}
