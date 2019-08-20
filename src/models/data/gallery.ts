export default interface Gallery {
    id: number;
    title: string;
    description: string;
    thumbnail: string;
    thumbnail_height: number;
    thumbnail_width: number;
    creation_date: Date;
    last_updated_date: Date;

    // Used for rendering
    display_height: number;
    display_width: number;
}
