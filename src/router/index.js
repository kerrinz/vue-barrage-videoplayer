import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export const constantRouterMap = [
    {
        path: '/',
        redirect: '/simple',
        component: require('@/views/home.vue').default,
        children: [
            {
                path: '/simple',
                name: '简单示例',
                component: require('@/views/preview-simple.vue').default,
            },
            {
                path: '/mpegts',
                name: '引入mpegts.js',
                component: require('@/views/preview-mpegts.vue').default,
            },
        ],
    },
];

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: constantRouterMap
})

