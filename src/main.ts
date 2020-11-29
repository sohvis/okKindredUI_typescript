import Vue from 'vue';
import App from './App.vue';

import BootstrapVue from 'bootstrap-vue';
import VueI18n from 'vue-i18n';
import router from './router';

import { configs } from './config';
import { messages } from './localization/localization';
import store from './store/store';
import MainApi from './main_api';

// tslint:disable-next-line:max-line-length
// https://stackoverflow.com/questions/41292559/could-not-find-a-declaration-file-for-module-module-name-path-to-module-nam
const vueConfig = require('vue-config');

Vue.config.productionTip = false;

Vue.use(vueConfig, configs);
Vue.use(BootstrapVue);
Vue.use(VueI18n);


// Create VueI18n instance with options
export const i18n = new VueI18n({
  locale: store.getters.language, // set locale
  messages, // set locale messages
});


// Add vue js to global variables so callable outside app
(window as any).viewModel = new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

MainApi.Setup((window as any).viewModel);
