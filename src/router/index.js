import Vue from 'vue'
import Router from 'vue-router'
import routerLang from '@/i18n/routerLang';
/* Layout */
import Layout from '../views/layout/Layout'
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)


/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/


export const constantRouterMap = [{
    path: '/login',
    component: () => import('../views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/mch',
    component: Layout,
    redirect: '/mch/setting',
    name: '商户管理',
    meta: {
      title: routerLang.mch_manager,
      icon: 'user',
      prem: 'mch_group'
    },
    children: [{
        path: 'type',
        name: '商户类型',
        component: () => import('@/views/mch/mch_type'),
        meta: {
          title: routerLang.mch_type,
          icon: 'user',
          prem: 'mch_configuration_group'
        }
      },
      {
        path: 'setting',
        name: '商户配置',
        component: () => import('@/views/mch/mch_setting'),
        meta: {
          title: routerLang.mch_configuration,
          icon: 'user',
          prem: 'mch_configuration_group'
        }
      },
      {
        path: 'recharge',
        name: '商户充值',
        component: () => import('@/views/mch/mch_recharge'),
        meta: {
          title: routerLang.mch_recharge,
          icon: 'user',
          prem: 'mch_recharge_group'
        }
      },
      {
        path: 'report',
        name: '商户报表',
        component: () => import('@/views/mch/mch_report'),
        meta: {
          title: routerLang.mch_report,
          icon: 'user',
          prem: 'mch_report_group'
        }
      },
    ]
  },

  {
    path: '/channel',
    component: Layout,
    redirect: '/channel/manage',
    name: '通道管理',
    meta: {
      title: routerLang.channel_manager,
      icon: 'suitcase',
      prem: 'channel_manage_group'
    },
    children: [{
        path: 'manage',
        name: '通道商管理',
        component: () => import('@/views/channel/channel_manage'),
        meta: {
          title: routerLang.channel_mch,
          icon: 'suitcase',
          prem: 'channel_provider_group'
        }
      },
      {
        path: 'setting',
        name: '通道配置',
        component: () => import('@/views/channel/channel_setting'),
        meta: {
          title: routerLang.channel_configuration,
          icon: 'suitcase',
          prem: 'channel_group'
        }
      },
      {
        path: 'order_sync',
        name: '订单同步配置',
        component: () => import('@/views/channel/order_sync'),
        meta: {
          title: routerLang.order_sync,
          icon: 'suitcase',
          prem: 'channel_bot_group'
        }
      },
      {
        path: 'recharge',
        name: '通道商充值',
        component: () => import('@/views/channel/channel_recharge'),
        meta: {
          title: routerLang.channel_recharge,
          icon: 'suitcase',
          prem: 'channel_provider_recharge_group'
        }
      },
      {
        path: 'report',
        name: '通道商报表',
        component: () => import('@/views/channel/channel_report'),
        meta: {
          title: routerLang.channel_report,
          icon: 'suitcase',
          prem: 'channel_provider_report_group'
        }
      },
    ]
  },

  {
    path: '/myChannel',
    component: Layout,
    redirect: '/myChannel/bank',
    name: '自建通道管理',
    meta: {
      title: routerLang.my_channel,
      icon: 'box',
      prem: 'inner_channel_manage_group'
    },
    children: [{
        path: 'bank',
        name: '银行卡管理',
        component: () => import('@/views/myChannel/myChannel_bank'),
        meta: {
          title: routerLang.my_channel_bank,
          icon: 'box',
          prem: 'bankcard_manage_group'
        }
      },
      {
        path: 'order',
        name: '人工订单管理',
        component: () => import('@/views/myChannel/myChannel_order'),
        meta: {
          title: routerLang.my_channel_order,
          icon: 'box',
          prem: 'inner_order_namage_group'
        }
      },
    ]
  },

  {
    path: '/order',
    component: Layout,
    redirect: '/order/withdraw',
    name: '订单管理',
    meta: {
      title: routerLang.order,
      icon: 'tickets',
      prem: 'order_manage_group'
    },
    children: [{
        path: 'withdraw',
        name: '提现订单',
        component: () => import('@/views/order/order_withdraw'),
        meta: {
          title: routerLang.order_withdraw,
          icon: 'tickets',
          prem: 'order_withdraw_group'
        }
      },
      {
        path: 'report',
        name: '订单报表',
        component: () => import('@/views/order/order_report'),
        meta: {
          title: routerLang.order_report,
          icon: 'tickets',
          prem: 'order_report_group'
        }
      },
      {
        path: 'blacklist',
        name: '黑名单管理',
        component: () => import('@/views/order/order_blacklist'),
        meta: {
          title: routerLang.order_blacklist,
          icon: 'tickets',
          prem: 'blacklist_manage_group'
        }
      },
    ]
  },


  {
    path: '/auth',
    component: Layout,
    redirect: '/user',
    name: '权限管理',
    meta: {
      title: routerLang.auth,
      icon: 'setting',
      prem: 'console_manage_group'
    },
    children: [{
      path: 'user',
      name: '账号管理',
      component: () => import('@/views/auth/userMag/index'),
      meta: {
        title: routerLang.auth_account,
        icon: 'setting',
        prem: 'admin_user_group'
      }
    }, {
      path: 'role',
      name: '角色管理',
      component: () => import('@/views/auth/roleMag/index'),
      meta: {
        title: routerLang.auth_role,
        icon: 'setting',
        prem: 'admin_role_group'
      }
    }, {
      path: 'operatLog',
      name: '操作记录',
      component: () => import('@/views/auth/operatLog/index'),
      meta: {
        title: routerLang.auth_record,
        icon: 'setting',
        prem: 'record'
      }
    }]
  },



  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

export default new Router({
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
