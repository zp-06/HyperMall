import request from './request'

// 我的收货地址列表
export const getAddressList = () => request.get('/addresses')

// 地址详情
export const getAddressById = (id) => request.get(`/addresses/${id}`)
