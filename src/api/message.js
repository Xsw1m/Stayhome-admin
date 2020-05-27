import request from '@/utils/request'

export function fetchList(query) {
  query.pagesize = query.limit
  return request({
    url: '/admin/message/list',
    method: 'get',
    params: query
  })
}

export function fetchMessage() {
  return request({
    url: '/admin/message/unread',
    method: 'get'
  })
}

export function allcheckitem() {
  return request({
    url: '/admin/message/check/all',
    method: 'put'
  })
}

export function checkitem(id) {
  return request({
    url: '/admin/message/check/' + id,
    method: 'put'
  })
}
