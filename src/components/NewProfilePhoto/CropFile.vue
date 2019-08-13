<template>
    <div>
      <div>
        <button class="btn btn-warning">
          <span class="oi oi-reload" aria-hidden="true" @click="rotateClockwise"></span>
        </button>
        <button class="btn btn-warning">
          <span class="oi oi-reload icon-flipped" aria-hidden="true" @click="rotateAntiClockwise"></span>
        </button>
      </div>
      <p>
        {{ $t('message.PleaseTrimImage') }}
      </p>
      <img :src="file" v-bind:style="rotationStyle"/>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import store from '../../store/store';
import configs from '../../config';


@Component
export default class CropFile extends Vue {

  @Prop({default: ''})
  public file: string = '';

  public rotationStyle: any = {};

  public rotation: number = 0;

  protected mounted() {
    window.console.log('ChooseFile.vue mounted() called');
  }

  private rotateClockwise() {

    if (this.rotation == 270) {
      this.rotation = 0;
    }

    this.rotation += 90;
  }

  private rotateAntiClockwise() {
    if (this.rotation == 0) {
      this.rotation = 270;
    }

    this.rotation -= 90;
  }

  // Opens input file
  private nextClick() {
    this.$emit('next');
  }

  private backClick() {
    this.$emit('back');
  }

  @Watch('rotation')
  private setRotation() {
    const rotate = `rotate(${this.rotation}deg)`;

    this.rotationStyle = {
      '-webkit-transform': rotate,
      '-moz-transform': rotate,
      '-o-transform': rotate,
      '-ms-transform': rotate,
      'transform': rotate,
    };
  }
}
</script>

<style scoped>
.icon-flipped {
    transform: scaleX(-1);
    -moz-transform: scaleX(-1);
    -webkit-transform: scaleX(-1);
    -ms-transform: scaleX(-1);
}
</style>
