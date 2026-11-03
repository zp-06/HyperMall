import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('@/views/Home.vue'), meta: { title: '首页' } },
      { path: 'item/:id', name: 'item-detail', component: () => import('@/views/ItemDetail.vue'), meta: { title: '商品详情' } },
      { path: 'cart', name: 'cart', component: () => import('@/views/Cart.vue'), meta: { title: '购物车', requiresAuth: true } },
      { path: 'checkout', name: 'checkout', component: () => import('@/views/Checkout.vue'), meta: { title: '确认订单', requiresAuth: true } },
      { path: 'pay/:orderId', name: 'pay', component: () => import('@/views/Pay.vue'), meta: { title: '订单支付', requiresAuth: true } },
      { path: 'order/:id', name: 'order-detail', component: () => import('@/views/OrderDetail.vue'), meta: { title: '订单详情', requiresAuth: true } },
      { path: 'address', name: 'address', component: () => import('@/views/AddressList.vue'), meta: { title: '收货地址', requiresAuth: true } },
    ],
  },
  { path: '/login', name: 'login', component: () => import('@/views/Login.vue'), meta: { title: '登录' } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFound.vue'), meta: { title: '页面不存在' } },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const userStore = useUserStore()
  if (to.meta.requiresAuth && !userStore.isLogin) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  if (to.path === '/login' && userStore.isLogin) {
    return { path: '/' }
  }
  document.title = to.meta.title ? `${to.meta.title} · 惠商城` : '惠商城'
  return true
})

export default router
