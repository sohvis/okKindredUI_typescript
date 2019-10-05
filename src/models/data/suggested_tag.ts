export default interface SuggestedTag {
    id: number;
    image_id: number;
    person_id?: number;
    person_name?: string;
    probability?: number;
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    creation_date: Date;
    last_updated_date: Date;
}
