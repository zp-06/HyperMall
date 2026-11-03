<script setup>
import { reactive, ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { searchItems } from '@/api/item'
import ProductCard from '@/components/ProductCard.vue'
import { Search, RefreshLeft } from '@element-plus/icons-vue'

const route = useRoute()

// 关键词来自头部搜索框（route.query.key），分类/品牌/价格在筛选栏内填写
const filters = reactive({
  category: '',
  brand: '',
  minPriceYuan: null,
  maxPriceYuan: null,
})

const keyword = computed(() => route.query.key || '')

const loading = ref(false)
const list = ref([])
const total = ref(0)
const pageNo = ref(1)
const pageSize = 20

function buildParams() {
  const params = { pageNo: pageNo.value, pageSize }
  if (keyword.value) params.key = keyword.value
  if (filters.category) params.category = filters.category
  if (filters.brand) params.brand = filters.brand
  if (filters.minPriceYuan !== null && filters.minPriceYuan !== '') {
    params.minPrice = Math.round(Number(filters.minPriceYuan) * 100)
  }
  if (filters.maxPriceYuan !== null && filters.maxPriceYuan !== '') {
    params.maxPrice = Math.round(Number(filters.maxPriceYuan) * 100)
  }
  return params
}

async function load() {
  loading.value = true
  try {
    const data = await searchItems(buildParams())
    list.value = data.list || []
    total.value = Number(data.total) || 0
  } finally {
    loading.value = false
  }
}

function search() {
  pageNo.value = 1
  load()
}

function reset() {
  Object.assign(filters, { category: '', brand: '', minPriceYuan: null, maxPriceYuan: null })
  pageNo.value = 1
  load()
}

function onPageChange(p) {
  pageNo.value = p
  load()
}

// 头部搜索框跳转（同路由 query.key 变化）时重新加载
watch(
  () => route.query.key,
  () => {
    pageNo.value = 1
    load()
  },
)

onMounted(load)
</script>

<template>
  <div class="home">
    <div class="hm-container">
      <!-- 筛选栏 -->
      <div class="filter-bar hm-card">
        <div class="filter-row">
          <el-input v-model="filters.category" placeholder="分类（精确匹配，可选）" clearable class="w-mid" />
          <el-input v-model="filters.brand" placeholder="品牌（精确匹配，可选）" clearable class="w-mid" />
          <div class="price-range">
            <el-input-number v-model="filters.minPriceYuan" :min="0" :controls="false" placeholder="最低价" class="price-input" />
            <span class="dash">—</span>
            <el-input-number v-model="filters.maxPriceYuan" :min="0" :controls="false" placeholder="最高价" class="price-input" />
            <span class="unit">元</span>
          </div>
          <el-button type="primary" :icon="Search" @click="search">搜索</el-button>
          <el-button :icon="RefreshLeft" @click="reset">重置</el-button>
        </div>
      </div>

      <!-- 结果统计 -->
      <div class="result-meta" v-if="!loading">
        共 <b>{{ total }}</b> 件商品
        <span v-if="keyword" class="muted">，关键词“{{ keyword }}”</span>
      </div>

      <!-- 商品列表 -->
      <div v-loading="loading" class="grid-wrap">
        <div v-if="list.length" class="product-grid">
          <ProductCard v-for="item in list" :key="item.id" :item="item" />
        </div>
        <el-empty v-else-if="!loading" description="没有找到相关商品" />
      </div>

      <!-- 分页 -->
      <div v-if="total > pageSize" class="pagination">
        <el-pagination
          background
          layout="prev, pager, next, total"
          :total="total"
          :page-size="pageSize"
          :current-page="pageNo"
          @current-change="onPageChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  padding: 20px 0 0;
}
.filter-bar {
  padding: 18px 20px;
}
.filter-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.w-mid {
  width: 180px;
}
.price-range {
  display: flex;
  align-items: center;
  gap: 8px;
}
.price-input {
  width: 110px;
}
.dash {
  color: var(--hm-text-3);
}
.unit {
  color: var(--hm-text-3);
  font-size: 13px;
}
.result-meta {
  margin: 18px 4px 12px;
  color: var(--hm-text-2);
  font-size: 14px;
}
.result-meta b {
  color: var(--hm-primary);
}
.muted {
  color: var(--hm-text-3);
}
.grid-wrap {
  min-height: 300px;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}
.pagination {
  display: flex;
  justify-content: center;
  margin: 28px 0 10px;
}
@media (max-width: 1100px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media (max-width: 860px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 600px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
