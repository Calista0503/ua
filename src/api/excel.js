import request from '@/utils/request'
import request_blob from '@/utils/request_blob'

export function exportExel(id) {
  return request({
    url: `/admin/sys/export_task/${id}/`,
    method: 'get',
    isLoading:false
  })
}

export function exportExel_blob(id) {
  return request_blob({
    url: `/admin/sys/export_task/${id}/`,
    method: 'get'
  })
}

export const downloadApi = {
  get(params) {
    return request({
      url: '/admin/report_dog_task/',
      method: 'get',
      params
    })
  },
  download(id) {
    return request({
      url: `/admin/report_dog_task/${id}/`,
      method: 'get',
    })
  },
}
