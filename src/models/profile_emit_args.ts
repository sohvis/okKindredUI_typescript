import Person from './data/person';

export default class ProfileEmitArgs {
    public propertyNameUpdated: string;
    public person: Person;
    public newValue: any;
    public oldValue: any;

    constructor(person: Person, propertyNameUpdated: string, newValue: any, oldValue: any) {
        this.person = person;
        this.propertyNameUpdated = propertyNameUpdated;
        this.newValue = newValue;
        this.oldValue = oldValue;
    }
}
