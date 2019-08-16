<template>
    <div>
      <p>
        {{ $t('message.PleaseTrimImage') }}
      </p>

      <div>
        <button class="btn btn-lg btn-danger control-padding" @click="backClick">
          <span class="oi oi-arrow-thick-left" aria-hidden="true"></span>
          {{ $t('message.Back') }}
        </button>

        <button class="btn btn-lg btn-primary control-padding" @click="rotateAntiClockwise">
          <span class="oi oi-reload icon-flipped" aria-hidden="true" ></span>
        </button>

        <button class="btn btn-lg btn-primary control-padding" @click="rotateClockwise">
          <span class="oi oi-reload" aria-hidden="true"></span>
        </button>

        <button class="btn btn-lg btn-success control-padding" @click="nextClick">
          <span class="oi oi-check" aria-hidden="true"></span>
          {{ $t('message.Ok') }}
        </button>

      </div>

      <div id="image-container">
        <img id="crop-image" v-bind:style="rotationStyle"/>
      </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import store from '../../store/store';
import configs from '../../config';
import Jcrop from 'jcrop';
import 'jcrop/dist/jcrop.css';
import CropArgs from '../../models/data/crop_args';

@Component
export default class CropFile extends Vue {

  public file: File | null = null;

  public rotationStyle: any = {};

  public rotation: number = 0;

  private fileReader = new FileReader();

  private jcrop: any;

  constructor() {
    super();
  }

  public loadFile(file: File) {
    window.console.log('ChooseFile.loadFile()');

    this.fileReader.onload = this.fileReaderOnLoad;
    this.file = file;
    this.fileReader.readAsDataURL(file);
  }

  protected mounted() {
    window.console.log('ChooseFile.vue mounted() called');

  }

  private fileReaderOnLoad(e: any) {
    window.console.log('ChooseFile.fileReaderOnLoad()');

    const img = document.getElementById('crop-image') as HTMLImageElement;

    img.onload = () => this.initialiseJcrop(img);
    img.src = e.target.result;

    // Set the max height to fill screen
    const height = window.innerHeight - img.getBoundingClientRect().top - 20;
    img.style.maxHeight = `${height}px`;
  }

  private initialiseJcrop(img: HTMLImageElement) {

    this.jcrop = Jcrop.attach('crop-image', {
      aspectRatio: 1,
    });

    const smallestDimension = Math.min(img.width, img.height);
    const rect = Jcrop.Rect.fromPoints([10, 10], [smallestDimension * 0.75, smallestDimension * 0.75]);

    const crop = this.jcrop.newWidget(rect, {
      aspectRatio: rect.aspect,
      canRemove: false,
    });

    window.console.log(this.jcrop);

  }

  private rotateClockwise() {
    window.console.log('ChooseFile.rotateClockwise()');

    this.rotation += 90;

    if (this.rotation >= 360) {
      this.rotation = 0;
    }
  }

  private rotateAntiClockwise() {
    window.console.log('ChooseFile.rotateAntiClockwise()');

    this.rotation -= 90;

    if (this.rotation < 0) {
      this.rotation = 270;
    }
  }

  // Opens input file
  private nextClick() {
    window.console.log('ChooseFile.nextClick()');

    const cropArgs = new CropArgs(
      store.state.person_id,
      document.getElementById('crop-image') as HTMLImageElement,
      this.file as File,
      this.jcrop.active.pos,
    );

    window.console.log(cropArgs);

    this.$emit('next', cropArgs);
  }

  private backClick() {
    window.console.log('ChooseFile.backClick()');
    this.jcrop.destroy();
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

#crop-image {
  max-width: 100%;
}

#image-container {
  margin-top: 20px;
  height: 100%;
  max-height: 100%;
}

.icon-flipped {
  transform: scaleX(-1);
  -moz-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  -ms-transform: scaleX(-1);
}

.control-padding {
  margin-right: 5px;
}
</style>
