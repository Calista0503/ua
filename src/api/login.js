import request from '@/utils/request'

export function login(data) {
    return request({
        url: '/admin/login/',
        method: 'post',
        data
    })
}

export function getInfo() {
    return request({
        url: `/admin/user_info/`,
        method: 'get'
    })
}

export function logout() {
    return request({
        url: '/admin/user/logout/',
        method: 'post'
    })
}

export function signIn(data) {
    return request({
        url: '/admin/register/',
        method: 'post',
        data: data
    })
}

export function userSet(data, id) {
    return request({
        url: `/admin/user/${id}/`,
        method: 'put',
        data: data
    })
}
