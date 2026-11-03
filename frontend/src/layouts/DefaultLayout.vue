<script setup>
import { onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'

const userStore = useUserStore()
const cartStore = useCartStore()

onMounted(() => {
  if (userStore.isLogin) {
    cartStore.refresh().catch(() => {})
  }
})
</script>

<template>
  <div class="layout">
    <AppHeader />
    <main class="layout-main">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.layout {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
.layout-main {
  flex: 1;
  width: 100%;
}
</style>
