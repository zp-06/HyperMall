<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="not-found">
    <div class="code">404</div>
    <p class="desc">页面不存在或已被移除</p>
    <el-button type="primary" @click="router.push('/')">返回首页</el-button>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
.code {
  font-size: 96px;
  font-weight: 800;
  color: var(--hm-primary);
  line-height: 1;
}
.desc {
  color: var(--hm-text-3);
}
</style>
