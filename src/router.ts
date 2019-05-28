import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Login from './views/accounts/Login.vue';
import FamilyMap from './views/FamilyMap.vue';
import FamilyTree from './views/FamilyTree.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/tree/',
      name: 'FamilyTree',
      component: FamilyTree,
    },
    {
      path: '/accounts/login/',
      name: 'Login',
      component: Login,
    },
    {
      path: '/map/',
      name: 'FamilyMap',
      component: FamilyMap,
    },
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
  ],
});
