<template>
</template>

<script lang="ts">
import 'photoswipe/dist/photoswipe.css';
import 'photoswipe/dist/default-skin/default-skin.css';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import store from '../../store/store';
import config from '../../config';
import * as request from 'request-promise-native';
import PhotoSwipe from 'photoswipe';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';
import Image from '../../models/data/image';
import PhotoSwipeItem from '../../models/data/photoswipe_item';
import PhotoSwipeOptions from '../../models/data/photoswipe_options';
import PagedResult from '../../models/data/paged_results';


export default abstract class PhotoSwipeView extends Vue {

    public photoswipe: PhotoSwipe<PhotoSwipeUI_Default.Options> | null = null;

    public currentItem?: PhotoSwipeItem;

    public get title() {
        if (this.currentItem) {
            return this.currentItem.image.title;
        } else {
            return '';
        }
    }

    public get description() {
        if (this.currentItem) {
            return this.currentItem.image.description;
        } else {
            return '';
        }
    }

    public loadingMore: boolean = false;

    protected async init(
            images: Image[],
            selectedIndex: number,
            currentPage: number,
            totalItems: number) {

        window.console.log(`PhotoSwipeView.init(selectedIndex: ${selectedIndex},
            currentPage: ${currentPage}, totalItems: ${totalItems})`);
        window.console.log(images);

        const pswpElement = document.querySelectorAll('.pswp')[0] as HTMLElement;

        // build items array
        const items = new Array<PhotoSwipeItem>();

        for (const image of images) {
            const item = new PhotoSwipeItem(image);
            items.push(item);
        }
        window.console.log(items);

        // define options (if needed)
        const options = new PhotoSwipeOptions();
        options.index = selectedIndex;
        options.scaleMode = 'fit';

        // Initializes and opens PhotoSwipe
        this.photoswipe = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        this.photoswipe.init();

        this.currentItem = this.photoswipe.currItem as PhotoSwipeItem;

        this.photoswipe.listen('afterChange', this.afterChange);

        // load in images from other pages
        await this.loadMoreImages(currentPage, totalItems);
    }

    protected async loadMoreImages(currentPage: number, totalItems: number) {

        try {

            if (this.photoswipe) {
                this.loadingMore = true;
                const totalPages = Math.max(1, Math.ceil(totalItems / config.PaginationPageSize));

                const tasks = new Array<Promise<Image[]>>();
                if (currentPage < totalPages) {
                    for (let pageNo = currentPage + 1; pageNo <= totalPages; pageNo++) {
                        tasks.push(this.loadImageFromPage(pageNo));
                    }
                }

                if (currentPage > 1) {
                    for (let pageNo = 1; pageNo < currentPage; pageNo++) {
                        tasks.push(this.loadImageFromPage(pageNo));
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

        this.loadingMore = false;
    }

    protected getApiUrl(pageNo: number): string {
        return `${config.BaseApiUrl}${config.ImageAPI}?page=${pageNo}`;
    }

    protected async loadImageFromPage(pageNo: number): Promise<Image[]> {
        const options = {
            uri: this.getApiUrl(pageNo),
            headers: store.getters.ajaxHeader,
            json: true,
        };

        const response = await request.get(options) as PagedResult<Image>;
        const images = response.results as Image[];

        return images;
    }

    protected afterChange() {
        if (this.photoswipe) {
            this.currentItem = this.photoswipe.currItem as PhotoSwipeItem;
        }
    }

    protected download() {
        window.console.log(`PhotoSwipeView.download()`);
        if (this.photoswipe) {
            const link = (this.photoswipe.currItem as PhotoSwipeItem).image.original_image;
            window.open(link, `_blank`);
        }
    }
}
</script>

<!-- "scoped" attribute removed to fill screen -->
<style>
</style>
