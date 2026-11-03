<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Picture, ShoppingCart, Lightning } from '@element-plus/icons-vue'
import { getItemById } from '@/api/item'
import { addToCart } from '@/api/cart'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useCheckoutStore } from '@/stores/checkout'
import { formatPrice, formatCount, toNumber } from '@/utils/format'
import { parseSpec } from '@/utils/constants'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()
const checkoutStore = useCheckoutStore()

const item = ref(null)
const loading = ref(true)
const num = ref(1)
const specs = computed(() => parseSpec(item.value?.spec))

async function load() {
  loading.value = true
  try {
    item.value = await getItemById(route.params.id)
  } finally {
    loading.value = false
  }
}

function requireLogin() {
  if (userStore.isLogin) return true
  ElMessage.warning('请先登录')
  router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
  return false
}

async function handleAddToCart() {
  if (!requireLogin()) return
  await addToCart({
    itemId: toNumber(item.value.id),
    name: item.value.name,
    spec: item.value.spec,
    price: item.value.price,
    image: item.value.image,
  })
  ElMessage.success('已加入购物车')
  cartStore.refresh().catch(() => {})
}

function handleBuyNow() {
  if (!requireLogin()) return
  checkoutStore.setItems([
    {
      itemId: item.value.id,
      num: num.value,
      name: item.value.name,
      price: item.value.price,
      newPrice: item.value.price,
      spec: item.value.spec,
      image: item.value.image,
      stock: item.value.stock,
    },
  ])
  router.push('/checkout')
}

onMounted(load)
</script>

<template>
  <div class="detail hm-container" v-loading="loading">
    <div v-if="item" class="detail-card hm-card">
      <!-- 左：商品图 -->
      <div class="detail-img">
        <el-image :src="item.image" fit="cover" class="main-img">
          <template #error>
            <div class="img-fallback"><el-icon :size="72"><Picture /></el-icon></div>
          </template>
        </el-image>
      </div>

      <!-- 右：信息 -->
      <div class="detail-info">
        <h1 class="title">{{ item.name }}</h1>

        <div class="tags">
          <el-tag v-if="item.brand" type="danger" effect="plain">{{ item.brand }}</el-tag>
          <el-tag v-if="item.category" effect="plain">{{ item.category }}</el-tag>
          <el-tag v-if="item.isAD === true" type="warning" effect="dark">广告</el-tag>
        </div>

        <div class="price-panel">
          <div class="price-label">价格</div>
          <div class="price">{{ formatPrice(item.price) }}</div>
        </div>

        <div v-if="specs.length" class="spec-block">
          <div class="block-label">规格</div>
          <div class="spec-list">
            <el-tag v-for="(s, i) in specs" :key="i" effect="plain">
              {{ s.key }}{{ s.value !== undefined && s.value !== '' ? `：${s.value}` : '' }}
            </el-tag>
          </div>
        </div>

        <div class="meta-grid">
          <div class="meta-item"><span class="k">库存</span><span class="v">{{ item.stock }}</span></div>
          <div class="meta-item"><span class="k">销量</span><span class="v">{{ formatCount(item.sold) }}</span></div>
          <div class="meta-item"><span class="k">评论</span><span class="v">{{ formatCount(item.commentCount) }}</span></div>
        </div>

        <div class="buy-row">
          <div class="qty">
            <span class="k">数量</span>
            <el-input-number v-model="num" :min="1" :max="Math.max(item.stock, 1)" />
          </div>
        </div>

        <div class="actions">
          <el-button size="large" :icon="ShoppingCart" @click="handleAddToCart">加入购物车</el-button>
          <el-button size="large" type="primary" :icon="Lightning" @click="handleBuyNow">立即购买</el-button>
        </div>
      </div>
    </div>

    <el-empty v-else-if="!loading" description="商品不存在或已下架" />
  </div>
</template>

<style scoped>
.detail {
  padding: 20px 0 0;
  min-height: 400px;
}
.detail-card {
  display: flex;
  gap: 32px;
  padding: 28px;
}
.detail-img {
  width: 420px;
  flex-shrink: 0;
  aspect-ratio: 1 / 1;
  border-radius: var(--hm-radius);
  overflow: hidden;
  background: #f3f4f6;
}
.main-img {
  width: 100%;
  height: 100%;
}
.detail-info {
  flex: 1;
  min-width: 0;
}
.title {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.4;
}
.tags {
  margin-top: 14px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.price-panel {
  margin-top: 20px;
  display: flex;
  align-items: baseline;
  gap: 16px;
  background: var(--el-color-primary-light-9);
  border-radius: var(--hm-radius);
  padding: 16px 20px;
}
.price-label {
  color: var(--hm-text-3);
  font-size: 14px;
}
.price-panel .price {
  font-size: 32px;
}
.spec-block {
  margin-top: 20px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.block-label,
.k {
  color: var(--hm-text-3);
  font-size: 14px;
  flex-shrink: 0;
}
.spec-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.meta-grid {
  margin-top: 20px;
  display: flex;
  gap: 40px;
}
.meta-item {
  display: flex;
  gap: 8px;
  font-size: 14px;
}
.meta-item .v {
  color: var(--hm-text-2);
  font-weight: 500;
}
.buy-row {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}
.qty {
  display: flex;
  align-items: center;
  gap: 12px;
}
.actions {
  margin-top: 28px;
  display: flex;
  gap: 16px;
}
@media (max-width: 800px) {
  .detail-card {
    flex-direction: column;
  }
  .detail-img {
    width: 100%;
  }
}
</style>
