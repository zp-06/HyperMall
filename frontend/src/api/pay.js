import request from './request'

// 申请支付单：{ bizOrderNo, amount, payChannelCode, payType, orderInfo }，返回支付单 id（字符串）
export const applyPayOrder = (data) => request.post('/pay-orders', data)

// 余额支付：POST /pay-orders/{id}，body = { pw }
export const payByBalance = (id, data) => request.post(`/pay-orders/${id}`, data)

// 按业务订单号查询支付单
export const getPayOrderByBiz = (bizOrderNo) => request.get(`/pay-orders/biz/${bizOrderNo}`)
