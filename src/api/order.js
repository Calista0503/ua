import request from '@/utils/request'

export const blackListApi = {
  get(params) {
    let url = `/admin/mch/blacklist/`
    if (params.export === 1) {
      url = `/admin/mch/blacklist_export/`
    }
    return request({
      url,
      method: 'get',
      params
    })
  },
  post(data) {
    return request({
      url: '/admin/mch/blacklist/',
      method: 'post',
      data
    })
  },
  delete(id) {
    return request({
      url: `/admin/mch/blacklist/${id}/`,
      method: 'delete',
    })
  },
}

export const orderApi = {
  // 订单报表
  getReportList(params) {
    let url = `/admin/order/order_report_form/`
    if (params.export === 1) {
      url = `/admin/order/order_report_form_export/`
    }
    return request({
      url,
      method: 'get',
      params
    })
  },
  // 提现订单列表
  getList(params) {
    let url = `/admin/order/`
    if (params.export === 1) {
      url = `/admin/order/order_export/`
    }
    return request({
      url,
      method: 'get',
      params
    })
  },
  getDetailById(order_id) {
    return request({
      url: '/admin/order/order_detail/',
      method: 'get',
      params: {
        order_id: Number(order_id)
      }
    })
  },
  getDetailByNo(order_no) {
    return request({
      url: '/admin/order/order_detail/',
      method: 'get',
      params: {
        order_no: Number(order_no)
      }
    })
  },
  getLogsById(order_id) {
    return request({
      url: `/admin/order/${Number(order_id)}/order_log/`,
      method: 'get',
      params: {}
    })
  },
  // 单个/批量刷新
  refresh(order_ids) {
    if (!(order_ids instanceof Array)) throw new Error('参数order_ids必须为数组')
    return request({
      url: '/admin/order/order_refresh/',
      method: 'post',
      data: {
        order_ids
      }
    })
  },
  // 单个/批量 推送
  push(order_ids) {
    if (!(order_ids instanceof Array)) throw new Error('参数order_ids必须为数组')
    return request({
      url: '/admin/order/order_push/',
      method: 'post',
      data: {
        order_ids
      }
    })
  },
  // 追分
  chase(order_id) {
    return request({
      url: `/admin/order/${order_id}/order_apply_return/`,
      method: 'post',
      data: {}
    })
  },
  // 单个/批量 回调
  callback(order_ids) {
    if (!(order_ids instanceof Array)) throw new Error('参数order_ids必须为数组')
    return request({
      url: '/admin/order/order_hand_notify/',
      method: 'post',
      data: {
        order_ids
      }
    })
  },
  order_modify_success(data) {
    return request({
      url: '/admin/order/order_modify/success/',
      method: 'post',
      data
    })
  },
  order_modify_fail(data) {
    return request({
      url: '/admin/order/order_modify/fail/',
      method: 'post',
      data
    })
  },
  // 獲取銀行碼
  getBankCode() {
    return request({
      url: `admin/order/bank_code/`,
      method: 'get',
    })
  },
}
