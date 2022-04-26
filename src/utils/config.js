// eslint-disable-next-line no-unused-vars
 import fa from 'element-ui/src/locale/lang/fa'

let qiuniuUrl = 'http://im.bolansuzhou.com/'
let apiHost = ''
let isVietnam = false

console.log("NODE_ENV:"+process.env.NODE_ENV)

function getDomain() {
  const url = document.location.toString();
  const domain = document.domain
  if (url.indexOf("https")!==-1) {
    return 'https://api.'+ domain + '/api'
  }else {
    return 'http://api.'+ domain + '/api'
  }
}

// 生产环境域名
if (process.env.NODE_ENV === 'production'){
    qiuniuUrl = 'http://im.beierche.net/'
    // apiHost = 'http://ua_admin_api.798907.com:20002/api'
    apiHost = getDomain()
    console.log('apiHost=', getDomain());

  // eslint-disable-next-line no-undef
    // isVietnam = false

} else if(process.env.NODE_ENV === 'test'){ 
    if(isVietnam) {
      // 测试环境域名 vn
      qiuniuUrl = 'http://im.bolansuzhou.com/'
      apiHost = 'http://13.212.30.63:40001/api'
    } else {
      // 测试环境域名
      qiuniuUrl = 'http://im.bolansuzhou.com/'
      apiHost = 'http://3.1.171.240:40001/api'
    }    
}

export function getQiuUrl(){
  return qiuniuUrl
}

export function getApiHost(){
  return apiHost
}

export function getIsVietnam () {
  return isVietnam
}

// 项目名称
export const PROJECTNAME = isVietnam ? 'UA运营后台(VN)' : 'UA运营后台';
