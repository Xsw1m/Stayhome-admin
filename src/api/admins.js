import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/admin',
    method: 'get'
  })
}

export function fetchItem(id) {
  return request({
    url: '/admin/' + id,
    method: 'get'
  })
}

export function createItem(data) {
  return request({
    url: '/admin',
    method: 'post',
    data
  })
}

export function updateItem(data, id) {
  return request({
    url: '/admin/' + id,
    method: 'patch',
    data
  })
}

export function auditItem(data, id) {
  return request({
    url: '/admin/audit/' + id,
    method: 'put',
    data
  })
}
export function deleteItem(id) {
  return request({
    url: '/admin/' + id,
    method: 'delete'
  })
}
