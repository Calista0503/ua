import request from '@/utils/request'

export const mchApi = {
  get(params) {
    return request({
      url: '/admin/mch/',
      method: 'get',
      params,
    })
  },
  post(data) {
    return request({
      url: '/admin/mch/',
      method: 'post',
      data
    })
  },
  getById(id) {
    return request({
      url: `/admin/mch/${id}/`,
      method: 'get',
    })
  },
  put({
    id,
    data
  }) {
    return request({
      url: `/admin/mch/${id}/`,
      method: 'put',
      data
    })
  },
  // 查看商户秘钥
  getKeyById(id) {
    return request({
      url: `/admin/mch/${id}/api_key/`,
      method: 'get',
    })
  },
  // 修改商户秘钥
  updateKeyById(id) {
    return request({
      url: `/admin/mch/${id}/api_key/`,
      method: 'put',
    })
  },
  // 重置商户密码
  resetPassword(id) {
    return request({
      url: `/admin/mch/${id}/reset_mch_console_password/`,
      method: 'post',
    })
  },
  // 重置商户谷歌验证器
  resetVcodeSecret(id) {
    return request({
      url: `/admin/mch/${id}/reset_mch_vcode_secret/`,
      method: 'post',
    })
  },
  // 商户充值列表
  getRechargeList(params) {
    let url = `/admin/mch/mch_recharge/`
    if (params.export === 1) {
      url = `/admin/mch/mch_recharge_export/`
    }
    return request({
      url,
      method: 'get',
      params
    })
  },
  // 同意充值
  rechargeAgree(data) {
    return request({
      url: `/admin/mch/mch_recharge/`,
      method: 'post',
      data
    })
  },
  // 拒绝充值
  rechargeRefuse(data) {
    return request({
      url: `/admin/mch/mch_recharge_reject/`,
      method: 'post',
      data
    })
  },
  // 商户报表
  getReportList(params) {
    let url = `/admin/mch/mch_report_form/`
    if (params.export === 1) {
      url = `/admin/mch/mch_report_form_export/`
    }
    return request({
      url,
      method: 'get',
      params
    })
  },
  //獲得商戶列表
  getMchList(params) {
    return request({
      url: 'admin/mch/mch_menu/',
      method: 'get',
      params
    })
  },

  //商户类型 获取列表
  mchTypeGet(params) {
    return request({
      url: 'admin/mch/mch_type_menu/',
      method: 'get',
      params
    })
  },
  GetMchTypeList(params) {
    return request({
      url: 'admin/mch/mch_type/',
      method: 'get',
      params
    })
  },
  //商户类型 新增
  mchTypePost(data) {
    return request({
      url: 'admin/mch/mch_type/',
      method: 'post',
      data
    })
  },
  //商户类型 编辑
  mchTypePut(id, data) {
    return request({
      url: `admin/mch/mch_type/${id}/`,
      method: 'put',
      data
    })
  },

  //商户类型 删除
  mchTypeDel(id) {
    return request({
      url: `admin/mch/mch_type/${id}/`,
      method: 'delete',
    })
  }
}
