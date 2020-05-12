import request from '@/utils/request'

export function fetchTable() {
//   query.pagesize = query.limit
  return request({
    url: '/share/apply/list',
    method: 'get'
  })
}

export function createdTable(query) {
  query.audit_feedback = query.audit_explain
  return request({
    url: '/share/apply/audit/' + query.id + '',
    method: 'get',
    params: query
  })
}
