<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Lock, CircleCheckFilled, WarningFilled, Wallet } from '@element-plus/icons-vue'
import { getOrderById } from '@/api/order'
import { applyPayOrder, payByBalance } from '@/api/pay'
import { useUserStore } from '@/stores/user'
import { formatPrice, toNumber } from '@/utils/format'
import { PAY_TYPE_BALANCE, PAY_CHANNEL_BALANCE, ORDER_STATUS } from '@/utils/constants'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const orderId = route.params.orderId

const loading = ref(true)
const paying = ref(false)
const paid = ref(false)
const order = ref(null)

const formRef = ref()
const form = reactive({ pw: '' })
const rules = { pw: [{ required: true, message: '请输入支付密码', trigger: 'blur' }] }

const statusText = computed(() => (order.value ? ORDER_STATUS[order.value.status]?.text : ''))

async function refreshOrder() {
  order.value = await getOrderById(orderId)
}

async function load() {
  loading.value = true
  try {
    await refreshOrder()
    if (order.value?.status === 2 || order.value?.status === 3 || order.value?.status === 4) {
      paid.value = true
    }
  } catch (e) {
    // 拦截器已提示
  } finally {
    loading.value = false
  }
}

async function confirmPay() {
  await formRef.value.validate()
  paying.value = true
  try {
    // 1. 申请支付单（幂等）
    const payOrderId = await applyPayOrder({
      bizOrderNo: toNumber(orderId),
      amount: order.value.totalFee,
      payChannelCode: PAY_CHANNEL_BALANCE,
      payType: PAY_TYPE_BALANCE,
      orderInfo: '惠商城订单',
    })
    // 2. 余额支付
    await payByBalance(payOrderId, { pw: form.pw })
    // 3. 成功：本地扣减余额，跳转订单详情
    userStore.setBalance(Math.max(0, (Number(userStore.balance) || 0) - (Number(order.value.totalFee) || 0)))
    paid.value = true
    ElMessage.success('支付成功')
  } catch (e) {
    // 可能是「订单已经支付/已关闭」，重新拉取订单状态校准
    try {
      await refreshOrder()
      if (order.value?.status === 2 || order.value?.status === 3 || order.value?.status === 4) {
        paid.value = true
      }
    } catch (_) {}
  } finally {
    paying.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="pay hm-container" v-loading="loading">
    <div v-if="order" class="pay-box">
      <!-- 支付成功 -->
      <div v-if="paid" class="result hm-card">
        <el-icon :size="64" color="#67c23a"><CircleCheckFilled /></el-icon>
        <h2 class="result-title">支付成功</h2>
        <p class="muted">订单号：{{ order.id }}</p>
        <div class="result-actions">
          <el-button type="primary" size="large" @click="router.push(`/order/${order.id}`)">查看订单</el-button>
          <el-button size="large" @click="router.push('/')">继续购物</el-button>
        </div>
      </div>

      <!-- 已关闭 -->
      <div v-else-if="order.status === 5" class="result hm-card">
        <el-icon :size="64" color="#909399"><WarningFilled /></el-icon>
        <h2 class="result-title">订单已关闭</h2>
        <p class="muted">该订单已超时关闭，请重新下单</p>
        <div class="result-actions">
          <el-button type="primary" size="large" @click="router.push('/')">去逛逛</el-button>
        </div>
      </div>

      <!-- 待支付 -->
      <div v-else class="pay-panel hm-card">
        <h2 class="title">订单支付</h2>
        <div class="order-line">
          <span class="label">订单号</span>
          <span>{{ order.id }}</span>
        </div>
        <div class="order-line">
          <span class="label">订单状态</span>
          <el-tag :type="ORDER_STATUS[order.status]?.type" effect="light">{{ statusText }}</el-tag>
        </div>
        <div class="amount-line">
          <span class="label">应付金额</span>
          <span class="price amount">{{ formatPrice(order.totalFee) }}</span>
        </div>

        <el-divider />

        <div class="balance-line">
          <el-icon color="#e6a23c"><Wallet /></el-icon>
          <span>账户余额：<b class="price">{{ formatPrice(userStore.balance) }}</b></span>
          <span v-if="Number(userStore.balance) < Number(order.totalFee)" class="warn">余额不足</span>
        </div>

        <el-form ref="formRef" :model="form" :rules="rules" class="pay-form" @submit.prevent>
          <el-form-item prop="pw">
            <el-input
              v-model="form.pw"
              type="password"
              size="large"
              placeholder="请输入支付密码（即登录密码）"
              :prefix-icon="Lock"
              show-password
              @keyup.enter="confirmPay"
            />
          </el-form-item>
          <el-button
            type="primary"
            size="large"
            class="pay-btn"
            :loading="paying"
            :disabled="Number(userStore.balance) < Number(order.totalFee)"
            @click="confirmPay"
          >
            确认支付
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pay {
  padding: 20px 0 0;
  display: flex;
  justify-content: center;
}
.pay-box {
  width: 560px;
  max-width: 100%;
}
.pay-panel {
  padding: 32px 36px;
}
.title {
  margin: 0 0 24px;
  font-size: 20px;
  font-weight: 700;
}
.order-line {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 0;
  font-size: 14px;
}
.label {
  color: var(--hm-text-3);
  width: 72px;
  flex-shrink: 0;
}
.amount-line {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
}
.amount {
  font-size: 30px;
}
.balance-line {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--hm-text-2);
  margin-bottom: 8px;
}
.warn {
  color: #e6a23c;
  font-size: 12px;
}
.pay-form {
  margin-top: 16px;
}
.pay-btn {
  width: 100%;
}
.result {
  padding: 48px 36px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.result-title {
  margin: 8px 0 0;
  font-size: 22px;
  font-weight: 700;
}
.result-actions {
  margin-top: 20px;
  display: flex;
  gap: 14px;
}
</style>
