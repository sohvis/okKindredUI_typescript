<template>
<b-modal
        ref="modal"
        centered
        v-bind:no-close-on-esc="true"
        v-bind:no-close-on-backdrop="true"
        @ok="submit" 
        @busy ="busy"
        :title="$t('message.EditImage')"
        :okTitle="$t('message.Ok')"
        :cancelTitle="$t('message.Cancel')" 
        button-size="lg">
    <div>
        <img id="preview-image" 
            :src="image.thumbnail"
            class="preview-image" 
            v-bind:style="rotationStyle"/>

        <div>
            <button class="btn btn-lg btn-primary control-padding" @click="rotateAntiClockwise">
                <span class="oi oi-reload icon-flipped" aria-hidden="true" ></span>
            </button>

            <button class="btn btn-lg btn-primary control-padding" @click="rotateClockwise">
                <span class="oi oi-reload" aria-hidden="true"></span>
            </button>
        </div>

         <b-form @submit="submit" ref="form">
            <b-form-group
                :label="$t('message.Title') + '*'"
                label-for="title"
                :state="form.title">
                <b-form-input
                    id="titleInput"
                    v-model="form.title"
                    :state="form.titleState"
                    maxlength="50"
                    required>
                </b-form-input>
            </b-form-group>

            <b-form-group
                :label="$t('message.Description')">
                <b-form-textarea
                    v-model="form.description" 
                    rows="5">
                </b-form-textarea>
            </b-form-group>

            <small class="font-italic">* {{$t('message.Required')}}</small>
        </b-form >

        <Loading v-if="busy"/>

        <b-alert variant="danger" v-model="showError">
            {{ errorMessage }}
        </b-alert>
        
    </div>
    </b-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { BModal } from 'bootstrap-vue';
import * as request from 'request-promise-native';
import config from '../../config';
import store from '../../store/store';
import Image from '../../models/data/image';

@Component({
  components: {
  },
})
export default class EditImage extends Vue {

    public image?: Image;

    public form: any = {
        title: '',
        description: null,
    };

    public busy: boolean = false;

    public errorMessage: string = '';

    public get showError(): boolean {
        if (this.errorMessage && this.errorMessage.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    public rotationStyle: any = {};

    public rotation: number = 0;

    public show(image: Image) {
        window.console.log(`EditImage.show(image.id: ${image.id})`);

        this.image = image;
        this.rotation = 0;
        this.rotationStyle = {};
        this.form.title = image.title;
        this.form.description = image.description;
        (this.$refs.modal as BModal).show();
    }

 private async submit(evt: any) {
        window.console.log(`EditImage.submit()`);

        evt.preventDefault();
        this.errorMessage = '';

        const valid = (this.$refs.form as any).checkValidity();
        this.form.nameState = valid ? 'valid' : 'invalid';
        if (!valid) {
            this.$emit('onError');
            return;
        }

        try {
            this.busy = true;
            const options = {
                uri: `${config.BaseApiUrl}${config.ImageAPI}`,
                headers: store.getters.ajaxHeader,
                body: {
                    title: this.form.title,
                    description: this.form.description,
                    rotation: this.rotation,
                },
                json: true,
            };

            const response = await request.patch(options) as Image;
            window.console.log(response);

            this.$emit('imageEdited', response);
            (this.$refs.modal as BModal).hide();

        } catch (ex) {
            this.errorMessage = ex.toString();
        }

        this.busy = false;
    }

    private closeClicked() {
        (this.$refs.modal as BModal).hide();
    }

    private rotateClockwise() {
        window.console.log('EditImage.rotateClockwise()');

        if (this.rotation >= 270) {
            this.rotation = 0;
        } else {
            this.rotation += 90;
        }

        this.setRotation();
    }

    private rotateAntiClockwise() {
        window.console.log('EditImage.rotateAntiClockwise()');

        if (this.rotation < 90) {
            this.rotation = 270;
        } else {
            this.rotation -= 90;
        }

        this.setRotation();
    }

    private setRotation() {
        window.console.log('EditImage.setRotation()');

        const img = document.getElementById('preview-image') as HTMLImageElement;
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
    }
}
</script>


<style scoped>
.preview-image {
    max-height: 150px;
}
</style>
