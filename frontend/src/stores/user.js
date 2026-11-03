import { defineStore } from 'pinia'
import { login as loginApi } from '@/api/user'

const TOKEN_KEY = 'hmall_token'
const USER_KEY = 'hmall_user'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY) || '',
    userInfo: JSON.parse(localStorage.getItem(USER_KEY) || 'null'),
  }),
  getters: {
    isLogin: (state) => !!state.token,
    username: (state) => state.userInfo?.username || '',
    userId: (state) => state.userInfo?.userId || '',
    balance: (state) => state.userInfo?.balance ?? 0,
  },
  actions: {
    async login(form) {
      const data = await loginApi(form)
      this.token = data.token
      this.userInfo = { userId: data.userId, username: data.username, balance: data.balance }
      localStorage.setItem(TOKEN_KEY, data.token)
      localStorage.setItem(USER_KEY, JSON.stringify(this.userInfo))
      return data
    },
    setBalance(balance) {
      this.userInfo = { ...this.userInfo, balance }
      localStorage.setItem(USER_KEY, JSON.stringify(this.userInfo))
    },
    logout() {
      this.token = ''
      this.userInfo = null
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    },
  },
})
