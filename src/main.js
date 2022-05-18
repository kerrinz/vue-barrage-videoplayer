import Vue from 'vue'
import App from './App.vue'
import router from './router/index'

Vue.config.productionTip = false

const GLOBAL_VM = new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

export default GLOBAL_VM