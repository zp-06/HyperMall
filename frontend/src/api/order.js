import request from './request'

// 创建订单：{ addressId, paymentType, details: [{ itemId, num }] }，返回订单 id（字符串）
export const createOrder = (data) => request.post('/orders', data)

// 查询订单
export const getOrderById = (id) => request.get(`/orders/${id}`)
