<script setup>
import { ref, onMounted } from 'vue'
import { Location } from '@element-plus/icons-vue'
import { getAddressList } from '@/api/address'

const loading = ref(true)
const list = ref([])

async function load() {
  loading.value = true
  try {
    list.value = await getAddressList()
  } finally {
    loading.value = false
  }
}

function fullAddress(a) {
  return `${a.province || ''}${a.city || ''}${a.town || ''}${a.street || ''}`
}

onMounted(load)
</script>

<template>
  <div class="address hm-container" v-loading="loading">
    <div class="head">
      <h2 class="page-title">收货地址</h2>
      <span class="muted">后端当前仅提供查询接口，暂不支持在线新增/编辑</span>
    </div>

    <div v-if="list.length" class="addr-grid">
      <div v-for="addr in list" :key="addr.id" class="addr-card hm-card">
        <div class="line1">
          <b>{{ addr.contact }}</b>
          <span>{{ addr.mobile }}</span>
          <el-tag v-if="addr.isDefault === 1" size="small" type="danger" effect="plain">默认</el-tag>
        </div>
        <div class="addr muted">{{ fullAddress(addr) }}</div>
        <div v-if="addr.notes" class="notes muted">备注：{{ addr.notes }}</div>
      </div>
    </div>

    <el-empty v-else-if="!loading" description="暂无收货地址">
      <template #image>
        <el-icon :size="64" color="#c0c4cc"><Location /></el-icon>
      </template>
    </el-empty>
  </div>
</template>

<style scoped>
.address {
  padding: 20px 0 0;
}
.head {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 16px;
}
.page-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
}
.addr-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.addr-card {
  padding: 16px 18px;
}
.line1 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
}
.addr {
  margin-top: 8px;
  font-size: 14px;
}
.notes {
  margin-top: 6px;
  font-size: 13px;
}
@media (max-width: 800px) {
  .addr-grid {
    grid-template-columns: 1fr;
  }
}
</style>
