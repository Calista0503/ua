import axios from 'axios'

let apiUrl = 'http://3.1.171.240:8080/'
console.log("NODE_ENV:" + process.env.NODE_ENV)
if (process.env.NODE_ENV === 'production') {
  apiUrl = 'http://api.im.haorangkeji.com/'
} else if (process.env.NODE_ENV === 'test') {
  apiUrl = 'http://3.1.171.240:8080/'
}

export function getURL(key, onSucceedCallback, onErrorCallback) {
  return axios({
    url: apiUrl + "download/token/?keys=" + key,
    method: 'get',
    dataType: "json"
  })
}
