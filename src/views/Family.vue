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
                    ref="tree" @personRemoved="personRemoved"/>
            </b-card-text>
        </b-tab>
        <b-tab @click="profileInit()">
            <template slot="title">
                <span class="oi oi-person" aria-hidden="true"></span>
                {{ $t('message.Profile') }}
            </template>
            <b-card-text>
                <Profile 
                    ref="profile"
                    @personUpdated="personUpdated"/>
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

@Component({
  components: {
    FamilyTree,
    FamilyMap,
    Profile,
  },
})
export default class Family extends Vue {
    public people: Person[] = [];
    public relations: Relation[] = [];

    private state: string = 'tree';

    public treeInit() {
        this.state = 'tree';
        const tree = this.$refs.tree as FamilyTree;
        if (tree && this.people && this.relations) {
            setTimeout(() => tree.initializeTree(this.people, this.relations), 100);
        }
    }

    public mapInit() {
        this.state = 'map';
        const map = this.$refs.map as any;
        if (map && this.people) {
            // Need to set a small delay in order for container to render for Leaflet
            setTimeout(() => map.renderMap(this.people), 100);
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

    private personUpdated(args: ProfileEmitArgs) {
        for (let i = 0; i < this.people.length; i++) {
            const person = this.people[i];
            if (person && args.person) {
                if (person.id === args.person.id) {
                    this.people[i] = args.person;
                }
            }
        }
    }

    private async initialize() {
      // Load jwt from cookie and login
      store.dispatch('restoreSession')
          .then(async (loggedIn) => {

          window.console.log(`loggedIn: ${loggedIn}`);

          if (loggedIn) {

            await this.LoadData();

            switch (this.state) {
                case 'tree':
                    const tree = this.$refs.tree as FamilyTree;
                    tree.initializeTree(this.people, this.relations);
                    break;
                case 'map':
                    const map = this.$refs.map as any;
                    map.renderMap(this.people);
                    break;
                case 'details':
                    break;
            }

          } else {
            this.$router.push('/accounts/login/');
          }
      });
    }

    private async LoadData() {

        try {
            const task1 = this.LoadPersonData();
            const task2 = this.LoadRelationsData();

            await task1;
            await task2;

            window.console.log(this.people);
            window.console.log(this.relations);
        } catch (ex) {
            window.console.log(ex);
            store.commit('setErrorMessage', ex);
        }
    }

    private async LoadPersonData() {

      window.console.log('LoadPersonData() call');

      store.commit('updateLoading', true);

      const options = {
          uri: `${configs.BaseApiUrl}${configs.PersonAPI}`,
          headers: store.getters.ajaxHeader,
          json: true,
      };

      this.people = await request.get(options);

      store.commit('updateLoading', false);
    }

    private async LoadRelationsData() {
      window.console.log('LoadRelationsData() call');

      store.commit('updateLoading', true);

      const options = {
          uri: `${configs.BaseApiUrl}${configs.RelationAPI}`,
          headers: store.getters.ajaxHeader,
          json: true,
      };

      this.relations = await request.get(options);

      store.commit('updateLoading', false);
    }

    private personRemoved(personId: number) {

      // Remove relations
      const relationsToRemove = new Array<Relation>();
      for (const rel of this.relations) {
        if (rel.from_person_id === personId || rel.to_person_id === personId) {
          relationsToRemove.push(rel);
        }
      }

      this.relations = this.relations.filter((i) => !relationsToRemove.includes(i));
      this.people = this.people.filter((i) => Number(i.id) !== personId);

      const selectedPersonId = this.getNextPersonId(relationsToRemove);

      store.dispatch('changePerson', selectedPersonId).then(() => {
            const tree = this.$refs.tree as FamilyTree;
            tree.initializeTree(this.people, this.relations);
      });
    }

    private getNextPersonId(relationsToRemove: Relation[]): number {

      // Change selected person to closest relative, default to user id if not possible
      const selectedPersonId = store.state.users_person_id;

      for (const rel of relationsToRemove) {
        if (this.people
            .filter((p) => Number(p.id) === Number(rel.from_person_id))
            .length) {
                return Number(rel.from_person_id);
            }

        if (this.people
            .filter((p) => Number(p.id) === Number(rel.to_person_id))
            .length) {
                return Number(rel.to_person_id);
            }
      }

      return Number(selectedPersonId);
    }
}
</script>

<!-- "scoped" attribute removed to fill screen -->
<style scoped>
.card-body{
    padding: 0.25em !important;
}
</style>
