import request from '@/utils/request'

export function fetchTable(query) {
//   query.pagesize = query.limit
  return request({
    url: '/watch/apply/list',
    method: 'get',
    params: query
  })
}

export function createdTable(query) {
  return request({
    url: '/watch/apply/audit/' + query.id + '',
    method: 'get',
    params: query
  })
}
