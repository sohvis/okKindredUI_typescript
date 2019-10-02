<template>
  <div class="home">
    <Introduction />
    <AboutComponent />
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
import { i18n } from '../main';
import { localeMatch } from '../localization/localization';
import Introduction from '@/components/Introduction.vue';
import AboutComponent from '@/components/AboutComponent.vue';
import store from '../store/store';

@Component({
  components: {
    Introduction,
    AboutComponent,
  },
})
export default class Home extends Vue {

  protected async mounted() {
    // window.console.log(`Home.mounted()`);

    try {
        // Load jwt from cookie and login
        await store.dispatch('restoreSession');
        this.$router.push('/family/tree/');

    } catch {
        // not logged in, set language from browser
        i18n.locale = localeMatch.match(navigator.language);
    }
  }
}
</script>
