<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Picture } from '@element-plus/icons-vue'
import { useCheckoutStore } from '@/stores/checkout'
import { getAddressList } from '@/api/address'
import { createOrder } from '@/api/order'
import { formatPrice, toNumber } from '@/utils/format'
import { ORDER_PAYMENT_TYPE_BALANCE } from '@/utils/constants'

const router = useRouter()
const checkoutStore = useCheckoutStore()

const items = computed(() => checkoutStore.items)
const totalFee = computed(() => checkoutStore.totalFee)

const addressList = ref([])
const addressId = ref(null)
const submitting = ref(false)

async function loadAddresses() {
  try {
    addressList.value = await getAddressList()
    if (addressList.value.length) {
      const def = addressList.value.find((a) => a.isDefault === 1) || addressList.value[0]
      addressId.value = def.id
    }
  } catch (e) {
    // 地址仅展示，加载失败不阻塞下单
  }
}

function fullAddress(a) {
  return `${a.province || ''}${a.city || ''}${a.town || ''}${a.street || ''}`
}

async function submit() {
  if (!items.value.length) {
    ElMessage.warning('没有待结算的商品')
    router.replace('/')
    return
  }
  submitting.value = true
  try {
    const orderId = await createOrder({
      addressId: addressId.value ? toNumber(addressId.value) : null,
      paymentType: ORDER_PAYMENT_TYPE_BALANCE,
      details: items.value.map((i) => ({ itemId: toNumber(i.itemId), num: Number(i.num) })),
    })
    checkoutStore.clear()
    router.replace(`/pay/${orderId}`)
  } catch (e) {
    // 错误已在拦截器提示
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  if (!items.value.length) {
    ElMessage.warning('请先从购物车选择商品')
    router.replace('/cart')
    return
  }
  loadAddresses()
})
</script>

<template>
  <div class="checkout hm-container">
    <h2 class="page-title">确认订单</h2>

    <!-- 收货地址 -->
    <div class="section hm-card">
      <div class="section-head">
        <span class="section-title">收货地址</span>
        <span class="muted">（后端仅提供查询接口）</span>
      </div>
      <div v-if="addressList.length" class="addr-list">
        <div
          v-for="addr in addressList"
          :key="addr.id"
          class="addr-item"
          :class="{ active: addressId === addr.id }"
          @click="addressId = addr.id"
        >
          <div class="addr-line1">
            <b>{{ addr.contact }}</b>
            <span>{{ addr.mobile }}</span>
            <el-tag v-if="addr.isDefault === 1" size="small" type="danger" effect="plain">默认</el-tag>
          </div>
          <div class="addr-line2 muted">{{ fullAddress(addr) }}</div>
          <div v-if="addr.notes" class="addr-line2 muted">备注：{{ addr.notes }}</div>
        </div>
      </div>
      <div v-else class="muted">暂无收货地址</div>
    </div>

    <!-- 商品清单 -->
    <div class="section hm-card">
      <div class="section-head"><span class="section-title">商品清单</span></div>
      <div class="item-list">
        <div v-for="it in items" :key="it.itemId" class="item-row">
          <el-image :src="it.image" fit="cover" class="thumb">
            <template #error>
              <div class="img-fallback"><el-icon><Picture /></el-icon></div>
            </template>
          </el-image>
          <div class="item-info">
            <div class="name">{{ it.name }}</div>
            <div class="spec muted" v-if="it.spec">{{ it.spec }}</div>
          </div>
          <div class="item-price">{{ formatPrice(it.newPrice ?? it.price) }} × {{ it.num }}</div>
          <div class="item-sub price">{{ formatPrice((it.newPrice ?? it.price) * it.num) }}</div>
        </div>
      </div>
    </div>

    <!-- 支付方式 -->
    <div class="section hm-card">
      <div class="section-head"><span class="section-title">支付方式</span></div>
      <div class="pay-methods">
        <div class="pay-method active">余额支付</div>
        <div class="pay-method disabled" title="暂未开放">支付宝 <span class="tag">暂未开放</span></div>
        <div class="pay-method disabled" title="暂未开放">微信 <span class="tag">暂未开放</span></div>
      </div>
    </div>

    <!-- 提交 -->
    <div class="submit-bar hm-card">
      <div class="total">
        应付总额：<span class="price sum">{{ formatPrice(totalFee) }}</span>
      </div>
      <el-button type="primary" size="large" :loading="submitting" @click="submit">提交订单</el-button>
    </div>
  </div>
</template>

<style scoped>
.checkout {
  padding: 20px 0 0;
}
.page-title {
  margin: 0 0 16px;
  font-size: 22px;
  font-weight: 700;
}
.section {
  padding: 18px 20px;
  margin-bottom: 16px;
}
.section-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 14px;
}
.section-title {
  font-size: 15px;
  font-weight: 600;
}
.addr-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.addr-item {
  border: 1px solid var(--hm-border);
  border-radius: var(--hm-radius);
  padding: 12px 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.addr-item.active {
  border-color: var(--hm-primary);
  background: var(--el-color-primary-light-9);
}
.addr-line1 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}
.addr-line2 {
  margin-top: 6px;
  font-size: 13px;
}
.item-list {
  display: flex;
  flex-direction: column;
}
.item-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid var(--hm-border);
}
.item-row:last-child {
  border-bottom: none;
}
.thumb {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  flex-shrink: 0;
  background: #f3f4f6;
}
.item-info {
  flex: 1;
  min-width: 0;
}
.name {
  font-size: 14px;
}
.spec {
  font-size: 12px;
  margin-top: 4px;
}
.item-price {
  width: 180px;
  text-align: right;
  color: var(--hm-text-2);
}
.item-sub {
  width: 120px;
  text-align: right;
}
.pay-methods {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.pay-method {
  border: 1px solid var(--hm-border);
  border-radius: var(--hm-radius);
  padding: 12px 20px;
  cursor: pointer;
  font-size: 14px;
}
.pay-method.active {
  border-color: var(--hm-primary);
  background: var(--el-color-primary-light-9);
  color: var(--hm-primary);
  font-weight: 600;
}
.pay-method.disabled {
  color: var(--hm-text-3);
  cursor: not-allowed;
}
.tag {
  font-size: 12px;
  margin-left: 4px;
}
.submit-bar {
  padding: 18px 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
}
.total {
  color: var(--hm-text-2);
}
.sum {
  font-size: 26px;
}
@media (max-width: 800px) {
  .addr-list {
    grid-template-columns: 1fr;
  }
}
</style>
