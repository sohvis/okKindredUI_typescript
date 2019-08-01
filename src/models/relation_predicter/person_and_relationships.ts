import Person from '../data/person';

export default class PersonAndRelationships {

    public person: Person;

    public partners: PersonAndRelationships[] = [];

    public ancestors: PersonAndRelationships[] = [];

    public descendants: PersonAndRelationships[] = [];

    constructor(person: Person) {
        this.person = person;
        if (!this.person.small_thumbnail) {
            this.person.small_thumbnail = 'img/portrait_80.png';
        }
    }

    public partnersContain(id: string) {
        for (const partner of this.partners) {
            if (partner.person.id === id) {
                return true;
            }
        }

        return false;
    }

    public ancestorsContain(id: string) {
        for (const ancestor of this.ancestors) {
            if (ancestor.person.id === id) {
                return true;
            }
        }

        return false;
    }

    public descendantsContain(id: string) {
        for (const descendant of this.descendants) {
            if (descendant.person.id === id) {
                return true;
            }
        }

        return false;
    }
}
