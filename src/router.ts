import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Login from './views/accounts/Login.vue';
import About from './views/About.vue';
import Family from './views/Family.vue';
import Search from './views/Search.vue';
import PasswordReset from './views/accounts/PasswordReset.vue';
import PasswordResetConfirmation from './views/accounts/PasswordResetConfirmation.vue';
import Settings from './views/accounts/Settings.vue';


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/family/',
      name: 'Family',
      component: Family,
    },
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/search/',
      name: 'Search',
      component: Search,
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    },
    {
      path: '/accounts/login/',
      name: 'Login',
      component: Login,
    },
    {
      path: '/accounts/password_reset/',
      name: 'PasswordReset',
      component: PasswordReset,
    },
    {
      path: '/accounts/password_reset_confirmation/',
      name: 'PasswordResetConfirmation',
      component: PasswordResetConfirmation,
    },
    {
      path: '/accounts/settings/',
      name: 'Settings',
      component: Settings,
    },
  ],
});
