import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/banner',
    method: 'get'
    // params: query
  })
}
export function fetchdropdown(query) {
  const params = {
    'page': query.page,
    'pagesize': query.limit,
    'filter[title]': query.title,
    'sort': query.sort
  }
  return request({
    url: '/admin/video/list',
    method: 'get',
    params: params
  })
}
export function deleteItem(id) {
  return request({
    url: '/banner/' + id,
    method: 'delete'
  })
}

export function createItem(data) {
  return request({
    url: '/banner',
    method: 'post',
    data
  })
}

export function updateItem(data, id) {
  console.log('提交banner修改', data)
  return request({
    url: '/banner/' + id,
    method: 'patch',
    data
  })
}
