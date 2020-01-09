import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

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
      component: () => import('../views/Expenses.vue')
    },
    {
      path: '/incomes',
      name: 'incomes',
      component: () => import('../views/Incomes.vue')
    },
    {
      path: '/savings',
      name: 'savings',
      component: () => import('../views/Savings.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue')
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('../views/Account.vue')
      // meta: { requiresAuth: true }
    }
  ]
})

export default router
