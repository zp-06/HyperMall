import request from './request'

// 搜索商品（默认走 ES，异常自动降级 MySQL）：params = { key, category, brand, minPrice, maxPrice, pageNo, pageSize }
export const searchItems = (params) => request.get('/search/list', { params })

// 商品分页（MySQL）
export const getItemPage = (params) => request.get('/items/page', { params })

// 商品详情
export const getItemById = (id) => request.get(`/items/${id}`)

// 批量查询商品：ids 为数组
export const getItemsByIds = (ids) => request.get('/items', { params: { ids: ids.join(',') } })
