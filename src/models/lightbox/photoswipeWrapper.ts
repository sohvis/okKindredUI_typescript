import PhotoSwipe from 'photoswipe';
import PhotoSwipeUI_Default from './photoswipe-ui-default';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import APIException from '@/models/data/api_exception';
import store from '../../store/store';
import config from '../../config';
import Image from '../../models/data/image';
import PhotoSwipeItem from './photoswipe_item';
import PhotoSwipeOptions from './photoswipe_options';
import PagedResult from '../../models/data/paged_results';

export default class PhotoSwipeWrapper {

    public photoswipe: PhotoSwipe<PhotoSwipeUI_Default.Options>;
    private interval: number = 0;


    constructor(
        images: Image[],
        selectedIndex: number) {

            const pswpElement = document.querySelectorAll('.pswp')[0] as HTMLElement;

            // build items array
            const items = new Array<PhotoSwipeItem>();

            for (const image of images) {
                const item = new PhotoSwipeItem(image, window.screen.width, window.screen.height);
                items.push(item);
            }
            // window.console.log(items);

            // define options
            const options = new PhotoSwipeOptions();
            options.index = selectedIndex;
            // still in progress
            options.scaleMode = 'fit';
            // Back button doesn't work if true
            options.history = false;

            // window.console.log(PhotoSwipeUI_Default);

            // Initializes and opens PhotoSwipe
            this.photoswipe = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
            // window.console.log(this.photoswipe);
            this.photoswipe.init();
    }

    public updateImage(image: Image) {

        let index = 0;
        for (index = 0; index < this.photoswipe.items.length; index++) {
            const item = this.photoswipe.items[index] as PhotoSwipeItem;
            if (image.id === item.image.id) {
                const newItem = new PhotoSwipeItem(image, window.screen.width, window.screen.height);
                this.photoswipe.items[index] = newItem;
                // sets a flag that slides should be updated
                this.photoswipe.invalidateCurrItems();
                // updates the content of slides
                this.photoswipe.updateSize(true);

                return;
            }
        }
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
                        const item = new PhotoSwipeItem(image, window.screen.width, window.screen.height);
                        this.photoswipe.items.push(item);
                    }
                }

                // sets a flag that slides should be updated
                this.photoswipe.invalidateCurrItems();
                // updates the content of slides
                this.photoswipe.updateSize(true);

            }

        } catch (ex) {
            const axiosError = ex as AxiosError<APIException>;
            store.commit('setErrorMessage', axiosError?.response?.data?.detail || (ex as Error).toString());
        }
    }

    public enableSlideshow() {
        this.interval = window.setInterval(() => this.nextImage(), 10000);
    }

    public disableSlideshow() {
        if (this.interval) {
            window.clearInterval(this.interval);
        }
    }

    private async loadImageFromPage(pageNo: number, urlFunction: (pageNo: number) => string): Promise<Image[]> {
        const options: AxiosRequestConfig = {
            url: urlFunction(pageNo),
            headers: store.getters.ajaxHeader,
            method: 'GET',
            responseType: 'json',
        };

        const response = await axios.request(options) as AxiosResponse<PagedResult<Image>>;
        const images = response.data.results as Image[];

        return images;
    }

    private nextImage() {
        this.photoswipe.next();
    }
}
