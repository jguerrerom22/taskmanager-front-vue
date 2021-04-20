import moment from 'moment'
import Vue from 'vue'
import App from './App'
import router from './router'

import BootstrapVue from 'bootstrap-vue'

import globals from './globals'
import Popper from 'popper.js'

import VueSession from 'vue-session'
import JsonExcel from 'vue-json-excel'
Vue.use(VueSession, { persist: true })

Vue.component('downloadExcel', JsonExcel)

// Required to enable animations on dropdowns/tooltips/popovers
Popper.Defaults.modifiers.computeStyle.gpuAcceleration = false

Vue.config.productionTip = false

Vue.use(BootstrapVue)

// Global RTL flag
Vue.mixin({
  data: globals
})

// Filters
Vue.filter('formatDate', function (value) {
  if (value) {
    moment.locale('es-es')
    return moment(String(value)).format('DD MMM YYYY')
  }
})

Vue.filter('longFormatDate', function (value) {
  if (value) {
    return moment(String(value)).format('MM/DD/YY h:mm A')
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
