<template>
    <b-modal
        ref="modal"
        ok-only
        centered
        v-bind:no-close-on-esc="true"
        v-bind:no-close-on-backdrop="true"
        @ok="ok" 
        :title="$t('message.UploadFinished')"
        :okTitle="$t('message.Ok')"
        :cancelTitle="$t('message.Cancel')" 
        button-size="lg">

        <div class="result-container">
            <div v-if="failedCount === 0">
                <h1>
                    <span class="rounded-circle success">
                        <span class="oi oi-check"></span>
                    </span>
                </h1>
                <h4>
                    {{ $t('message.AllUploadsSuccessful') }}
                </h4>
            </div>
            <div v-if="failedCount > 0">
                <h1>
                    <span class="rounded-circle fail">
                        <span class="oi oi-x"></span>
                    </span>
                </h1>
                <h4>
                    {{ $t('message.XSuccessfulYFailed', {success: successCount, fail: failedCount}) }}
                </h4>
            </div>
        </div>
    </b-modal>
 
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import config from '../../config';
import store from '../../store/store';

@Component({
  components: {
  },
})
export default class UploadFinished extends Vue {

    @Prop({ default: 0 })
    public failedCount?: number;

    @Prop({ default: 0 })
    public successCount?: number;

    @Prop({ default: '' })
    public backLink?: string;

    public show() {
        (this.$refs.modal as any).show();
    }


    private ok(evt: any) {
        window.console.log(`UploadFinished.ok()`);

        if (this.backLink &&  (!this.failedCount || this.failedCount === 0)) {
            this.$router.push(this.backLink);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.result-container {
    text-align: center;
}

.success {
    background-color: green;
    color: white;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 5px;
    padding-bottom: 2px;
}

.fail {
    background-color: red;
    color: white;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 2px;
    padding-bottom: 5px;
}
</style>
