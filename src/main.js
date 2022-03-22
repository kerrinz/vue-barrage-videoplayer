import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

const GLOBAL_VM = new Vue({
  render: h => h(App),
}).$mount('#app')

export default GLOBAL_VM