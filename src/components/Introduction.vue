<template>
  <div class="introduction">
    <div id="myCarousel" class="carousel slide" data-ride="carousel" data-interval="10000">

        <!-- Carousel indicators -->
        <ol class="carousel-indicators">
            <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
            <li data-target="#myCarousel" data-slide-to="1"></li>
            <li data-target="#myCarousel" data-slide-to="2"></li>
            <li data-target="#myCarousel" data-slide-to="3"></li>
        </ol>

        <!-- Wrapper for carousel items -->
        <div class="carousel-inner">
            <div class="item active">
                <img src="img/introduction/family_tree.png" alt="First slide">
                <div class="carousel-caption">
                    <h1>{% trans "Welcome to ok!Kindred" %}</h1>
                    <p>{% trans "The free and open source collaborative family tree and photo sharing website." %}</p>
                    <p><a class="btn btn-success" href="#" role="button">{%trans "Sign Up" %}</a></p>
                </div>
            </div>
            <div class="item">
                <img src="img/introduction/family_invite.png" alt="Second slide">
                    <div class="carousel-caption">
                        <h1>{% trans "Create And Share" %}</h1>
                        <p>{% trans "Create and share a multilingual family tree with your family and invite your family members to view it and add to it" %}</p>
                        <p><a class="btn btn-success" href="#" role="button">{%trans "Sign Up" %}</a></p>
                    </div>
            </div>
            <div class="item">
            <img class="third-slide" src="img/introduction/family_map.png" alt="Third slide">
                    <div class="carousel-caption">
                    <h1>{% trans "Map your family" %}</h1>
                    <p>{% trans "Plot the locations of each of your relatives on a map" %}</p>
                    <p><a class="btn btn-success" href="#" role="button">{%trans "Sign Up" %}</a></p>
                </div>
            </div>
            <div class="item">
                <img class="fourth-slide" src="img/introduction/family_photo-share.png" alt="Fourth slide">
                <div class="carousel-caption">
                    <h1>{% trans "Share Photos" %}</h1>
                    <p>{% trans "Share photos privately between your family and tag your family members" %}</p>
                    <p><a class="btn btn-success" href="#" role="button">{%trans "Sign Up" %}</a></p>
                </div>

            </div>
        </div>

        <!-- Carousel controls -->
        <a class="carousel-control left" href="#myCarousel" data-slide="prev">
            <span class="glyphicon glyphicon-chevron-left"></span>
        </a>
        <a class="carousel-control right" href="#myCarousel" data-slide="next">
            <span class="glyphicon glyphicon-chevron-right"></span>
        </a>

    </div><!-- /.carousel -->
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
