import axios from 'axios'
import {
  Message
} from 'element-ui'
import store from '../store'
import {
  getToken,
  getUserId,
  removeUserId,
  getVcode
} from '@/utils/auth'
import {
  getApiHost
} from '@/utils/config';
import {removeToken} from './auth'

const service = axios.create({
  baseURL: getApiHost(),
  timeout: 60000, // 请求超时时间
  responseType: 'blob'
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['X-AUTH-USER'] = getUserId()
    config.headers['X-AUTH-TOKEN'] = getToken()
    config.headers['X-AUTH-VCODE'] = getVcode()
  } else {
    config.headers['X-AUTH-VCODE'] = getVcode()
  }
  return config
}, error => {
  // console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * status为非0是抛错 可结合自己业务进行修改
     */
    return response.data
  },
  error => {
    // console.log('err' + error)// for debug
    if (error.response.data.msg) {
      Message({
        message: error.response.data.msg,
        type: 'error'
      })
    } else {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }

    if ([1005, 3004, 3210, 3212, 3213, 3218].includes(error.response.data.status)) {
      removeUserId()
      window.location.replace('/#/login')
    }
    return Promise.reject(error)
  }
)

export default service
