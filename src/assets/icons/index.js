import Vue from 'vue'
import SvgIcon from './svg-icon' // svg组件

// 注册为全局组件
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)