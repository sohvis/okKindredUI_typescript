import PhotoSwipe from 'photoswipe';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';

export default class PhotoSwipeOptions implements PhotoSwipeUI_Default.Options {
    public index: number = 0;
    public scaleMode?: string;
    public history: boolean = true;
    public downloadEl: boolean = true;
    public mapEl: boolean = true;
    public editImageEl: boolean = true;
    public tagsEl: boolean = true;
    public slideshowEl: boolean = true;
}
