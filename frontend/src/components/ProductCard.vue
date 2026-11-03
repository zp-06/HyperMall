<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Picture, Plus } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { addToCart } from '@/api/cart'
import { formatPrice, formatCount, toNumber } from '@/utils/format'

const props = defineProps({
  item: { type: Object, required: true },
})

const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()

function goDetail() {
  router.push(`/item/${props.item.id}`)
}

async function handleAdd() {
  if (!userStore.isLogin) {
    ElMessage.warning('请先登录')
    router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
    return
  }
  await addToCart({
    itemId: toNumber(props.item.id),
    name: props.item.name,
    spec: props.item.spec,
    price: props.item.price,
    image: props.item.image,
  })
  ElMessage.success('已加入购物车')
  cartStore.refresh().catch(() => {})
}
</script>

<template>
  <div class="product-card" @click="goDetail">
    <div class="card-img-wrap">
      <el-image :src="item.image" fit="cover" class="card-img" lazy>
        <template #error>
          <div class="img-fallback"><el-icon :size="40"><Picture /></el-icon></div>
        </template>
      </el-image>
      <span v-if="item.isAD === true" class="ad-tag">广告</span>
    </div>

    <div class="card-body">
      <h3 class="card-name" :title="item.name">{{ item.name }}</h3>

      <div class="card-tags">
        <el-tag v-if="item.brand" size="small" effect="plain" type="info">{{ item.brand }}</el-tag>
        <el-tag v-if="item.category" size="small" effect="plain" type="info">{{ item.category }}</el-tag>
      </div>

      <div class="card-meta">
        <span>已售 {{ formatCount(item.sold) }}</span>
        <span>评论 {{ formatCount(item.commentCount) }}</span>
      </div>

      <div class="card-bottom">
        <span class="price">{{ formatPrice(item.price) }}</span>
        <el-button
          type="primary"
          size="small"
          circle
          :icon="Plus"
          title="加入购物车"
          @click.stop="handleAdd"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  background: #fff;
  border-radius: var(--hm-radius);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}
.card-img-wrap {
  position: relative;
  aspect-ratio: 1 / 1;
  background: #f3f4f6;
}
.card-img {
  width: 100%;
  height: 100%;
  display: block;
}
.ad-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  background: #ffb400;
  color: #fff;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
}
.card-body {
  padding: 12px 14px 14px;
}
.card-name {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  height: 40px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-tags {
  margin-top: 8px;
  min-height: 22px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.card-meta {
  margin-top: 6px;
  color: var(--hm-text-3);
  font-size: 12px;
  display: flex;
  gap: 14px;
}
.card-bottom {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.price {
  font-size: 18px;
}
</style>
