import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/column/list',
    method: 'get',
    params: query
  })
}

export function fetchItem(id) {
  return request({
    url: '/column/detail/' + id,
    method: 'get'
    // ,
    // params: { id }
  })
}

export function createItem(data) {
  return request({
    url: '/column/create',
    method: 'post',
    data
  })
}

export function updateItem(data, id) {
  return request({
    url: '/column/update/' + id,
    method: 'post',
    data
  })
}
