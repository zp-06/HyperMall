// 业务枚举映射（与后端保持一致）

// 订单状态：1未付款 2已付款未发货 3已发货 4交易成功 5交易取消 6交易结束
export const ORDER_STATUS = {
  1: { text: '待付款', type: 'warning' },
  2: { text: '已付款', type: 'success' },
  3: { text: '已发货', type: 'primary' },
  4: { text: '交易成功', type: 'success' },
  5: { text: '已关闭', type: 'info' },
  6: { text: '交易结束', type: 'info' },
}

// 订单支付方式：1支付宝 2微信 3余额
export const PAYMENT_TYPE = {
  1: '支付宝',
  2: '微信',
  3: '余额支付',
}

// 支付单状态：0待提交 1待支付 2超时/关闭 3支付成功
export const PAY_STATUS = {
  0: { text: '待提交', type: 'info' },
  1: { text: '待支付', type: 'warning' },
  2: { text: '已关闭', type: 'info' },
  3: { text: '支付成功', type: 'success' },
}

// 余额支付：pay-service 只支持 payType=5（余额），payChannelCode 自定义为 balance
export const PAY_TYPE_BALANCE = 5
export const PAY_CHANNEL_BALANCE = 'balance'

// 下单支付方式：余额
export const ORDER_PAYMENT_TYPE_BALANCE = 3

// 解析商品规格 JSON 字符串 -> [{key, value}]，失败返回空数组
export function parseSpec(spec) {
  if (!spec) return []
  try {
    const obj = JSON.parse(spec)
    if (Array.isArray(obj)) return obj
    return Object.entries(obj).map(([key, value]) => ({ key, value }))
  } catch (e) {
    return []
  }
}
