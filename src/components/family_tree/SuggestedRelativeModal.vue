<template>
    <b-modal
        ref="modal"
        centered 
        v-bind:no-close-on-esc="true"
        v-bind:no-close-on-backdrop="true">

        <template slot="modal-header">
            <h4>{{ $t('message.SuggestedRelations') }}</h4>
        </template>

        <template slot="default">
            <div v-for="relationPrediction of relationPredictions" 
                    :key="relationPrediction.id">
                <SuggestedRelative
                    :ref="'SuggestRelative' + relationPrediction.id"
                    v-if="selectedId === relationPrediction.id"
                    v-bind:relationPrediction="relationPrediction" 
                    @onError = "onError"/>
            </div>
        </template>

        <template slot="modal-footer">
            <!-- Emulate built in modal footer ok and cancel button actions -->
            <b-button size="lg" variant="primary" @click="onYes()">
                {{ $t('message.Yes') }}
            </b-button>
            <b-button size="lg" variant="primary" @click="onNo()">
                {{ $t('message.No') }}
            </b-button>
        </template>

        <Loading v-if="busy"/>

        <b-alert variant="danger" v-model="showError">
            {{ errorMessage }}
        </b-alert>
    </b-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import * as request from 'request-promise-native';
import store from '../../store/store';
import { configs } from '../../config';
import RelationPrediction from '../../models/relation_predicter/relation_prediction';
import RelationPredictor from '../../models/relation_predicter/relation_predictor';
import Relation from '../../models/data/relation';
import RelationTypes from '../../models/data/relation_types';
import SuggestedRelative from './SuggestedRelative.vue';
import Loading from '../common/Loading.vue';

@Component({
  components: {
    SuggestedRelative,
    Loading,
  },
})
export default class SuggestedRelativeModal extends Vue {

    public relationPredictions: RelationPrediction[] = [];

    public selectedIndex: number = 0;

    public get selectedId(): string {
        return this.relationPredictions[this.selectedIndex].id;
    }

    public busy: boolean = false;

    public errorMessage: string = '';

    public get showError() {
        if (this.errorMessage && this.errorMessage.length > 0) {
            return true;
        }
        return false;
    }

    public init(addAddedPersonId: string) {

        this.busy = true;
        const people = store.state.people;
        const relations = store.state.relations;

        const predictor = new RelationPredictor(people, relations, addAddedPersonId);
        this.relationPredictions = predictor.getAllRelationshipSuggestions();

        if (this.relationPredictions.length > 0) {
            this.selectedIndex = 0;
            (this.$refs.modal as any).show();
        }

        this.busy = false;
    }

    protected mounted() {
        // window.console.log(`SuggestedRelativeModal.mounted()`);
    }

    private async onYes() {
        // window.console.log(`SuggestedRelativeModal.onYes()`);

        this.busy = true;
        this.errorMessage = '';

        const predictionControl = 'SuggestRelative' + this.selectedId;
        // window.console.log(this.$refs[predictionControl]);

        try {
            await ((this.$refs[predictionControl] as Vue[])[0] as SuggestedRelative).submit();
            this.moveNext();

        } catch (ex) {
            // window.console.log(ex);
            this.errorMessage = ex.toString();
        }

        this.busy = false;
    }

    private onNo() {
        // window.console.log(`SuggestedRelativeModal.onNo()`);
        this.moveNext();
    }

    private moveNext() {
        // window.console.log(`SuggestedRelativeModal.onNo()`);
        if (this.selectedIndex < this.relationPredictions.length - 1) {
            this.selectedIndex++;
        } else {
            (this.$refs.modal as any).hide();
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
