import PhotoSwipe from 'photoswipe';
import Image from '../data/image';

export default class PhotoSwipeItem implements PhotoSwipe.Item {
    public src: string;
    public w: number;
    public h: number;
    public msrc?: string | undefined;
    public loadError?: boolean | undefined;
    public vGap?: { top: number; bottom: number; } | undefined;
    public fitRatio?: number | undefined;
    public initialZoomLevel?: number | undefined;
    public bounds?: any;
    public initialPosition?: any;
    public title: string;
    public image: Image;

    constructor(image: Image, screenWidth: number, screenHeight: number) {
        this.src = image.large_thumbnail;
        this.msrc = image.thumbnail;
        this.title = image.title;
        this.image = image;

        // Ensures the photo fills the screen
        const ratio = Math.min(screenWidth / image.large_thumbnail_width, screenHeight / image.large_thumbnail_height);

        if (ratio < 1) {
            this.w = image.large_thumbnail_width;
            this.h = image.large_thumbnail_height;
        } else {
            this.w = image.large_thumbnail_width * ratio;
            this.h = image.large_thumbnail_height * ratio;
        }
    }
}
