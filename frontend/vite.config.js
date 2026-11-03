import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// 后端网关地址，可用环境变量覆盖：VITE_API_TARGET=http://your-host:8080
const API_TARGET = process.env.VITE_API_TARGET || 'http://localhost:8080'

// 将后端各服务路径统一代理到网关，规避跨域问题。
const BACKEND_PREFIXES = [
  '/items',
  '/search',
  '/users',
  '/carts',
  '/orders',
  '/pay-orders',
  '/addresses',
  '/hi',
]

const proxy = {}
for (const prefix of BACKEND_PREFIXES) {
  proxy[prefix] = {
    target: API_TARGET,
    changeOrigin: true,
  }
}

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy,
  },
})
