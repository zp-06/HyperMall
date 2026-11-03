<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getOrderById } from '@/api/order'
import { formatPrice, formatDateTime } from '@/utils/format'
import { ORDER_STATUS, PAYMENT_TYPE } from '@/utils/constants'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const order = ref(null)

const statusInfo = ref(null)

async function load() {
  loading.value = true
  try {
    order.value = await getOrderById(route.params.id)
    statusInfo.value = ORDER_STATUS[order.value.status] || { text: '未知', type: 'info' }
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="order-detail hm-container" v-loading="loading">
    <div v-if="order" class="order-box hm-card">
      <div class="head">
        <h2 class="title">订单详情</h2>
        <el-tag :type="statusInfo.type" size="large">{{ statusInfo.text }}</el-tag>
      </div>

      <div class="grid">
        <div class="cell"><span class="k">订单号</span><span class="v">{{ order.id }}</span></div>
        <div class="cell"><span class="k">支付方式</span><span class="v">{{ PAYMENT_TYPE[order.paymentType] || '未知' }}</span></div>
        <div class="cell"><span class="k">下单时间</span><span class="v">{{ formatDateTime(order.createTime) }}</span></div>
        <div class="cell"><span class="k">支付时间</span><span class="v">{{ formatDateTime(order.payTime) || '—' }}</span></div>
        <div class="cell"><span class="k">关闭时间</span><span class="v">{{ formatDateTime(order.closeTime) || '—' }}</span></div>
        <div class="cell amount"><span class="k">订单金额</span><span class="v price">{{ formatPrice(order.totalFee) }}</span></div>
      </div>

      <div class="actions">
        <el-button v-if="order.status === 1" type="primary" @click="router.push(`/pay/${order.id}`)">去支付</el-button>
        <el-button @click="router.push('/')">返回首页</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.order-detail {
  padding: 20px 0 0;
  display: flex;
  justify-content: center;
}
.order-box {
  width: 640px;
  max-width: 100%;
  padding: 32px 36px;
}
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 24px;
}
.cell {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.k {
  color: var(--hm-text-3);
  font-size: 13px;
}
.v {
  font-size: 15px;
}
.amount .v {
  font-size: 22px;
}
.actions {
  margin-top: 28px;
  display: flex;
  gap: 14px;
}
</style>
