import router from './router'
import store from './store'
import { Message } from 'element-ui'
import { getUserId } from '@/utils/auth' // 验权

const whiteList = ['/login','/404'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  if (getUserId()) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (!store.getters.enable) {
        store.dispatch('GetInfo').then(() => { // 拉取用户信息
          store.dispatch('GetBankCode');
          next()
        }).catch(() => {
          store.dispatch('FedLogOut').then(() => {
            Message.error('验证失败,请重新登录')
            next({ path: '/login' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  }
})
