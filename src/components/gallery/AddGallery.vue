<template>
    <b-modal
        ref="modal"
        centered
        v-bind:no-close-on-esc="true"
        v-bind:no-close-on-backdrop="true"
        @ok="submit" 
        @show="resetModal"
        @busy ="busy"
        :title="$t('message.CreateNewGallery')"
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
import * as request from 'request-promise-native';
import store from '../../store/store';

@Component({
  components: {
  },
})
export default class AddGAllery extends Vue {

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

    public show() {
        (this.$refs.modal as any).show();
    }

    private resetModal() {
        this.form.title = '';
        this.form.description = '';
    }

    private async submit(evt: any) {
        window.console.log(`AddGallery.submit()`);

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
                uri: `${config.BaseApiUrl}${config.GalleryAPI}`,
                headers: store.getters.ajaxHeader,
                body: {
                    title: this.form.title,
                    description: this.form.description,
                },
                json: true,
            };

            const response = await request.post(options);
            window.console.log(response);

            this.$emit('galleryCreated', response.person);
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
