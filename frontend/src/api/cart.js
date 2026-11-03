import request from './request'

// 查询我的购物车
export const getCartList = () => request.get('/carts')

// 加入购物车：{ itemId, name, spec, price, image }
export const addToCart = (data) => request.post('/carts', data)

// 更新购物车条目（如数量）：{ id, num }
export const updateCart = (data) => request.put('/carts', data)

// 删除单条
export const deleteCartItem = (id) => request.delete(`/carts/${id}`)

// 批量删除：ids 为数组
export const deleteCartItems = (ids) => request.delete('/carts', { params: { ids: ids.join(',') } })
