<template>
  <FamilyMap />
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
import FamilyMap from '../components/FamilyMap.vue';

@Component({
  components: {
    FamilyMap,
  },
})
export default class FamilyMapView extends Vue {}
</script>
