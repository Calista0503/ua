const isEnglish = localStorage.getItem('ua-admin-lang') === 'en';
import { orderApi } from "@/api/order";

const ua = {
  state: {
    isEnglish,
    mchType: {
      'complex': '综合',
      'game': '游戏',
      'lottery': 'CP',
      'financial': '理财',
      'commerce': '电商',
      'video': '视频',
      'other': '其他',
    },
    mchLevel: {
      '1': '普通商户',
      '8': '中级商户',
      '16': '高级商户',
      '24': '顶级商户',
    },
    withdrawType: {
      bankcard: isEnglish ? 'Bank card' : '银行卡',
      alipay: isEnglish ? 'Alipay' : '支付宝',
    },
    vnWithdrawType: {
      bankcard: isEnglish ? 'Bank card' : '银行卡',
      momo: isEnglish ? 'MOMO' : '越南MoMo'
    },
    withdrawType_byString: {
      '银行卡': 'bankcard',
      '支付宝': 'alipay',
      '越南MoMo': 'momo'
    },
    userLevel: {
      '1': '新手用户',
      '8': '初级用户',
      '16': '中级用户',
      '24': '高级用户',
    },
    bankCodeType: {
      'null': []
    },
    // 充值订单状态
    rechargeStatus: {
      '1': '成功',
      '2': '拒绝',
      '3': '待处理'
    },
    // 订单回调状态
    callbackStatus: {
      'new': isEnglish ? 'Not callback' : '未回调',
      'success': isEnglish ? 'Callback successful' : '回调成功',
      'fail': isEnglish ? 'Callback failed' : '回调失败',
    },
    // 订单状态
    orderStatus: {
      new: isEnglish ? 'Waiting for withdrawal' : '待下分', // 新建
      commit: isEnglish ? 'Submitted to a third party' : '已提交第三方',
      third_unknown: isEnglish ? 'Third party unknown' : '第三方未知',
      order_fail: isEnglish ? 'Withdrawal failed' : '下分失败',
      order_success: isEnglish ? 'Withdrawal success' : '下分成功',
    },
    channelOrderStatus: {
      new: isEnglish ? 'Waiting for withdrawal' : '待下分',
      lock: isEnglish ? 'Locked' : '已锁定',
      fail: isEnglish ? 'Withdrawal failed' : '下分失败',
      success: isEnglish ? 'Withdrawal success' : '下分成功', // 下分成功，可返款
      return: isEnglish ? 'Refunded' : '已返款'
    },
    //异常处理结果
    processResult: {
      success: isEnglish ? 'Succeeded' : '下分成功',
      fail: isEnglish ? 'Withdrawal failed' : '下分失败'
    },

    ChannelMatchType: {
      mch_id: '指定商户',
      mch_type: '指定商户类型'
    },
    reportStatus: {
      'new': '新建',
      'doing': '报表导出中',
      'done': '完成'
    },
    currencyType: {
      'cny': 'cny',
    },
    // 越南版币别
    vnCurrencyType: {
      'vnd': 'vnd',
      'idr': 'idr',
    }

  },
  getters: {
    allBankCodeType: (state) => {
      let result = [];
      let bankCodeType = state.bankCodeType;
      Object.keys(bankCodeType).forEach(key => {
        result = result.concat(bankCodeType[key]);
      });
      return result;
    },
    allBankCodeTypeString: (state, getters) => {
      let allBankCodeType = getters.allBankCodeType;
      let result = {};
      allBankCodeType.forEach(bankCode => {
        result[bankCode.code] = bankCode.name
      })
      return result;
    },
    bankCodeTypeByCurrency: (state) => {
      let result = state.bankCodeType;
      return result;
    },
  },
  mutations: {
    SET_BANKCODETYPE: (state, bankCodeType) => {
      state.bankCodeType = bankCodeType;
    },
  },
  actions: {
    GetBankCode({commit, state}) {
      return new Promise((resolve, reject) => {
        orderApi.getBankCode().then(response => {
          const data = response.data
          commit('SET_BANKCODETYPE', data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
  }

}

export default ua
