import request from '@/utils/request'

export function fetchList(query) {
  query.pagesize = query.limit
  return request({
    url: '/user/list',
    method: 'get',
    params: query
  })
}
export function fetchItem(id) {
  return request({
    url: '/user/details/' + id,
    method: 'get'
  })
}

export function updateItem(data, id) {
  return request({
    url: '/user/update/' + id,
    method: 'put',
    data
  })
}

export function auditItem(data, id) {
  return request({
    url: '/user/audit/' + id,
    method: 'put',
    data
  })
}
export function deleteItem(id) {
  return request({
    url: '/user/delete/' + id,
    method: 'delete'
  })
}
