import PhotoSwipe from 'photoswipe';
import Image from './image';

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

    constructor(image: Image) {
        this.src = image.large_thumbnail;
        this.w = image.large_thumbnail_width;
        this.h = image.large_thumbnail_height;
        this.msrc = image.thumbnail;
        this.title = image.title;
    }
}
