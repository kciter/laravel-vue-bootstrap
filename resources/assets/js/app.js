import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$http = axios

// window.axios.defaults.headers.common = {
//     'X-Requested-With': 'XMLHttpRequest'
// };

Vue.component('example', require('./components/Example.vue'))

/* eslint-disable no-new */
new Vue({
  el: '#app'
})
