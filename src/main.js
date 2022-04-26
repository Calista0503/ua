import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './permission' // permission control
import './plugins/element.js'
import './plugins/clipboard.js'
import {
  PROJECTNAME
} from '@/utils/config';
import i18n from './i18n/i18n';


import './styles/index.scss' // global css
import './extend';
import './filters'; // 全局过滤器


document.title = PROJECTNAME;

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')
