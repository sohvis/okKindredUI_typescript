import Person from '../data/person';

export default class RelationPrediction {
    public id: string;
    public fromPerson: Person;
    public toPerson: Person;
    public relationType: number;
    public fromPersonName: string;
    public toPersonName: string;
    public fromPersonImage: string;
    public toPersonImage: string;

    constructor(fromPerson: Person, toPerson: Person, relationType: number) {
        this.fromPerson = fromPerson;
        this.toPerson = toPerson;
        this.relationType = relationType;
        this.fromPersonName = fromPerson.name;
        this.toPersonName = toPerson.name;

        this.id = `${this.fromPerson.id}-${this.toPerson.id}`;

        this.fromPersonImage = fromPerson.small_thumbnail;
        this.toPersonImage = toPerson.small_thumbnail;

        if (!this.fromPersonImage) {
            this.fromPerson.small_thumbnail = 'img/portrait_80.png';
        }

        if (!this.toPersonImage) {
            this.toPerson.small_thumbnail = 'img/portrait_80.png';
        }
    }
}
