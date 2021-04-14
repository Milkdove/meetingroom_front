// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/global.css'
import axios from 'axios'
// import '@/plugins/element'
// axios.defaults.baseURL = 'http://localhost:4000/'

axios.defaults.baseURL = 'http://rap2api.taobao.org/app/mock/data/'

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.$http = axios;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
