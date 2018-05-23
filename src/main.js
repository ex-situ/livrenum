/* eslint-disable */
import Vue from 'vue'
import App from './App'
import { sync } from 'vuex-router-sync'
import store from './store/store'
import router from './router'
import Icon from 'vue-awesome/components/Icon'
import axios from 'axios'
import VueCookie from 'vue-cookie'
import bulma from 'bulma'

import 'vue-awesome/icons'
import 'vue-multiselect/dist/vue-multiselect.min.css'

Vue.config.productionTip = false

sync(store, router);

Vue.use(VueCookie)

new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App, Icon, axios }
})
