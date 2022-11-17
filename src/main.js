import CookieComply from './components/CookieComply.vue';
import { isVue2, Vue2 } from 'vue-demi'

export default {
  install: (app) => {
    if (!window) return;

    if (isVue2) {
      // Vue 2 only
      Vue2.component(CookieComply)
    } else {
      // Vue 3 only
      app.component('VueCookieComply', CookieComply);
    }
  },
};
