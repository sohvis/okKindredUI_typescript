<template>
<b-card no-body>
    <b-tabs card justified>
        <b-tab title="Tree" @click="treeInit()" active>
            <b-card-text>
                <FamilyTree 
                    ref="tree"/>
            </b-card-text>
        </b-tab>
        <b-tab title="Details" @click="detailsInit()">
            <b-card-text>
                <FamilyDetails />
            </b-card-text>
        </b-tab>
        <b-tab title="Map" @click="mapInit()">
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
import FamilyTree from '../components/FamilyTree.vue';
import FamilyMap from '../components/FamilyMap.vue';
import FamilyDetails from '../components/FamilyDetails.vue';
import Person from './../models/data/person';
import Relation from './../models/data/relation';

@Component({
  components: {
    FamilyTree,
    FamilyMap,
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
            tree.initializeTree(this.people, this.relations);
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

    public detailsInit() {
        this.state = 'details';
    }

    protected mounted() {
      window.console.log('Family.vue mounted() call');
      this.initialize();
    }

    private initialize() {
      // Load jwt from cookie and login
      this.$store.dispatch('restoreSession')
          .then(async (loggedIn) => {

          window.console.log(`loggedIn: ${loggedIn}`);

          if (loggedIn) {

            const task1 = this.LoadPersonData();
            const task2 = this.LoadRelationsData();

            await task1;
            await task2;

            window.console.log(this.people);
            window.console.log(this.relations);

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

    private async LoadPersonData(this: any) {

      window.console.log('LoadPersonData() call');

      this.$store.commit('updateLoading', true);

      const options = {
          uri: `${this.$config.BaseApiUrl}${this.$config.PersonAPI}`,
          headers: this.$store.getters.ajaxHeader,
          json: true,
      };

      this.people = await request.get(options);

      this.$store.commit('updateLoading', false);
    }

    private async LoadRelationsData(this: any) {
      window.console.log('LoadRelationsData() call');

      this.$store.commit('updateLoading', true);

      const options = {
          uri: `${this.$config.BaseApiUrl}${this.$config.RelationAPI}`,
          headers: this.$store.getters.ajaxHeader,
          json: true,
      };

      this.relations = await request.get(options);

      this.$store.commit('updateLoading', false);
    }
}
</script>

<!-- "scoped" attribute removed to fill screen -->
<style scoped>
.card-body{
    padding: 0.25em !important;
}
</style>
