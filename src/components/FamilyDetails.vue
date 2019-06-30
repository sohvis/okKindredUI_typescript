<template>
  <div class="container">
    Under development
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Promise } from 'q';
import Person from './../models/data/person';
import * as request from 'request-promise-native';


@Component
export default class FamilyDetails extends Vue {

    public person!: Person;

    public loadPersonDetails() {
        window.console.log('FamilyDetails.vue loadPersonDetails() called');
    }

    protected mounted() {
      window.console.log('FamilyDetails.vue mounted() called');
    }

}
</script>

<!-- "scoped" attribute removed to fill screen -->
<style scoped>
</style>
