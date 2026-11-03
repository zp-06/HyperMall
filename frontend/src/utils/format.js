/** 后端金额统一以「分」存储，这里负责分 -> 元 的展示转换。 */

// 分 -> 元字符串（保留两位小数）
export function fen2yuan(cents) {
  const n = Number(cents)
  if (!Number.isFinite(n)) return '0.00'
  return (n / 100).toFixed(2)
}

// 分 -> 带 ¥ 的价格字符串
export function formatPrice(cents) {
  return `¥${fen2yuan(cents)}`
}

// 大数字展示：>= 10000 显示为 x.x万
export function formatCount(n) {
  const v = Number(n)
  if (!Number.isFinite(v)) return '0'
  if (v >= 10000) return `${(v / 10000).toFixed(1)}万`
  return String(v)
}

// 后端 LocalDateTime 序列化为 "yyyy-MM-ddTHH:mm:ss"（MySQL 路径）或 "yyyy-MM-dd HH:mm:ss"（ES 路径）
export function formatDateTime(str) {
  if (!str) return ''
  return String(str).replace('T', ' ').slice(0, 19)
}

// 后端 Long 在 JSON 中是字符串，转成数字用于请求体
export function toNumber(v) {
  if (v === null || v === undefined || v === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}
