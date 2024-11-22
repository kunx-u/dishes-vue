import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import {useTokenStore} from '@/stores/useTokenStore'
import {ElMessage} from "element-plus";

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

/**
 * 全局前置路由守卫: 进入哪个路由前都会先执行这个方法
 * to: 即将进入的路由
 * from: 来自哪个路由
 * - 访问的路由是不是登录路由"/login"
 *   1、是登录路由: 判断有没有登录
 *      登录了  跳转到首页
 *      没登录  直接进入登录路由
 *   2、不是登录路由: 判断有没有登录
 *      登录了  直接进入该路由    在用户登录状态下访问/order, 则切换到/order路由
 *      没登录  直接进入登录路由   跳转到登录路由
 */
router.beforeEach((to, from) => {
  const tokenStore = useTokenStore()
  const {path, fullPath} = to
  if (path == '/login') {
    if (tokenStore.getToken) {
      return {path: '/'}
    }
  } else {
    if (!tokenStore.getToken) {
      ElMessage.warning('您还未登录，请登录后操作')
      return {path: '/login', query: {destPath: fullPath}}
    }
  }
})

export default router
