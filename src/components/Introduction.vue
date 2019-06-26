<template>
  <div class="introduction">

    <b-carousel
      id="myCarousel"
      v-model="slide"
      :interval="10000"
      controls
      indicators
      img-height="500">

        <b-carousel-slide img-src="img/introduction/family_tree.png">
            <h1>{% trans "Welcome to ok!Kindred" %}</h1>
            <p>{% trans "The free and open source collaborative family tree and photo sharing website." %}</p>
            <p><a class="btn btn-success" href="#" role="button">{%trans "Sign Up" %}</a></p>
        </b-carousel-slide>

        <b-carousel-slide img-src="img/introduction/family_invite.png">
            <h1>{% trans "Create And Share" %}</h1>
            <p>{% trans "Create and share a multilingual family tree with your family and invite your family members to view it and add to it" %}</p>
            <p><a class="btn btn-success" href="#" role="button">{%trans "Sign Up" %}</a></p>
        </b-carousel-slide>

        <b-carousel-slide img-src="img/introduction/family_map.png">
            <h1>{% trans "Map your family" %}</h1>
            <p>{% trans "Plot the locations of each of your relatives on a map" %}</p>
            <p><a class="btn btn-success" href="#" role="button">{%trans "Sign Up" %}</a></p>
        </b-carousel-slide>

        <b-carousel-slide img-src="img/introduction/family_photo-share.png">
            <h1>{% trans "Share Photos" %}</h1>
            <p>{% trans "Share photos privately between your family and tag your family members" %}</p>
            <p><a class="btn btn-success" href="#" role="button">{%trans "Sign Up" %}</a></p>
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
