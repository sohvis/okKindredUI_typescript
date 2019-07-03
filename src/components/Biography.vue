<template>
    <div class="col-md-12">
        <h4>{{ $t('message.Biography') }}</h4>
        <!-- <b-button class="btn-profile" variant="primary" v-if="!locked">
            <span class="oi oi-pencil" aria-hidden="true"></span>
        </b-button> -->
        <p v-html="biographyDisplay">
        </p>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Person from './../models/data/person';

@Component
export default class Biography extends Vue {

  @Prop({default: ''})
  public biography?: string;

  get biographyDisplay(): string {
    if (!this.biography) {
      return this.$t('message.BiographyNotExist').toString();
    }

    return this.biography;
  }

  @Prop({default: false})
  public locked?: boolean;

  protected mounted() {
    window.console.log('Biography.vue mounted() called');
  }
}
</script>

<!-- "scoped" attribute removed to fill screen -->
<style scoped>

</style>
