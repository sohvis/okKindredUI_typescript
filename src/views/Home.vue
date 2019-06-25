<template>
  <div class="home">
    <Introduction/>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
import Introduction from '@/components/Introduction.vue';

@Component({
  components: {
    Introduction,
  },
})
export default class Home extends Vue {}
</script>
