<template>
  <FamilyTree />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import FamilyTree from '../components/FamilyTree.vue';

@Component({
  components: {
    FamilyTree,
  },
})
export default class FamilyTreeView extends Vue {}
</script>

