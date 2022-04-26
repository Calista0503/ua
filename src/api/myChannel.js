import request from '@/utils/request'

export const bankApi = {
  get(params) {
    return request({
      url: '/admin/inner_channel/bankcard/',
      method: 'get',
      params
    })
  },
  post(data) {
    return request({
      url: '/admin/inner_channel/bankcard/',
      method: 'post',
      data
    })
  },
  getById(id) {
    return request({
      url: `/admin/inner_channel/bankcard/${id}/`,
      method: 'get',
    })
  },
  put({
    id,
    data
  }) {
    return request({
      url: `/admin/inner_channel/bankcard/${id}/`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `/admin/inner_channel/bankcard/${id}/`,
      method: 'delete',
    })
  }
}

// 人工订单
export const manualOrderApi = {
  getList(params) {
    let url = '/admin/inner_channel/order/'
    if (params.export === 1) {
      url = '/admin/inner_channel/order_export/'
    }
    return request({
      url,
      method: 'get',
      params
    })
  },
  getDetailById(id) {
    return request({
      url: `/admin/inner_channel/order/${id}/`,
      method: 'get',
    })
  },
  // 订单锁定
  lock(id) {
    return request({
      url: `/admin/inner_channel/order/${id}/lock/`,
      method: 'post',
    })
  },
  // 指定提现银行卡
  dispatchBankcard({
    order_id,
    bankcard_id
  }) {
    return request({
      url: `/admin/inner_channel/order/${order_id}/dispatch_bankcard/`,
      method: 'post',
      data: {
        bankcard_id
      }
    })
  },
  // 获取可用的银行卡
  getBankcard(order_id) {
    return request({
      url: `/admin/inner_channel/order/${order_id}/dispatch_bankcard/`,
      method: 'get',
    })
  },
  // 提现成功
  success(id, data) {
    return request({
      url: `/admin/inner_channel/order/${id}/success_order/`,
      method: 'post',
      data
    })
  },
  // 提现失败
  fail(id, data) {
    return request({
      url: `/admin/inner_channel/order/${id}/fail_order/`,
      method: 'post',
      data
    })
  },
  // 提现返款
  returnOrder(id, data) {
    return request({
      url: `/admin/inner_channel/order/${id}/return_order/`,
      method: 'post',
      data
    })
  }
}
