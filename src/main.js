import CookieComply from './components/CookieComply.vue';

export default {
  install: (Vue) => {
    if (!window) return;

    Vue.component('VueCookieComply', CookieComply)
  },
};
