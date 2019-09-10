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

                <!--  Controls -->
                <div v-show="!loadingMore" class="pswp__counter"></div>
                <div v-show="loadingMore" class="loading-more">
                    <span class="spinner-border spinner-border-sm" role="status">
                    </span>
                </div>

                <button class="pswp__button pswp__button--close"></button>

                <button class="pswp__button custom-button oi oi-data-transfer-download"
                    @click="download">
                </button>

                <button v-show="displayMap" class="pswp__button custom-button oi oi-map"
                    @click="showMap">
                </button>

                <button class="pswp__button custom-button oi oi-pencil"
                    @click="editImage">
                </button>

                <!-- fullscreen -->
                <button class="pswp__button pswp__button--fs"></button>

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
                <div class="caption-center">
                    <span id="caption-description"></span>
                </div>
            </div>

        </div>

    </div>
    <MapPopUp ref="mapPopUp" @onHidden="popupHidden" />
    <EditImage ref="editImage" @imageEdited="imageEdited" @onHidden="popupHidden" />
</div>

</template>

<script lang="ts">
import 'photoswipe/dist/photoswipe.css';
import 'photoswipe/dist/default-skin/default-skin.css';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import store from '../../store/store';
import config from '../../config';
import * as request from 'request-promise-native';
import Image from '../../models/data/image';
import PhotoSwipeItem from '../../models/lightbox/photoswipe_item';
import PhotoSwipeWrapper from '../../models/lightbox/photoswipeWrapper';
import MapPopUp from './MapPopUp.vue';
import EditImage from './EditImage.vue';

@Component({
  components: {
      MapPopUp,
      EditImage,
  },
})
export default class PhotoSwipeGalleryView extends Vue {

    public galleryId: number = 0;

    public photoswipeWrapper: PhotoSwipeWrapper | null = null;

    public loadingMore: boolean = false;

    public displayMap: boolean = false;

    public async init(
            images: Image[],
            selectedIndex: number,
            currentPage: number,
            totalItems: number,
            galleryId: number,
            allImagesLoaded: boolean = false) {

        window.console.log(`PhotoSwipeView.init(selectedIndex: ${selectedIndex},
            currentPage: ${currentPage}, totalItems: ${totalItems}, galleryId: ${galleryId})`);

        this.galleryId = galleryId;


        // Initializes and opens PhotoSwipe
        this.photoswipeWrapper = new PhotoSwipeWrapper(images, selectedIndex);

        this.photoswipeWrapper.photoswipe.listen('afterChange', this.afterChange);

        const urlPrefix = `${config.BaseApiUrl}${config.ImageAPI}?gallery_id=${this.galleryId}&page=`;
        const getUrl = (pageNo: number) => urlPrefix + pageNo.toString();

        // load in images from other pages
        if (!allImagesLoaded) {
        this.loadingMore = true;
        await this.photoswipeWrapper.loadImagesFromOtherPages(currentPage, totalItems, getUrl);
        this.loadingMore = false;
        }
    }


    private afterChange() {
        window.console.log(`PhotoSwipeView.afterChange()`);

        if (this.photoswipeWrapper) {

            const image = (this.photoswipeWrapper.photoswipe.currItem as PhotoSwipeItem).image;

            // Update stuff vue binding doesn't seeem to work
            const span = document.getElementById('caption-description') as HTMLSpanElement;
            span.innerHTML = image.description;

            this.displayMap = !(image.latitude === 0 && image.longitude === 0);
        }
    }

    private download() {
        window.console.log(`PhotoSwipeView.download()`);

        if (this.photoswipeWrapper) {
            const link = (this.photoswipeWrapper.photoswipe.currItem as PhotoSwipeItem).image.original_image;
            window.open(link, `_blank`);
        }
    }

    private showMap() {
        window.console.log(`PhotoSwipeView.showMap()`);

        if (this.photoswipeWrapper) {
            const image = (this.photoswipeWrapper.photoswipe.currItem as PhotoSwipeItem).image;
            (this.$refs.mapPopUp as MapPopUp).show([image.latitude, image.longitude]);

            this.photoswipeWrapper.photoswipe.options.arrowKeys = false;
            this.photoswipeWrapper.photoswipe.options.escKey = false;
        }
    }

    private async editImage() {
        if (this.photoswipeWrapper) {
            const image = (this.photoswipeWrapper.photoswipe.currItem as PhotoSwipeItem).image;
            await (this.$refs.editImage as EditImage).show(image);

            this.photoswipeWrapper.photoswipe.options.arrowKeys = false;
            this.photoswipeWrapper.photoswipe.options.escKey = false;
        }
    }

    private imageEdited(image: Image) {
        if (this.photoswipeWrapper) {
            this.photoswipeWrapper.updateImage(image);
        }

        this.$emit('imageEdited', image);
    }

    private popupHidden() {
        if (this.photoswipeWrapper) {
            this.photoswipeWrapper.photoswipe.options.arrowKeys = true;
            this.photoswipeWrapper.photoswipe.options.escKey = true;
        }
    }
}
</script>

<style scoped>

.custom-button {
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

.caption-center {
    text-align: left;
    max-width: 420px;
    margin-top: -10px;
    margin-right: auto;
    margin-left: auto;
    font-size: 13px;
    padding-top: 0px;
    padding-left: 10px;
    padding-right: 10px;
    line-height: 20px;
    color: #CCC;
    font-size: 0.7em;
}

.pswp__caption__center {
    font-weight: bold;
}

.pswp {
    z-index: 1030 !important;
}

</style>
