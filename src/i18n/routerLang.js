const isEnglish = localStorage.getItem('ua-admin-lang') === 'en';

const en = {
  mch_manager: 'Merchant',
  mch_type: 'Type',
  mch_recharge:'Recharge',
  mch_configuration: 'Configuration',
  mch_report: 'Report',

  channel_manager: 'Channel',
  channel_mch: 'Channel merchants',
  channel_configuration: 'Configuration',
  order_sync: 'OrderSync',
  channel_recharge: 'Recharge',
  channel_report: 'Report',

  my_channel: 'Self-built channel',
  my_channel_bank: 'Bank',
  my_channel_order: 'Manual order',

  order: 'Order',
  order_withdraw: 'Withdraw',
  order_report: 'Report',
  order_blacklist: 'Blacklist',

  auth: 'Authority',
  auth_account: 'Account',
  auth_role: 'Role',
  auth_record: 'Operation record',
}

const cn = {
  mch_manager: '商户管理',
  mch_type: '商户类型',
  mch_configuration: '商户配置',
  mch_recharge:'商户充值',
  mch_report: '商户报表',

  channel_manager: '通道管理',
  channel_mch: '通道商管理',
  channel_configuration: '通道配置',
  order_sync: '订单同步配置',
  channel_recharge: '通道商充值',
  channel_report: '通道商报表',

  my_channel: '自建通道管理',
  my_channel_bank: '银行卡管理',
  my_channel_order: '人工订单管理',

  order: '订单管理',
  order_withdraw: '提现订单管理',
  order_report: '订单报表',
  order_blacklist: '黑名单管理',

  auth: '权限管理',
  auth_account: '账号管理',
  auth_role: '角色管理',
  auth_record: '操作记录',
}

const routerLang = isEnglish ? en : cn

export default routerLang;
