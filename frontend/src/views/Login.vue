<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, ShoppingBag } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()

const formRef = ref()
const loading = ref(false)
const form = reactive({ username: '', password: '' })

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function handleLogin() {
  await formRef.value.validate()
  loading.value = true
  try {
    await userStore.login({ username: form.username, password: form.password })
    ElMessage.success('登录成功')
    cartStore.refresh().catch(() => {})
    const redirect = route.query.redirect || '/'
    router.replace(String(redirect))
  } catch (e) {
    // 错误信息已在拦截器统一提示
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-box hm-card">
      <div class="login-head">
        <div class="logo-badge"><el-icon :size="30" color="#fff"><ShoppingBag /></el-icon></div>
        <h1 class="title">惠商城</h1>
        <p class="sub">欢迎回来，请登录你的账号</p>
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" size="large" @submit.prevent>
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名" :prefix-icon="User" clearable />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            :prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-button type="primary" size="large" class="submit" :loading="loading" @click="handleLogin">
          登录
        </el-button>
      </el-form>

      <p class="tip">登录后即可使用购物车、下单与余额支付功能</p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e5483a 0%, #f4754c 50%, #ff9a6b 100%);
  padding: 20px;
}
.login-box {
  width: 400px;
  padding: 40px 36px 32px;
}
.login-head {
  text-align: center;
  margin-bottom: 28px;
}
.logo-badge {
  width: 56px;
  height: 56px;
  margin: 0 auto 16px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e5483a, #f4754c);
}
.title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}
.sub {
  margin: 8px 0 0;
  color: var(--hm-text-3);
  font-size: 14px;
}
.submit {
  width: 100%;
  margin-top: 4px;
}
.tip {
  margin: 20px 0 0;
  text-align: center;
  color: var(--hm-text-3);
  font-size: 12px;
}
</style>
