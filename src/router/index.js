import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Account from '../views/Account.vue'
import Expenses from '../views/Expenses.vue'
import Incomes from '../views/Incomes.vue'
import Savings from '../views/Savings.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/expenses',
      name: 'expenses',
      component: Expenses
    },
    {
      path: '/incomes',
      name: 'incomes',
      component: Incomes
    },
    {
      path: '/savings',
      name: 'savings',
      component: Savings
    },
    {
      path: '/account',
      name: 'account',
      component: Account
      // meta: { requiresAuth: true }
    }
  ]
})

export default router
