import axios from 'axios'
import {
  Message,
  Loading
} from 'element-ui'
import store from '../store'
import {
  getToken,
  getUserId,
  removeUserId,
  removeToken,
  getVcode
} from '@/utils/auth'
import {
  getApiHost
} from '@/utils/config';

const service = axios.create({
  baseURL: getApiHost(),
  timeout: 60000,
  withCredentials: true,
  crossDomain: true
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
        duration: 3 * 1000
      })
    }
    if (error.response.status === 500 && error.response.data.status === 1007) {
      removeToken();
      removeUserId();
      window.location.replace('/');
    }


    return Promise.reject(error)
  }
)

/**
 * @description 高阶service，扩展loading
 */
const serviceHOC = (function (request) {
  return function (obj) {
    let {
      isLoading
    } = obj;
    // 默认加上loading
    if (isLoading === void 0) isLoading = true;

    let loadingInstance;
    if (isLoading) {
      const loadingOption = {
        fullscreen: true,
      }
      loadingInstance = Loading.service({
        fullscreen: true,
        background: 'rgba(255,255,255,.1)',
        target: document.body,
        customClass: 'global-loading',
        text: 'Loading...'
      });
    }
    delete obj.isLoading
    const p = service(obj);
    p.finally(() => {
      loadingInstance && loadingInstance.close();
    })
    p.catch(() => {
      loadingInstance && loadingInstance.close();
    })
    return p
  }
})(service)

export default serviceHOC
