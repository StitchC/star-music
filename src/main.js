import Vue from 'vue';
import App from './App';
import router from './router';
import VueResource from 'vue-resource';
import 'common/stylus/index.styl';
import 'babel-polyfill';
import fastclick from 'fastclick';


Vue.config.productionTip = false;
Vue.use(VueResource);
fastclick.attach(document.body);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
