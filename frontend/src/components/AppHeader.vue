<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, ShoppingBag, ShoppingCart, ArrowDown, Location } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/utils/format'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const cartStore = useCartStore()

const keyword = ref(route.query.key || '')

watch(
  () => route.query.key,
  (key) => {
    keyword.value = key || ''
  },
)

function goSearch() {
  const q = keyword.value?.trim() ? { key: keyword.value.trim() } : {}
  router.push({ path: '/', query: q })
}

function goLogin() {
  router.push({ path: '/login', query: { redirect: route.fullPath } })
}

function logout() {
  userStore.logout()
  cartStore.reset()
  ElMessage.success('已退出登录')
  router.push('/')
}
</script>

<template>
  <header class="app-header">
    <div class="hm-container header-inner">
      <router-link to="/" class="logo">
        <el-icon :size="26" color="#fff"><ShoppingBag /></el-icon>
        <span class="logo-text">惠商城</span>
        <span class="logo-sub">HyperMall</span>
      </router-link>

      <div class="search">
        <el-input
          v-model="keyword"
          size="large"
          placeholder="搜索商品，支持分词（如：手机 / 华为）"
          clearable
          @keyup.enter="goSearch"
        >
          <template #append>
            <el-button :icon="Search" @click="goSearch" />
          </template>
        </el-input>
      </div>

      <nav class="nav">
        <router-link to="/" class="nav-link" :class="{ active: route.path === '/' }">首页</router-link>

        <router-link to="/cart" class="nav-link cart-link" :class="{ active: route.path === '/cart' }">
          <el-badge :value="cartStore.count" :hidden="!cartStore.count" :max="99" class="cart-badge">
            <el-icon :size="22"><ShoppingCart /></el-icon>
            <span>购物车</span>
          </el-badge>
        </router-link>

        <el-dropdown v-if="userStore.isLogin" trigger="click" class="user">
          <span class="user-trigger">
            <el-avatar :size="28" class="avatar">{{ userStore.username.slice(0, 1).toUpperCase() }}</el-avatar>
            <span class="user-name">{{ userStore.username }}</span>
            <el-icon :size="12"><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item disabled>
                <span class="balance">余额：{{ formatPrice(userStore.balance) }}</span>
              </el-dropdown-item>
              <el-dropdown-item divided :icon="Location" @click="router.push('/address')">收货地址</el-dropdown-item>
              <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-button v-else type="primary" round @click="goLogin">登录 / 注册</el-button>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}
.header-inner {
  height: 64px;
  display: flex;
  align-items: center;
  gap: 32px;
}
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 10px;
  background: linear-gradient(135deg, #e5483a, #f4754c);
  flex-shrink: 0;
}
.logo-text {
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 1px;
}
.logo-sub {
  color: rgba(255, 255, 255, 0.85);
  font-size: 11px;
  margin-top: 6px;
}
.search {
  flex: 1;
  max-width: 520px;
}
.nav {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 24px;
}
.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--hm-text-2);
  font-size: 15px;
  transition: color 0.2s;
  cursor: pointer;
}
.nav-link:hover,
.nav-link.active {
  color: var(--hm-primary);
}
.cart-badge :deep(.el-badge__content) {
  border: none;
}
.user-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: var(--hm-text-2);
  outline: none;
}
.avatar {
  background: var(--hm-primary);
  color: #fff;
  font-weight: 600;
}
.user-name {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.balance {
  color: var(--hm-primary);
  font-weight: 600;
}
</style>
