import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import UserProfile from '../components/UserProfile.vue'
import MessageCenter from '../components/MessageCenter.vue'
import Conversation from '../components/Conversation.vue'
import UserAlbum from '../components/UserAlbum.vue'

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: UserProfile,
    meta: { requiresAuth: true }
  },
  {
    path: '/messages',
    name: 'MessageCenter',
    component: MessageCenter,
    meta: { requiresAuth: true }
  },
  {
    path: '/conversation/:id',
    name: 'Conversation',
    component: Conversation,
    meta: { requiresAuth: true }
  },
  {
    path: '/album',
    name: 'UserAlbum',
    component: UserAlbum,
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 添加全局前置守卫
router.beforeEach((to, from, next) => {
  // 检查用户是否已登录（这里简单模拟，实际应该检查token或session）
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  
  // 如果路由需要认证且用户未登录，则重定向到登录页
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router