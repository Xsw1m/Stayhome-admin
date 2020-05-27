import request from '@/utils/request'

export function fetchList(query) {
  query.pagesize = query.limit
  return request({
    url: '/admin/video/list',
    method: 'get',
    params: query
  })
}

export function fetchItem(id) {
  return request({
    url: '/video/details/' + id,
    method: 'get'
  })
}

export function createItem(data) {
  return request({
    url: '/video/create',
    method: 'post',
    data
  })
}

export function updateItem(data, id) {
  return request({
    url: '/video/update/' + id,
    method: 'put',
    data
  })
}

export function auditItem(data, id) {
  return request({
    url: '/video/audit/' + id,
    method: 'put',
    data
  })
}
export function deleteItem(id) {
  return request({
    url: '/video/delete/' + id,
    method: 'delete'
  })
}
