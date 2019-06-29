<template>
  <div class="about">
    <AboutComponent />
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
import AboutComponent from '@/components/AboutComponent.vue';

@Component({
  components: {
    AboutComponent,
  },
})
export default class About extends Vue {}
</script>
