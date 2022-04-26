import Cookies from 'js-cookie'

const prefix = 'ua_admin';
const TokenKey = `${prefix}_token`
const UserId = `${prefix}_user_id`
const Vcode = `${prefix}_vcode`

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  // document.addCookie('game_user_token=' + token)
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setUserId(id) {
  return Cookies.set(UserId, id)
}

export function getUserId() {
  return Cookies.get(UserId)
}

export function removeUserId() {
  return Cookies.remove(UserId)
}

export function setVcode(val) {
  return Cookies.set(Vcode,val)
}

export function getVcode() {
  return Cookies.get(Vcode)
}

export function removeVcode() {
  return Cookies.remove(Vcode)
}
