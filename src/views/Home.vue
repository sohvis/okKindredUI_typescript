<template>
  <div class="home">
    <Introduction />
    <AboutComponent />
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
import Introduction from '@/components/Introduction.vue';
import AboutComponent from '@/components/AboutComponent.vue';

@Component({
  components: {
    Introduction,
    AboutComponent,
  },
})
export default class Home extends Vue {}
</script>
