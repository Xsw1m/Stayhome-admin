import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/login',
    method: 'get',
    params: {
      account: data.username,
      password: data.password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'get'
  })
}