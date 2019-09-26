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

      <div id="overlay" v-bind:style="overlayStyle"></div>
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

  public overlayStyle: any = {};

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

  public resetRotation() {
    this.rotation = 0;
    this.rotationStyle = {};
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

    this.setOverlay(img);

    const smallestDimension = Math.min(img.width, img.height);
    const rect = Jcrop.Rect.fromPoints([10, 10], [smallestDimension * 0.75, smallestDimension * 0.75]);

    if (this.jcrop) {
      // resize widget
      window.console.log(this.jcrop);
    } else {
      this.jcrop = Jcrop.attach('overlay', {
        multiMax: 1,
        canRemove: false,
      });
    }

    if (this.jcrop.active) {
      window.console.log(`this.jcrop.active`);
      this.jcrop.active.pos = rect;
      this.jcrop.active.render();
    } else {
      const crop = this.jcrop.newWidget(rect, {
        aspectRatio: rect.aspect,
        canRemove: false,
      });
    }


    this.refreshJcrop();
  }

  private rotateClockwise() {
    window.console.log('ChooseFile.rotateClockwise()');

    if (this.rotation >= 270) {
      this.rotation = 0;
    } else {
      this.rotation += 90;
    }

    this.setRotation();
  }

  private rotateAntiClockwise() {
    window.console.log('ChooseFile.rotateAntiClockwise()');

    if (this.rotation < 90) {
      this.rotation = 270;
    } else {
      this.rotation -= 90;
    }

    this.setRotation();
  }


  // Opens input file
  private nextClick() {
    window.console.log('ChooseFile.nextClick()');

    const cropArgs = new CropArgs(
      store.state.person_id,
      document.getElementById('crop-image') as HTMLImageElement,
      this.file as File,
      this.jcrop.active.pos,
      this.rotation,
    );

    window.console.log(cropArgs);

    this.$emit('next', cropArgs);
  }

  private backClick() {
    window.console.log('ChooseFile.backClick()');

    // reset the rotation if going back
    this.resetRotation();

    this.$emit('back');
  }

  private setRotation() {
    window.console.log('ChooseFile.setRotation()');

    const img = document.getElementById('crop-image') as HTMLImageElement;
    const rotate = `rotate(${this.rotation}deg)`;
    let marginLeft = '0';
    let marginTop = '0';
    let transformOrigin = '';
    switch (this.rotation) {
      case 0:
        // No changes to default
        break;

      case 90:
        marginLeft = `${img.height}px`;
        transformOrigin = '0 0';
        break;

      case 180:
        // No changes to default
        break;

      case 270:
        marginTop = `${img.width}px`;
        transformOrigin = '0 0';
        break;
    }

    this.rotationStyle = {
      '-webkit-transform': rotate,
      '-moz-transform': rotate,
      '-o-transform': rotate,
      '-ms-transform': rotate,
      'transform': rotate,
      'transform-origin': transformOrigin,
      'margin-left': marginLeft,
      'margin-top': marginTop,
    };

    this.$nextTick(() => {
      this.setOverlay(img);
      this.refreshJcrop();


      this.$nextTick(() => this.moveCropArea());
    });
  }


  // Create an overlay to bind JCrop to as it can't handle rotations
  private setOverlay(img: HTMLImageElement) {
    window.console.log('ChooseFile.setOverlay()');
    const dimensions = img.getBoundingClientRect();

    this.overlayStyle = {
      'position': 'absolute',
      'z-index': 2,
      'top': `${dimensions.top}px`,
      'left': `${dimensions.left}px`,
      'width': `${dimensions.width}px`,
      'height': `${dimensions.height}px`,
    };
  }

  private refreshJcrop() {
    window.setTimeout(() => {
      if (this.jcrop) {
        this.jcrop.refresh();
      }
    }, 100);
  }

  private moveCropArea() {
    // Move crop area if it is out of bounds after rotation
    const overlay = document.getElementById('overlay') as HTMLDivElement;
    const dims = overlay.getBoundingClientRect();

    const rightCrop = this.jcrop.active.pos.x + this.jcrop.active.pos.w;
    const bottomCrop = this.jcrop.active.pos.y + this.jcrop.active.pos.h;

    if (rightCrop > dims.width || bottomCrop > dims.height) {
      const smallestDimension = Math.min(dims.width, dims.height);

      const rect = Jcrop.Rect.fromPoints([10, 10], [smallestDimension * 0.75, smallestDimension * 0.75]);
      this.jcrop.active.pos = rect;
      this.jcrop.active.render();
    }
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
