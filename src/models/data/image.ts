export default interface Image {
    id: number;
    gallery_id: number;
    title: string;
    description: string;
    original_image: string;
    original_image_height: number;
    original_image_width: number;
    thumbnail: string;
    thumbnail_height: number;
    thumbnail_width: number;
    large_thumbnail: string;
    large_thumbnail_height: number;
    large_thumbnail_width: number;
    date_taken: Date;
    latitude: number;
    longitude: number;
    creation_date: Date;
    last_updated_date: Date;

    // Rendering only
    display_height: number;
    display_width: number;

    selected: boolean;
}
