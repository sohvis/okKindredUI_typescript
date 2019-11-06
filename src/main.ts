import Vue from 'vue';
import App from './App.vue';

import BootstrapVue from 'bootstrap-vue';
import VueI18n from 'vue-i18n';
import router from './router';

import { configs } from './config';
import { messages } from './localization/localization';
import store from './store/store';
import AndroidImage from './models/data/android_image';

// tslint:disable-next-line:max-line-length
// https://stackoverflow.com/questions/41292559/could-not-find-a-declaration-file-for-module-module-name-path-to-module-nam
const vueConfig = require('vue-config');
const vueLocalStorage = require('vue-localstorage');

Vue.config.productionTip = false;

Vue.use(vueConfig, configs);
Vue.use(BootstrapVue);
Vue.use(VueI18n);
Vue.use(vueLocalStorage);


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

(window as any).viewModel.navigateTo = (route: string) => {
  const vm = (window as any).viewModel as any;
  vm.$store.dispatch('setInitialRoute', route);
};

(window as any).viewModel.uploadFiles = async (androidImages: AndroidImage[]) => {

  try {
    const vm = (window as any).viewModel as any;
    vm.$store.commit('updateLoading', true);

    vm.navigateTo('/select_gallery/');

    const files = new Array<File>();
    for (const androidImage of androidImages) {

      const res = await fetch(androidImage.base64Image);
      const blob = await res.arrayBuffer();

      const file = new File([blob], androidImage.fileName, {type: androidImage.mimeType});

      files.push(file);
    }

    vm.$store.dispatch('setFilesToUpload', files);

  } finally {
    const vm = (window as any).viewModel as any;
    vm.$store.commit('updateLoading', false);
  }
};
