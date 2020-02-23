<template>
    <div class="profile-relation-names" v-if="relations.length > 0 && !loading">
        <h5 v-if="relations.length == 1" >{{ $t('message.RelationName') }}</h5>
        <h5 v-if="relations.length > 1" >{{ $t('message.RelationNames') }}</h5>
        <table class="table">
            <thead>
                <tr>
                    <th></th>
                    <th>{{ $t('message.Cantonese') }}</th>
                    <th>{{ $t('message.Jyutping') }}</th>
                    <th>{{ $t('message.Mandarin') }}</th>
                    <th>{{ $t('message.Pinyin') }}</th>
                </tr>
            </thead>
            <ProfileRelationName v-for="rel in relations" :key="rel.name" :relation="rel"/>
        </table>
    </div>
</template>

<script lang="ts">

import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import * as request from 'request-promise-native';

import { configs } from '../../config';
import store from '../../store/store';
import ChineseRelationName from '../../models/data/chinese_relation_name';

import ProfileRelationName from './ProfileRelationName.vue';

@Component({
  components: {
      ProfileRelationName,
  },
})
export default class ProfileRelationNames extends Vue {

    public relations: ChineseRelationName[] = [];

    public get selectedPersonId(): string {
        return store.state.person_id;
    }

    public get loading() {
        return store.getters.loading;
    }

    public async initialise() {
        window.console.log(`ProfileRelationNames.initialise()`);

        const options = {
            uri: `${configs.BaseApiUrl}${configs.RelationNamesAPI}${store.state.users_person_id}/${store.state.person_id}/`,
            headers: store.getters.ajaxHeader,
            json: true,
        };

        this.relations = await request.get(options) as ChineseRelationName[];
    }
}
</script>

<!-- "scoped" attribute removed to fill screen -->
<style scoped>
.profile-relation-names {
    margin-top: 2em;
}
</style>
