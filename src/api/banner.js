import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/banner/list',
    method: 'get'
    // params: query
  })
}
export function fetchdropdown(query) {
  query.pagesize = query.limit
  return request({
    url: '/video/list',
    method: 'get',
    params: query
  })
}
export function deleteItem(id) {
  return request({
    url: '/banner/delete/' + id,
    method: 'delete'
  })
}

export function createItem(data) {
  return request({
    url: '/banner/create',
    method: 'post',
    data
  })
}

export function updateItem(data, id) {
  return request({
    url: '/banner/update/' + id,
    method: 'put',
    data
  })
}
