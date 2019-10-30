<template>
  <div id="app">
    
    <b-navbar id="navbar" toggleable="md" type="dark" 
        variant="primary" v-bind:sticky="false" class="navbar-background">
      <b-navbar-brand to="/">
        <img src="img/logo.png" class="site-logo"/>
        <strong>ok!Kindred</strong>
      </b-navbar-brand>
      
      <b-navbar-toggle target="nav_collapse" />

      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item v-if="logged_in" to="/family/tree/" :disabled="loading">
            <span class="oi oi-people" aria-hidden="true"></span>
            {{ $t("message.Family") }}
          </b-nav-item>
          <b-nav-item v-if="logged_in" to="/gallery/?page=1" :disabled="loading">
            <span class="oi oi-image" aria-hidden="true"></span>
            {{ $t("message.Gallery") }}
          </b-nav-item>
          <b-nav-item v-if="logged_in" @click="searchClicked" :disabled="loading">
            <span class="oi oi-magnifying-glass" aria-hidden="true"></span>
            {{ $t("message.Search") }}
          </b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item to="/about/" :disabled="loading">
            <span class="oi oi-info" aria-hidden="true"></span>
            {{ $t("message.About") }}
          </b-nav-item>
          <b-nav-item v-if="logged_in" to="/accounts/settings/" :disabled="loading">
              <span class="oi oi-cog" aria-hidden="true"></span>
              {{ $t("message.Settings") }}
          </b-nav-item>
          <b-nav-item v-if="logged_in" v-on:click="logout()" href="#" :disabled="loading">
            <span class="oi oi-account-logout" aria-hidden="true"></span>
            {{ $t("message.Logout") }}
          </b-nav-item>
          <b-nav-item v-if="!logged_in" to="/accounts/login/" :disabled="loading">
          <span class="oi oi-account-login" aria-hidden="true"></span>
            {{ $t("message.Login") }}
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <Loading v-show="loading"/>
    <ErrorModal />
    <router-view/>

    <Search ref="searchModal" />
  </div>
</template>

<script lang="ts">
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'open-iconic/font/css/open-iconic-bootstrap.css';

import { Component, Vue } from 'vue-property-decorator';

import Loading from '@/components/common/Loading.vue';
import ErrorModal from './components/common/ErrorModal.vue';
import store from './store/store';
import Search from './components/search/Search.vue';

@Component({
  components: {
    Loading,
    ErrorModal,
    Search,
  },
})
export default class App extends Vue {

  // Computed properties
  get logged_in() {
    return store.state.logged_in;
  }

  get loading() {
    return store.getters.loading;
  }

  protected mounted() {
    // window.console.log('App.vue mounted() call');

    // Reset loading count
    store.state.loading_count = 0;
  }

  private logout(this: any) {
    // window.console.log('logout clicked on');
    this.$store.dispatch('logout');
    this.$router.push('/accounts/login/');
  }

  private searchClicked() {
    (this.$refs.searchModal as Search).show();
  }

}
</script>

<style>
  .navbar-background {
    background-color: #250042 !important;
  }

  .site-logo {
    height: 23px;
    margin-right: 4px;
  }
</style>
