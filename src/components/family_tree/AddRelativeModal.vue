<template>
<div>
    <b-modal
        ref="modal"
        centered
        v-bind:no-close-on-esc="true"
        v-bind:no-close-on-backdrop="true"
        @ok="handleOk" 
        @show="resetModal"
        @hidden="resetModal"
        @busy ="busy"
        :title="title"
        :okTitle="$t('message.Ok')"
        :cancelTitle="$t('message.Cancel')" 
        button-size="lg">

        <b-card no-body>
            <b-tabs card justified>
                <b-tab active @click="setState('NewPerson')" >
                    <template slot="title">
                        <span class="oi oi-plus" aria-hidden="true"></span>
                        <span class="oi oi-person" aria-hidden="true"></span>
                        {{ $t('message.NewPerson') }}
                    </template>
                    <b-card-text>
                        <NewRelative 
                            ref="newRelativeControl" 
                            v-bind:relationType="relationType" 
                            @onError="onError"
                            @personCreated="personCreated" />
                    </b-card-text>
                </b-tab>
                <b-tab @click="setState('ExistingPerson')">
                    <template slot="title">
                        <span class="oi oi-magnifying-glass" aria-hidden="true"></span>
                        {{ $t('message.ExistingPerson') }}
                    </template>
                    <b-card-text>
                        <ExistingRelative 
                            ref="existingRelativeControl"
                            v-bind:relationType="relationType" 
                            @onError="onError"
                            @relationCreated="relationCreated" />
                    </b-card-text>
                </b-tab>
            </b-tabs>
        </b-card>

        <Loading v-if="busy"/>

        <b-alert variant="danger" v-model="showError">
            {{ errorMessage }}
        </b-alert>

    </b-modal>
 
    <SuggestedRelativeModal ref="suggestedRelativeModal" />
</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import NewRelative from './NewRelative.vue';
import Loading from './../common/Loading.vue';
import NewPersonResponse from '../../models/data/new_person_response';
import ExistingRelative from './ExistingRelative.vue';
import SuggestedRelativeModal from './SuggestedRelativeModal.vue';
import Person from '../../models/data/person';

@Component({
  components: {
      NewRelative,
      Loading,
      ExistingRelative,
      SuggestedRelativeModal,
  },
})
export default class AddRelativeModal extends Vue {

    @Prop({default: ''})
    public title?: string;

    @Prop({default: 1})
    public relationType?: number;

    public busy: boolean = false;

    public showError: boolean = false;

    public errorMessage: string = '';

    public state: string = 'NewPerson';

    public show() {
        (this.$refs.modal as any).show();
    }

    private setState(state: string) {
        this.state = state;
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
        this.showError = false;
        this.busy = true;

        switch (this.state) {
            case 'NewPerson':
                (this.$refs.newRelativeControl as any).submit();
                break;
            case 'ExistingPerson':
                 (this.$refs.existingRelativeControl as any).submit();
                 break;
        }

    }

    private onError(errorMessage: string) {
        window.console.log(`AddRelativeModal.onError()`);

        if (errorMessage) {
            this.showError = true;
            this.errorMessage = errorMessage;
        }

        this.busy = false;
    }

    private personCreated(person: Person) {
        window.console.log(`AddRelativeModal.personCreated()`);

        this.busy = false;

        (this.$refs.modal as any).hide();
        (this.$refs.suggestedRelativeModal as SuggestedRelativeModal).init(person.id);
    }

    private relationCreated() {
        window.console.log(`AddRelativeModal.personCreated()`);

        this.busy = false;

        (this.$refs.modal as any).hide();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
