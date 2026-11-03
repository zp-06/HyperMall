<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Picture, Delete } from '@element-plus/icons-vue'
import { useCartStore } from '@/stores/cart'
import { useCheckoutStore } from '@/stores/checkout'
import { updateCart, deleteCartItem, deleteCartItems } from '@/api/cart'
import { formatPrice, toNumber } from '@/utils/format'

const router = useRouter()
const cartStore = useCartStore()
const checkoutStore = useCheckoutStore()

const loading = ref(false)
const selectedIds = ref([])

const cartList = computed(() => cartStore.list)
const selectedItems = computed(() => cartList.value.filter((i) => selectedIds.value.includes(i.id)))
const allSelected = computed(() => cartList.value.length > 0 && selectedIds.value.length === cartList.value.length)
const isIndeterminate = computed(() => selectedIds.value.length > 0 && !allSelected.value)

const totalCount = computed(() =>
  selectedItems.value.reduce((s, i) => s + (Number(i.num) || 0), 0),
)
const totalFee = computed(() =>
  selectedItems.value.reduce(
    (s, i) => s + (Number(i.newPrice ?? i.price) || 0) * (Number(i.num) || 0),
    0,
  ),
)

async function load() {
  loading.value = true
  try {
    await cartStore.refresh()
  } finally {
    loading.value = false
  }
}

function toggleAll(val) {
  selectedIds.value = val ? cartList.value.map((i) => i.id) : []
}

async function onNumChange(item, val) {
  try {
    await updateCart({ id: toNumber(item.id), num: val })
    cartStore.refresh().catch(() => {})
  } catch (e) {
    await load() // 回滚
  }
}

async function removeOne(item) {
  await ElMessageBox.confirm(`确定从购物车移除「${item.name}」吗？`, '提示', { type: 'warning' })
  await deleteCartItem(item.id)
  ElMessage.success('已移除')
  selectedIds.value = selectedIds.value.filter((id) => id !== item.id)
  await load()
}

async function removeSelected() {
  if (!selectedIds.value.length) return
  await ElMessageBox.confirm(`确定移除选中的 ${selectedIds.value.length} 件商品吗？`, '提示', { type: 'warning' })
  await deleteCartItems(selectedIds.value)
  ElMessage.success('已移除')
  selectedIds.value = []
  await load()
}

function goCheckout() {
  if (!selectedItems.value.length) {
    ElMessage.warning('请先选择要结算的商品')
    return
  }
  checkoutStore.setItems(selectedItems.value.map((i) => ({ ...i })))
  router.push('/checkout')
}

function goShopping() {
  router.push('/')
}

onMounted(load)
</script>

<template>
  <div class="cart hm-container">
    <div class="cart-head">
      <h2 class="page-title">购物车</h2>
      <span v-if="cartList.length" class="muted">共 {{ cartList.length }} 种商品</span>
    </div>

    <div v-loading="loading" class="cart-body">
      <template v-if="cartList.length">
        <!-- 列表 -->
        <div class="cart-list hm-card">
          <div class="cart-row head-row">
            <el-checkbox :model-value="allSelected" :indeterminate="isIndeterminate" @change="toggleAll" />
            <span class="col-name">商品</span>
            <span class="col-price">单价</span>
            <span class="col-num">数量</span>
            <span class="col-sub">小计</span>
            <span class="col-op">操作</span>
          </div>

          <div v-for="item in cartList" :key="item.id" class="cart-row">
            <el-checkbox v-model="selectedIds" :value="item.id" />

            <div class="col-name">
              <el-image :src="item.image" fit="cover" class="thumb">
                <template #error>
                  <div class="img-fallback"><el-icon><Picture /></el-icon></div>
                </template>
              </el-image>
              <div class="name-wrap">
                <div class="name" :title="item.name" @click="router.push(`/item/${item.itemId}`)">{{ item.name }}</div>
                <div class="spec muted" v-if="item.spec">{{ item.spec }}</div>
              </div>
            </div>

            <div class="col-price">
              <span class="price">{{ formatPrice(item.newPrice ?? item.price) }}</span>
              <span v-if="item.newPrice !== item.price" class="old-price">{{ formatPrice(item.price) }}</span>
            </div>

            <div class="col-num">
              <el-input-number
                :model-value="item.num"
                :min="1"
                :max="Math.max(item.stock || 1, 1)"
                size="small"
                @change="(v) => onNumChange(item, v)"
              />
            </div>

            <div class="col-sub price">{{ formatPrice((item.newPrice ?? item.price) * item.num) }}</div>

            <div class="col-op">
              <el-button type="danger" link :icon="Delete" @click="removeOne(item)">删除</el-button>
            </div>
          </div>
        </div>

        <!-- 结算栏 -->
        <div class="settle-bar hm-card">
          <div class="left">
            <el-checkbox :model-value="allSelected" :indeterminate="isIndeterminate" @change="toggleAll">全选</el-checkbox>
            <el-button link type="danger" :disabled="!selectedIds.length" @click="removeSelected">删除选中</el-button>
          </div>
          <div class="right">
            <span class="muted">已选 <b class="count">{{ totalCount }}</b> 件</span>
            <span class="sum-label">合计：</span>
            <span class="sum price">{{ formatPrice(totalFee) }}</span>
            <el-button type="primary" size="large" :disabled="!selectedItems.length" @click="goCheckout">
              去结算
            </el-button>
          </div>
        </div>
      </template>

      <el-empty v-else-if="!loading" description="购物车还是空的">
        <el-button type="primary" @click="goShopping">去逛逛</el-button>
      </el-empty>
    </div>
  </div>
</template>

<style scoped>
.cart {
  padding: 20px 0 0;
}
.cart-head {
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin-bottom: 16px;
}
.page-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
}
.cart-list {
  padding: 0 20px;
}
.cart-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 0;
  border-bottom: 1px solid var(--hm-border);
}
.cart-row:last-child {
  border-bottom: none;
}
.head-row {
  color: var(--hm-text-3);
  font-size: 13px;
  padding: 14px 0;
  border-bottom: 1px solid var(--hm-border);
}
.col-name {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.thumb {
  width: 72px;
  height: 72px;
  border-radius: 8px;
  flex-shrink: 0;
  background: #f3f4f6;
}
.name-wrap {
  min-width: 0;
}
.name {
  font-size: 14px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 360px;
}
.name:hover {
  color: var(--hm-primary);
}
.spec {
  font-size: 12px;
  margin-top: 4px;
  max-width: 360px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.col-price {
  width: 110px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.old-price {
  color: var(--hm-text-3);
  font-size: 12px;
  text-decoration: line-through;
}
.col-num {
  width: 130px;
  text-align: center;
}
.col-sub {
  width: 110px;
  text-align: right;
  font-size: 15px;
}
.col-op {
  width: 70px;
  text-align: right;
}
.settle-bar {
  margin-top: 16px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  bottom: 12px;
}
.left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.count {
  color: var(--hm-primary);
}
.sum-label {
  color: var(--hm-text-2);
}
.sum {
  font-size: 22px;
}
</style>
