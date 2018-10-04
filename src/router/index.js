import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const Home = () => import('@/components/Home')
const Contacts = () => import('@/components/Contacts')

export default new Router({
  mode: 'history', // prerender需要使用history模式
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/Contacts',
      name: 'Contacts',
      component: Contacts
    }
  ]
})
