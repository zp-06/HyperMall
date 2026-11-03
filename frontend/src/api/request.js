import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

// 后端返回约定：
//  - 成功：HTTP 200 + 裸对象（{token,...} / {total,pages,list} / [...] / id 字符串）
//  - 失败：HTTP 非 200 + { code, msg, data:null }
//  - 网关鉴权失败：HTTP 401 + 空 body
const request = axios.create({
  baseURL: '/', // 由 Vite 代理到网关
  timeout: 15000,
})

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('hmall_token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

function toLogin() {
  // 同步清理 Pinia 登录态，避免登录守卫把 /login 重定向回首页造成循环
  useUserStore().logout()
  const current = window.location.hash.replace(/^#/, '') || '/'
  window.location.hash = `#/login?redirect=${encodeURIComponent(current)}`
}

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const response = error.response
    if (response) {
      if (response.status === 401) {
        ElMessage.error('登录已过期，请重新登录')
        toLogin()
      } else {
        const msg = response.data?.msg || response.data?.message || '请求失败，请稍后重试'
        ElMessage.error(msg)
      }
    } else {
      ElMessage.error('网络异常，请检查后端服务是否启动')
    }
    return Promise.reject(error)
  },
)

export default request
