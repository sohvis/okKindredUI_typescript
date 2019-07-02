import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Login from './views/accounts/Login.vue';
import About from './views/About.vue';
import Family from './views/Family.vue';
import FamilyMapView from './views/FamilyMapView.vue';
import FamilyTreeView from './views/FamilyTreeView.vue';

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
      path: '/about',
      name: 'about',
      component: About,
    },
    {
      path: '/accounts/login/',
      name: 'Login',
      component: Login,
    },
  ],
});
