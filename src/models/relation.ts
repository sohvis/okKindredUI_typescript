export default interface Relation {
    id: string;
    from_person_id: number;
    to_person_id: number;
    relation_type: number;
    creation_date: Date;
    last_updated_date: Date;
}
