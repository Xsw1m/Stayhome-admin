import request from '@/utils/request'

export function fetchList(query) {
  query.pagesize = query.limit
  // query.filter[title] = query.title
  let params = {
    'page': query.page,
    'sort': query.sort,
    'pagesize': query.pagesize,
    'audit_explain': query.audit_explain,
    'importance': query.importance,
    'real_name': query.real_name,
    'type': query.type,
    'url': query.url,
    'filter[title]': query.title,
    'filter[category_id]': query.category_id,
    'filter[status]': query.status,
    'filter[begin_time]': query.begin_time,
    'filter[end_time]': query.end_time,
    'filter[begin_length]': query.begin_length,
    'filter[end_length]': query.end_length 
  }
  return request({
    url: '/admin/video/list' + '?include=category,user',
    method: 'get',
    params: params
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
    method: 'patch',
    data
  })
}

export function auditItem(data, id) {
  return request({
    url: '/video/audit/' + id,
    method: 'patch',
    data
  })
}
export function deleteItem(id) {
  return request({
    url: '/video/delete/' + id,
    method: 'delete'
  })
}
export function checkUrl(id) {
  return request({
    url: '/video/details/original/' + id,
    method: 'get'
  })
}

