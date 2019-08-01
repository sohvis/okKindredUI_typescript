<template>
<b-card no-body>
    <b-tabs card justified>
        <b-tab @click="treeInit()" active>
            <template slot="title">
                <span class="oi oi-people" aria-hidden="true"></span>
                {{ $t('message.Tree') }}
            </template>
            <b-card-text>
                <FamilyTree 
                    ref="tree" />
            </b-card-text>
        </b-tab>
        <b-tab @click="profileInit()">
            <template slot="title">
                <span class="oi oi-person" aria-hidden="true"></span>
                {{ $t('message.Profile') }}
            </template>
            <b-card-text>
                <Profile 
                    ref="profile" />
            </b-card-text>
        </b-tab>
        <b-tab @click="mapInit()">
            <template slot="title">
                <span class="oi oi-map" aria-hidden="true"></span>
                {{ $t('message.Map') }}
            </template>
            <b-card-text>
                <FamilyMap 
                    ref="map" />
            </b-card-text>
        </b-tab>
    </b-tabs>
</b-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as request from 'request-promise-native';
import FamilyTree from '../components/family_tree/FamilyTree.vue';
import FamilyMap from '../components/FamilyMap.vue';
import Profile from '../components/profile/Profile.vue';
import Person from './../models/data/person';
import Relation from './../models/data/relation';
import store from '../store/store';
import { configs } from '../config';
import ProfileEmitArgs from '../models/profile_emit_args';
import NewPersonResponse from '../models/data/new_person_response';

@Component({
  components: {
    FamilyTree,
    FamilyMap,
    Profile,
  },
})
export default class Family extends Vue {

    private state: string = 'tree';

    public treeInit() {
        this.state = 'tree';
        const tree = this.$refs.tree as FamilyTree;
        if (tree) {
            setTimeout(() => tree.initializeTree(), 100);
        }
    }

    public mapInit() {
        this.state = 'map';
        const map = this.$refs.map as any;
        if (map) {
            // Need to set a small delay in order for container to render for Leaflet
            setTimeout(() => map.renderMap(), 100);
        }
    }

    public profileInit() {
        window.console.log(`profileInit()`);
        this.state = 'profile';
        const profile = this.$refs.profile as Profile;
        if (profile) {
            setTimeout(async () => await profile.initialize(), 10);
        }
    }

    protected async mounted() {
      window.console.log('Family.vue mounted() call');
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      await this.initialize();
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    private async initialize() {

        try {
            // Load jwt from cookie and login
            await store.dispatch('restoreSession');

            await this.LoadData();

            switch (this.state) {
                    case 'tree':
                        const tree = this.$refs.tree as FamilyTree;
                        tree.initializeTree();
                        break;
                    case 'map':
                        const map = this.$refs.map as any;
                        map.renderMap();
                        break;
                    case 'details':
                        break;
            }
        } catch {
            this.$router.push('/accounts/login/');
        }
    }

    private async LoadData() {
        try {
            await store.dispatch('loadTreeData');
        } catch (ex) {
            window.console.log(ex);
            store.commit('setErrorMessage', ex);
        }
    }
}
</script>

<!-- "scoped" attribute removed to fill screen -->
<style scoped>
.card-body{
    padding: 0.25em !important;
}
</style>
