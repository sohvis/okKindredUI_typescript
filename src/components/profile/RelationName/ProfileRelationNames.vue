<template>
    <div class="profile-relation-names" v-if="relations.length > 0 && !loading">
        <h5 v-if="relations.length == 1" >{{ $t('message.RelationName') }}</h5>
        <h5 v-if="relations.length > 1" >{{ $t('message.RelationNames') }}</h5>
        <b-tabs content-class="mt-3">
            <b-tab :title="$t('message.Cantonese')" 
                :active="selectedChineseDialect==='cantonese'" 
                @click="selectedChineseDialect='cantonese'">
                <CantoneseRelationName :relations="relations"/>
            </b-tab>
            <b-tab :title="$t('message.Mandarin')" 
                :active="selectedChineseDialect==='mandarin'" 
                @click="selectedChineseDialect='mandarin'">
                <MandarinRelationName :relations="relations"/>
            </b-tab>
        </b-tabs>
    </div>
</template>

<script lang="ts">

import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import * as request from 'request-promise-native';

import { configs } from '../../../config';
import store from '../../../store/store';
import ChineseRelationName from '../../../models/data/chinese_relation_name';

import CantoneseRelationName from './CantoneseRelationName.vue';
import MandarinRelationName from './MandarinRelationName.vue';

@Component({
  components: {
      CantoneseRelationName,
      MandarinRelationName,
  },
})
export default class ProfileRelationNames extends Vue {

    public relations: ChineseRelationName[] = [];

    public get selectedChineseDialect() {
        return store.state.selectedChineseDialect;
    }

    public set selectedChineseDialect(selectedChineseDialect: string) {
        store.dispatch('setChineseDialect', selectedChineseDialect);
    }

    public get selectedPersonId(): string {
        return store.state.person_id;
    }

    public get loading() {
        return store.getters.loading;
    }

    public async initialise() {
        // window.console.log(`ProfileRelationNames.initialise()`);

        if (store.state.users_person_id !== store.state.person_id) {
            const options = {
                uri: `${configs.BaseApiUrl}${configs.RelationNamesAPI}${store.state.users_person_id}/${store.state.person_id}/`,
                headers: store.getters.ajaxHeader,
                json: true,
            };

            this.relations = await request.get(options) as ChineseRelationName[];
        } else {
            this.relations = [];
        }
    }
}
</script>

<!-- "scoped" attribute removed to fill screen -->
<style scoped>
.profile-relation-names {
    margin-top: 2em;
}
</style>
