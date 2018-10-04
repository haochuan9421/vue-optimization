import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const Home = () => import('@/components/Home')
const Contacts = () => import('@/components/Contacts')

export default new Router({
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
