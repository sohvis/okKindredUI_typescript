<template>
    <b-modal
        ref="modal"
        centered
        v-bind:no-close-on-esc="true"
        v-bind:no-close-on-backdrop="true"
        @ok="submit" 
        @busy ="busy"
        :title="$t('message.EditGallery')"
        :okTitle="$t('message.Ok')"
        :cancelTitle="$t('message.Cancel')" 
        button-size="lg">

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

    </b-modal>
 
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Loading from './../common/Loading.vue';
import Gallery from '../../models/data/gallery';
import config from '../../config';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import store from '../../store/store';

@Component({
  components: {
      Loading,
  },
})
export default class EditGallery extends Vue {

    public form: any = {
        id: 0,
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

    public show(gallery: Gallery) {
        // window.console.log(`EditGallery.show()`);

        // window.console.log(gallery);

        this.form.id = gallery.id;
        this.form.title = gallery.title;
        this.form.description = gallery.description;


        (this.$refs.modal as any).show();
    }

    private async submit(evt: any) {
        // window.console.log(`EditGallery.submit()`);

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
            const options: AxiosRequestConfig = {
                url: `${config.BaseApiUrl}${config.GalleryAPI}${this.form.id}/`,
                headers: store.getters.ajaxHeader,
                data: {
                    title: this.form.title,
                    description: this.form.description,
                },
                method: 'PATCH',
                responseType: 'json',
            };

            const response = await axios.request(options) as AxiosResponse<Gallery>;

            store.dispatch('updateCurrentGallery', response.data);

            this.$emit('galleryEdited', response.data);
            (this.$refs.modal as any).hide();

        } catch (ex) {
            this.errorMessage = ex.toString();
        }

        this.busy = false;
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
