import { defineStore } from 'pinia'
import { getCartList } from '@/api/cart'

export const useCartStore = defineStore('cart', {
  state: () => ({
    list: [],
    count: 0,
  }),
  actions: {
    async refresh() {
      const list = await getCartList()
      this.list = list || []
      this.count = this.list.reduce((sum, item) => sum + (Number(item.num) || 0), 0)
    },
    reset() {
      this.list = []
      this.count = 0
    },
  },
})
