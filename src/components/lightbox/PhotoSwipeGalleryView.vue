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

                <button class="pswp__button download oi oi-data-transfer-download"
                    @click="download">
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
                <!-- <div class="pswp__caption__center"></div> -->
                <div class="caption-center">
                    <h4>{{ title }}</h4>
                    <p>{{ description }}</p>
                </div>
            </div>

        </div>

    </div>

</div>

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
import PhotoSwipeViewBase from './PhotoSwipeViewBase.vue';
import PhotoSwipeItem from '../../models/data/photoswipe_item';
import PhotoSwipeOptions from '../../models/data/photoswipe_options';
import PagedResult from '../../models/data/paged_results';


@Component({
  components: {
  },
})
export default class PhotoSwipeGalleryView extends PhotoSwipeViewBase {

    public galleryId: number = 0;

    public async initialize(
        images: Image[],
        selectedIndex: number,
        currentPage: number,
        totalItems: number,
        galleryId: number) {

        this.galleryId = galleryId;
        
        await this.init(images, selectedIndex, currentPage, totalItems);
    }

    
    protected getApiUrl(pageNo: number): string {
        return `${config.BaseApiUrl}${config.ImageAPI}?page=${pageNo}&gallery_id=${this.galleryId}`;
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

.caption-center {
    text-align: left;
    max-width: 420px;
    margin: 0 auto;
    font-size: 13px;
    padding: 10px;
    line-height: 20px;
    color: #CCC;
}
</style>
