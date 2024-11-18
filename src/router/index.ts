import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '/ingredients',
          name: 'ingredients',
          component: () => import('../views/ingredients/index.vue')
        }, 
        {
          path: '/dishes',
          name: 'dishes',
          component: () => import('../views/dishes/index.vue')
        },
        {
          path: '/prepare',
          name: 'prepare',
          component: () => import('../views/prepare/index.vue')
        },
        {
          path: '/order',
          name: 'order',
          component: () => import('../views/order/index.vue')
        }

      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/index.vue')
    }
  ]
})

export default router
