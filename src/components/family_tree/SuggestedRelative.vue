<template>
<div>
    <div class="image-container">
        <div class="prediction-image-left">
            <img :src="relationPrediction.fromPersonImage" />
            <div>
                <small>{{ relationPrediction.fromPersonName }}</small>
            </div>
        </div>
        <div class="prediction-image-right">
            <img :src="relationPrediction.toPersonImage"/>
            <div>
                <small>{{ relationPrediction.toPersonName }}</small>
            </div>
        </div>
    </div>


    <h5 v-if="partnered">
        {{ $t('message.AreXandYPartners', relationPrediction) }}
    </h5>

    <h5 v-if="raised">
        {{ $t('message.DidXraiseY', relationPrediction) }}
    </h5>

</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import store from '../../store/store';
import { configs } from '../../config';
import RelationPrediction from '../../models/relation_predicter/relation_prediction';
import Relation from '../../models/data/relation';
import RelationTypes from '../../models/data/relation_types';

@Component
export default class SuggestedRelative extends Vue {

    @Prop({default: null})
    public relationPrediction?: RelationPrediction;

    public get partnered(): boolean {

        if (!this.relationPrediction) {
            return false;
        }

        return this.relationPrediction.relationType === RelationTypes.PARTNERED;
    }

    public get raised(): boolean {

        if (!this.relationPrediction) {
            return false;
        }

        return this.relationPrediction.relationType === RelationTypes.RAISED;
    }

    public async submit() {
        // window.console.log(`SuggestedRelative.submit()`);

        if (!this.relationPrediction) {
            this.$emit('onError');
            return;
        }


        const selectedPersonId = store.state.person_id;

        const options: AxiosRequestConfig = {
            url: `${configs.BaseApiUrl}${configs.RelationAPI}`,
            headers: store.getters.ajaxHeader,
            data: {
                from_person_id: this.relationPrediction.fromPerson.id,
                relation_type: this.relationPrediction.relationType,
                to_person_id: this.relationPrediction.toPerson.id,
            },
            method: 'POST',
            responseType: 'json',
        };

        const response = await axios.request(options) as AxiosResponse<Relation>;
        store.dispatch('addRelations', [response.data]);
    }

    protected mounted() {
        // window.console.log(`SuggestedRelative.mounted()`);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.image-container {
    overflow: hidden;
    height: 180px;
    margin-bottom: 30px;
}

.prediction-image-left {
    float: left;
    margin-left: 20px;
    border-style: solid;
    border-width: 2px;
    border-color: #2e6f9a;
    padding: 20px;
    border-radius: 20px;
}

.prediction-image-right {
    float: right;
    margin-right: 20px;
    border-style: solid;
    border-width: 2px;
    border-color: #2e6f9a;
    padding: 20px;
    border-radius: 20px;
}

</style>
