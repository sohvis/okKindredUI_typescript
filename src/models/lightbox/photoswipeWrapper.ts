import PhotoSwipe from 'photoswipe';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';
import * as request from 'request-promise-native';
import store from '../../store/store';
import config from '../../config';
import Image from '../../models/data/image';
import PhotoSwipeItem from '../../models/data/photoswipe_item';
import PhotoSwipeOptions from '../../models/data/photoswipe_options';
import PagedResult from '../../models/data/paged_results';

export default class PhotoSwipeWrapper {

    public photoswipe: PhotoSwipe<PhotoSwipeUI_Default.Options>;

    constructor(
        images: Image[],
        selectedIndex: number) {

            const pswpElement = document.querySelectorAll('.pswp')[0] as HTMLElement;

            // build items array
            const items = new Array<PhotoSwipeItem>();

            for (const image of images) {
                const item = new PhotoSwipeItem(image);
                items.push(item);
            }
            window.console.log(items);

            // define options
            const options = new PhotoSwipeOptions();
            options.index = selectedIndex;
            // still in progress
            options.scaleMode = 'fit';
            // Back button doesn't work if true
            options.history = false;

            // Initializes and opens PhotoSwipe
            this.photoswipe = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
            this.photoswipe.init();
    }

    public async loadImagesFromOtherPages(
                    currentPage: number,
                    totalItems: number,
                    urlFunction: (pageNo: number) => string) {

        try {

            if (this.photoswipe) {
                const totalPages = Math.max(1, Math.ceil(totalItems / config.PaginationPageSize));

                const tasks = new Array<Promise<Image[]>>();
                if (currentPage < totalPages) {
                    for (let pageNo = currentPage + 1; pageNo <= totalPages; pageNo++) {
                        tasks.push(this.loadImageFromPage(pageNo, urlFunction));
                    }
                }

                if (currentPage > 1) {
                    for (let pageNo = 1; pageNo < currentPage; pageNo++) {
                        tasks.push(this.loadImageFromPage(pageNo, urlFunction));
                    }
                }

                const imageLists = await Promise.all(tasks);

                for (const imageList of imageLists) {
                    for (const image of imageList) {
                        const item = new PhotoSwipeItem(image);
                        this.photoswipe.items.push(item);
                    }
                }

                // sets a flag that slides should be updated
                this.photoswipe.invalidateCurrItems();
                // updates the content of slides
                this.photoswipe.updateSize(true);

            }

        } catch (ex) {
            store.commit('setErrorMessage', ex);
        }
    }

    private async loadImageFromPage(pageNo: number, urlFunction: (pageNo: number) => string): Promise<Image[]> {
        const options = {
            uri: urlFunction(pageNo),
            headers: store.getters.ajaxHeader,
            json: true,
        };

        const response = await request.get(options) as PagedResult<Image>;
        const images = response.results as Image[];

        return images;
    }
}
