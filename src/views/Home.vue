<template>
  <div class="home">
    <Loading v-if="!loaded" />
    <Introduction v-if="loaded" />
    <AboutComponent v-if="loaded" />
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
import { i18n } from '../main';
import { localeMatch } from '../localization/localization';
import Loading from '@/components/common/Loading.vue';
import Introduction from '@/components/Introduction.vue';
import AboutComponent from '@/components/AboutComponent.vue';
import store from '../store/store';
import BrowserDetection from '../models/browserDetection';

@Component({
  components: {
    Loading,
    Introduction,
    AboutComponent,
  },
})
export default class Home extends Vue {

  public loaded: boolean = false;

  protected async mounted() {
    // window.console.log(`Home.mounted()`);

    try {
        // Load jwt from cookie and login
        if (!store.state.initialRoute) {
          await store.dispatch('restoreSession');
        }

        if (!store.state.initialRoute) {
          this.$router.push('/family/tree/');
        }
    } catch {
        // not logged in, set language from browser
        i18n.locale = localeMatch.match(navigator.language);

        // If on an app, then
        if (BrowserDetection.isAndroidWebView()) {
          this.$router.push('/accounts/sign_up/');
        }
    }

    this.loaded = true;
  }
}
</script>

<style scoped>
</style>
