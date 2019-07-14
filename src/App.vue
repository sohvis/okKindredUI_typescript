<template>
  <div id="app">
    
    <b-navbar id="navbar" toggleable="md" type="dark" variant="primary" v-bind:sticky="true" class="navbar-background">
      <b-navbar-brand href="/"><strong>ok!Kindred {{debugMessage}}</strong></b-navbar-brand>
      
      <b-navbar-toggle target="nav_collapse" />

      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item v-if="logged_in" to="/family/">
            <span class="oi oi-people" aria-hidden="true"></span>
            {{ $t("message.Family") }}
          </b-nav-item>
          <b-nav-item v-if="logged_in" href="#">
            <span class="oi oi-image" aria-hidden="true"></span>
            {{ $t("message.Gallery") }}
          </b-nav-item>
          <b-nav-item v-if="logged_in" href="#">
            <span class="oi oi-magnifying-glass" aria-hidden="true"></span>
            {{ $t("message.Search") }}
          </b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item to="/about/">
            <span class="oi oi-info" aria-hidden="true"></span>
            {{ $t("message.About") }}
          </b-nav-item>
          <b-nav-item v-if="logged_in" href="#">
              <span class="oi oi-cog" aria-hidden="true"></span>
              {{ $t("message.Settings") }}
          </b-nav-item>
          <b-nav-item v-if="logged_in" v-on:click="logout()" href="#">
            <span class="oi oi-account-logout" aria-hidden="true"></span>
            {{ $t("message.Logout") }}
          </b-nav-item>
          <b-nav-item v-if="!logged_in" to="/accounts/login/">
          <span class="oi oi-account-login" aria-hidden="true"></span>
            {{ $t("message.Login") }}
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <Loading v-show="loading"/>
    <ErrorModal v-bind:errorMessage="errorMessage"/>
    <router-view/>

  </div>
</template>

<script lang="ts">
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'open-iconic/font/css/open-iconic-bootstrap.css';

import { Component, Vue } from 'vue-property-decorator';

import Loading from '@/components/common/Loading.vue';
import ErrorModal from './components/common/ErrorModal.vue';

@Component({
  components: {
    Loading,
    ErrorModal,
  },
})
export default class App extends Vue {

  // Computed properties
  get logged_in(this: any) {
    return this.$store.state.logged_in;
  }

  get loading(this: any) {
    return this.$store.getters.loading;
  }

  get errorMessage(this: any) {
    return this.$store.state.error_message;
  }

  get debugMessage(this: any) {
    return this.$store.state.debug_message;
  }

  protected mounted() {
    window.console.log('App.vue mounted() call');
  }

  private logout(this: any) {
    window.console.log('logout clicked on');
    this.$store.dispatch('logout')
    .then(() => {
      this.$router.push('/accounts/login/');
    });
  }

}
</script>

<style>
  .navbar-background {
    background-color: #250042 !important;
  }

</style>
