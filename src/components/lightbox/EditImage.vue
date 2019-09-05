<template>
<b-modal
    ref="editImageModal"
    centered
    v-bind:no-close-on-esc="true"
    v-bind:no-close-on-backdrop="true"
    @ok="submit" 
    @busy ="busy"
    @hidden="onHidden"
    :title="$t('message.EditImage')"
    :okTitle="$t('message.Ok')"
    :cancelTitle="$t('message.Cancel')" 
    button-size="lg">
    <div>

        <b-card no-body>
            <b-tabs card justified>
                <b-tab active>
                    <template slot="title">
                        <span class="oi oi-image" aria-hidden="true"></span>
                        {{ $t('message.Details') }}
                    </template>
                    <b-card-text>
                        <b-form @submit="submit" ref="form">

                            <img id="preview-image" 
                                :src="image.thumbnail"
                                class="preview-image" 
                                v-bind:style="rotationStyle"/>

                            <div class="rotate-container">
                                <button class="btn btn-sm btn-outline-secondary control-padding"
                                    type="button"
                                    @click="rotateAntiClockwise">
                                    <span class="oi oi-reload icon-flipped" aria-hidden="true" ></span>
                                </button>

                                <button class="btn btn-sm btn-outline-secondary control-padding"
                                    type="button"
                                    @click="rotateClockwise">
                                    <span class="oi oi-reload" aria-hidden="true"></span>
                                </button>
                            </div>

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
                    </b-card-text>
                </b-tab>
                <b-tab @click="locationTabClicked">
                    <template slot="title">
                        <span class="oi oi-map" aria-hidden="true"></span>
                        {{ $t('message.Location') }}
                    </template>
                    <b-card-text>
                        <EditLocation ref="editLocation" />
                    </b-card-text>
                </b-tab>
            </b-tabs>
        </b-card>


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
import Loading from '../../components/common/Loading.vue';
import EditLocation from '../../components/lightbox/EditLocation.vue';

@Component({
    components: {
        Loading,
        EditLocation,
    },
})
export default class EditImage extends Vue {

    public image?: Image;

    public get thumbnail(): string {
        if (this.image) {
            return this.image.thumbnail;
        } else {
            return '';
        }
    }

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

    public clockwiseRotation: number = 0;

    public show(image: Image) {
        window.console.log(`EditImage.show(image.id: ${image.id})`);

        this.image = image;
        this.clockwiseRotation = 0;
        this.rotationStyle = {};
        this.form.title = image.title;
        this.form.description = image.description;

        // No idea why this needs to be delayed. but only works 2nd time otherwise
        this.$nextTick(() => {
            (this.$refs.editImageModal as BModal).show();
            this.$nextTick(() =>
                (this.$refs.editLocation as EditLocation).initialise(image.latitude, image.longitude));
        });
    }

    private async submit(evt: any) {
        window.console.log(`EditImage.submit()`);

        evt.preventDefault();
        this.errorMessage = '';

        const valid = (this.$refs.form as any).checkValidity();
        this.form.nameState = valid ? 'valid' : 'invalid';
        if (!valid || !this.image) {
            this.$emit('onError');
            return;
        }

        try {
            this.busy = true;
            const options = {
                uri: `${config.BaseApiUrl}${config.ImageAPI}${this.image.id}/`,
                headers: store.getters.ajaxHeader,
                body: {
                    title: this.form.title,
                    description: this.form.description,
                    anticlockwise_angle: 360 - this.clockwiseRotation,
                    latitude: (this.$refs.editLocation as EditLocation).latitude,
                    longitude: (this.$refs.editLocation as EditLocation).longitude,
                },
                json: true,
            };

            const response = await request.patch(options) as Image;
            window.console.log(response);

            this.$emit('imageEdited', response);
            (this.$refs.editImageModal as BModal).hide();

        } catch (ex) {
            this.errorMessage = ex.toString();
        }

        this.busy = false;
    }

    private closeClicked() {
        (this.$refs.editImageModal as BModal).hide();
    }

    private rotateClockwise() {
        window.console.log('EditImage.rotateClockwise()');

        if (this.clockwiseRotation >= 270) {
            this.clockwiseRotation = 0;
        } else {
            this.clockwiseRotation += 90;
        }

        this.setRotation();
    }

    private rotateAntiClockwise() {
        window.console.log('EditImage.rotateAntiClockwise()');

        if (this.clockwiseRotation < 90) {
            this.clockwiseRotation = 270;
        } else {
            this.clockwiseRotation -= 90;
        }

        this.setRotation();
    }

    private setRotation() {
        window.console.log('EditImage.setRotation()');

        const img = document.getElementById('preview-image') as HTMLImageElement;
        const rotate = `rotate(${this.clockwiseRotation}deg)`;
        let marginLeft = '0';
        let marginTop = '0';
        let marginBottom = '0';
        let transformOrigin = '';
        switch (this.clockwiseRotation) {
            case 0:
                // No changes to default
                break;

            case 90:
                marginLeft = `${img.height}px`;
                marginBottom = `${img.width - img.height}px`;
                transformOrigin = '0 0';
                break;

            case 180:
                // No changes to default
                break;

            case 270:
                marginTop = `${img.width}px`;
                marginBottom = `-${img.height}px`;
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
            'margin-bottom': marginBottom,
        };
    }

    private locationTabClicked() {
        (this.$refs.editLocation as EditLocation).Redraw();
    }

    private onHidden() {
        this.$emit('onHidden');
    }
}
</script>


<style scoped>
.preview-image {
    max-height: 300px;
}

.icon-flipped {
  transform: scaleX(-1);
  -moz-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  -ms-transform: scaleX(-1);
}

.control-padding {
    margin-left: 2px;
    margin-right: 2px;
}

.rotate-container {
    margin-top: 5px;
    margin-bottom: 10px;
}
</style>
