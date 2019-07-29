<template>
    <b-modal
        ref="modal"
        @ok="handleOk" 
        @show="resetModal"
        @hidden="resetModal"
        @busy ="busy"
        :title="title"
        :okTitle="$t('message.Ok')"
        :cancelTitle="$t('message.Cancel')" >

        <b-card no-body>
            <b-tabs card justified>
                <b-tab active>
                    <template slot="title">
                        <span class="oi oi-plus" aria-hidden="true"></span>
                        <span class="oi oi-person" aria-hidden="true"></span>
                        {{ $t('message.AddNewPerson') }}
                    </template>
                    <b-card-text>
                        <NewRelative 
                            ref="newRelativeControl" 
                            @relationType="relationType" />
                    </b-card-text>
                </b-tab>
                <b-tab>
                    <template slot="title">
                        <span class="oi oi-magnifying-glass" aria-hidden="true"></span>
                        {{ $t('message.ExistingPerson') }}
                    </template>
                    <b-card-text>
                        Lorem Ipsum
                    </b-card-text>
                </b-tab>
            </b-tabs>
        </b-card>
        <Loading v-if="busy"/>
    </b-modal>
    
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import NewRelative from './NewRelative.vue';
import Loading from './../common/Loading.vue';

@Component({
  components: {
      NewRelative,
      Loading,
  },
})
export default class AddRelativeModal extends Vue {

    @Prop({default: ''})
    public title?: string;

    @Prop({default: 1})
    public relationType?: number;

    public busy: boolean = false;

    public show() {
        (this.$refs.modal as any).show();
    }

    private handleOk(e: Event) {
        window.console.log(`AddRelativeModal.handleOk()`);
        // Prevent modal from closing
        e.preventDefault();
        // (this.$refs.modal as any).hide();
        this.submit();
    }

    private resetModal() {
        window.console.log(`AddRelativeModal.resetModal()`);
    }

    private submit() {
        window.console.log(`AddRelativeModal.submit()`);
        this.busy = true;
        (this.$refs.newRelativeControl as any).submit();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
