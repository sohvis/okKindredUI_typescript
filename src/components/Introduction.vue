<template>
  <div class="introduction">

    <b-carousel
      id="myCarousel"
      :interval="10000"
      controls
      indicators
      img-height="500">

        <b-carousel-slide  img-src="img/introduction/family_tree.png">
            <h1>{{ $t("message.Slide1Header") }}</h1>
            <p>{{ $t("message.Slide1Desc") }}</p>
            <p><a class="btn btn-success" href="#" role="button">{{ $t("message.SignUpButton") }}</a></p>
        </b-carousel-slide>

        <b-carousel-slide img-src="img/introduction/family_invite.png">
            <h1>{{ $t("message.Slide2Header") }}</h1>
            <p>{{ $t("message.Slide2Desc") }}</p>
            <p><a class="btn btn-success" href="#" role="button">{{ $t("message.SignUpButton") }}</a></p>
        </b-carousel-slide>

        <b-carousel-slide img-src="img/introduction/family_map.png">
            <h1>{{ $t("message.Slide3Header") }}</h1>
            <p>{{ $t("message.Slide3Desc") }}</p>
            <p><a class="btn btn-success" href="#" role="button">{{ $t("message.SignUpButton") }}</a></p>
        </b-carousel-slide>

        <b-carousel-slide img-src="img/introduction/family_photo-share.png">
            <h1>{{ $t("message.Slide4Header") }}</h1>
            <p>{{ $t("message.Slide4Desc") }}</p>
            <p><a class="btn btn-success" href="#" role="button">{{ $t("message.SignUpButton") }}</a></p>
        </b-carousel-slide>

    </b-carousel><!-- /.carousel -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class Introduction extends Vue {}
</script>

<style>
    .introduction {
        margin-bottom: 20px;
    }

    .carousel .carousel-inner .carousel-item {
        background-color: #552d65;
        max-height: 500px;
    }

    .carousel-item.img {
        max-height: 500px;
    }

    .img-fluid {
        max-height: 500px !important;
        width: auto !important;
        margin-left: auto;
        margin-right: auto;
        opacity: 0.4;
    }
</style>
