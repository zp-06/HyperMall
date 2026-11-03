import { defineStore } from 'pinia'

// 结算中转：购物车选中商品 / 立即购买商品
export const useCheckoutStore = defineStore('checkout', {
  state: () => ({
    // 形如 CartVO：{ itemId, num, name, price, newPrice, spec, image, status, stock }
    items: [],
    addressId: null,
  }),
  getters: {
    totalFee(state) {
      return state.items.reduce(
        (sum, it) => sum + (Number(it.newPrice ?? it.price) || 0) * (Number(it.num) || 0),
        0,
      )
    },
  },
  actions: {
    setItems(items) {
      this.items = items
    },
    setAddressId(id) {
      this.addressId = id
    },
    clear() {
      this.items = []
      this.addressId = null
    },
  },
})
