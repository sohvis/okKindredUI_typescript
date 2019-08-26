<template>
    <b-modal
        ref="modal"
        centered
        v-bind:no-close-on-esc="true"
        v-bind:no-close-on-backdrop="true"
        @ok="submit" 
        @busy ="busy"
        okVariant='danger'
        :title="$t('message.DeleteGalleries')"
        :okTitle="$t('message.Delete')"
        :cancelTitle="$t('message.Cancel')" 
        button-size="lg">

        <p>
            {{ $t('message.DeleteGalleriesDesc') }}
        </p>

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
    Loading,
  },
})
export default class DeleteGalleries extends Vue {

    public busy: boolean = false;

    public errorMessage: string = '';

    public galleryIds: number[] = [];

    public get showError(): boolean {
        if (this.errorMessage && this.errorMessage.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    public show(galleryIds: number[]) {
        window.console.log(`DeleteGalleries.show()`);
        window.console.log(galleryIds);
        this.galleryIds = galleryIds;
        (this.$refs.modal as any).show();
    }


    private async submit(evt: any) {
        window.console.log(`DeleteGalleries.submit()`);

        evt.preventDefault();
        this.busy = true;

        try {

            const promises = new Array<Promise<void>>();

            for (const galleryId of this.galleryIds) {
                promises.push(this.deleteGallery(galleryId));
            }

            await Promise.all(promises);

            (this.$refs.modal as any).hide();

            this.$emit('galleriesDeleted');
        } catch (ex) {
            this.errorMessage = ex.toString();
        }

        this.busy = false;
    }

    private async deleteGallery(galleryId: number) {

        const options = {
            uri: `${config.BaseApiUrl}${config.GalleryAPI}${galleryId}/`,
            headers: store.getters.ajaxHeader,
            json: true,
        };

        const response = await request.delete(options);
        window.console.log(response);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
