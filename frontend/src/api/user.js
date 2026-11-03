import request from './request'

// 登录：返回 { token, userId, username, balance }
export const login = (data) => request.post('/users/login', data)
