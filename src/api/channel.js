import request from '@/utils/request'

export const channelMchApi = {
  get(params) {
    return request({
      url: '/admin/channel/channel_provider/',
      method: 'get',
      params
    })
  },
  post(data) {
    return request({
      url: '/admin/channel/channel_provider/',
      method: 'post',
      data
    })
  },
  getById(id) {
    return request({
      url: `/admin/channel/channel_provider/${id}/`,
      method: 'get',
    })
  },
  put({
    id,
    data
  }) {
    return request({
      url: `/admin/channel/channel_provider/${id}/`,
      method: 'put',
      data
    })
  },
  // 获取通道商类型
  getChanneMchlType() {
    return request({
      url: `/admin/channel/channel_type/`,
      method: 'get',
    })
  },
  //獲取通道下拉選單
  getChanneMchlList() {
    return request({
      url: `/admin/channel/channel_provider_menu/`,
      method: 'get',
    })
  },
  // 通道商充值
  recharge(data) {
    return request({
      url: '/admin/channel/channel_provider_recharge/',
      method: 'post',
      data
    })
  },
  // 通道商充值列表
  getRechargeList(params) {
    let url = `/admin/channel/channel_provider_recharge/`
    if (params.export === 1) {
      url = `/admin/channel/channel_provider_recharge_export/`
    }
    return request({
      url,
      method: 'get',
      params
    })
  },
  // 通道商报表数据
  getReportList(params) {
    let url = `/admin/channel/channel_provider_report_form/`
    if (params.export === 1) {
      url = `/admin/channel/channel_provider_report_form_export/`
    }
    return request({
      url,
      method: 'get',
      params
    })
  },
}


export const channelApi = {
  get(params) {
    return request({
      url: '/admin/channel/',
      method: 'get',
      params
    })
  },
  post(data) {
    return request({
      url: '/admin/channel/',
      method: 'post',
      data
    })
  },
  getById(id) {
    return request({
      url: `/admin/channel/${id}/`,
      method: 'get',
    })
  },
  put({
    id,
    data
  }) {
    return request({
      url: `/admin/channel/${id}/`,
      method: 'put',
      data
    })
  },
  updateStatus({
    id,
    data
  }) {
    return request({
      url: `/admin/channel/channel_provider/${id}/`,
      method: 'put',
      data
    })
  },
  //獲取通道下拉選單
  getChanneList() {
    return request({
      url: `/admin/channel/channel_menu/`,
      method: 'get',
    })
  },
  // 根据通道商获取关联通道
  getChannelByChannelMch(params) {
    return request({
      url: '/admin/channel/get_channels/',
      method: 'get',
      params
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

export const orderSyncApi = {
  get(params) {
    return request({
      url: '/admin/channel/channel_ordersync_bot/',
      method: 'get',
      params
    })
  },
  post(data) {
    return request({
      url: '/admin/channel/channel_ordersync_bot/',
      method: 'post',
      data
    })
  },
  getById(id) {
    return request({
      url: `/admin/channel/channel_ordersync_bot/${id}/`,
      method: 'get',
    })
  },
  put({id, data}) {
    return request({
      url: `/admin/channel/channel_ordersync_bot/${id}/`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `/admin/channel/channel_ordersync_bot/${id}/`,
      method: 'delete',
    })
  },
}
