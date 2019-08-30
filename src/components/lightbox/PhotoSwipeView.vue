<template>
<!-- Root element of PhotoSwipe. Must have class pswp. -->
<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">

    <!-- Background of PhotoSwipe. 
         It's a separate element as animating opacity is faster than rgba(). -->
    <div class="pswp__bg"></div>

    <!-- Slides wrapper with overflow:hidden. -->
    <div class="pswp__scroll-wrap">

        <!-- Container that holds slides. 
            PhotoSwipe keeps only 3 of them in the DOM to save memory.
            Don't modify these 3 pswp__item elements, data is added later on. -->
        <div class="pswp__container">
            <div class="pswp__item"></div>
            <div class="pswp__item"></div>
            <div class="pswp__item"></div>
        </div>

        <!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
        <div class="pswp__ui pswp__ui--hidden">

            <div class="pswp__top-bar">

                <!--  Controls are self-explanatory. Order can be changed. -->

                <div v-show="!loadingMore" class="pswp__counter"></div>
                <div v-show="loadingMore" class="loading-more">
                    <span class="spinner-border spinner-border-sm" role="status">
                    </span>
                </div>

                <button class="pswp__button pswp__button--close"></button>

                <button class="pswp__button download oi oi-data-transfer-download"
                    @click="download">
                </button>

                <button class="pswp__button pswp__button--fs"></button>

                <!-- Preloader demo https://codepen.io/dimsemenov/pen/yyBWoR -->
                <!-- element will get class pswp__preloader--active when preloader is running -->
                <div class="pswp__preloader">
                    <div class="pswp__preloader__icn">
                      <div class="pswp__preloader__cut">
                        <div class="pswp__preloader__donut"></div>
                      </div>
                    </div>
                </div>
            </div>

            <button class="pswp__button pswp__button--arrow--left">
            </button>

            <button class="pswp__button pswp__button--arrow--right">
            </button>

            <div class="pswp__caption">
                <div class="pswp__caption__center"></div>
            </div>

        </div>

    </div>

</div>

<!-- 
                     -->

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


@Component({
  components: {
  },
})
export default class PhotoSwipeView extends Vue {

    public photoswipe: PhotoSwipe<PhotoSwipeUI_Default.Options> | null = null;

    public currentItem?: PhotoSwipeItem;

    public loadingMore: boolean = false;

    public async init(images: Image[], selectedIndex: number, page: number, totalItems: number) {
        window.console.log(`PhotoSwipeView.init(selectedIndex: ${selectedIndex}, 
            page: ${page}, totalItems: ${totalItems})`);
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

        // Initializes and opens PhotoSwipe
        this.photoswipe = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        this.photoswipe.init();

        this.currentItem = this.photoswipe.currItem as PhotoSwipeItem;

        this.photoswipe.listen('afterChange', this.afterChange);

        await this.loadMoreImages(page, totalItems);
    }

    private async loadMoreImages(page: number, totalItems: number) {
        this.loadingMore = true;
        const totalPages = Math.max(1, Math.ceil(totalItems / config.PaginationPageSize));
    }

    private afterChange() {
        if (this.photoswipe) {
            this.currentItem = this.photoswipe.currItem as PhotoSwipeItem;
        }
    }

    private download() {
        window.console.log(`PhotoSwipeView.download()`)
        if (this.photoswipe) {
            const link = (this.photoswipe.currItem as PhotoSwipeItem).image.original_image;
            window.open(link, `_blank`);
        }
    }
}
</script>

<!-- "scoped" attribute removed to fill screen -->
<style>

.download {
    color: white;
    background-image: none !important;
}

.loading-more {
    position: absolute;
    left: 0;
    top: 0;
    height: 44px;
    font-size: 13px;
    line-height: 44px;
    color: #FFF;
    opacity: 0.75;
    padding: 0 10px;
}
</style>
