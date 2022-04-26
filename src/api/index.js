import request from '@/utils/request'

export function getUserList(params) {
  return request({
    url: '/admin/users/',
    method: 'get',
    params
  })
}

export function deleteRole(id) {
  return request({
    url: `/admin/roles/${id}/`,
    method: 'delete',
  })
}

export function deleteUser(id) {
  return request({
    url: `/admin/users/${id}/`,
    method: 'delete'
  })
}

export function editRoleDetail(data, id) {
  return request({
    url: `/admin/roles/${id}/`,
    method: 'put',
    data
  })
}

export function editUserDetail(data, id) {
  return request({
    url: `/admin/users/${id}/`,
    method: 'put',
    data
  })
}

//获取聊天记录
export function getIMInfoByTopicId(topicId) {
  return request({
    url: `/admin/im/topics/${topicId}/messages/`,
    method: 'get'
  })
}

export function getPermissions() {
  return request({
    url: `/admin/permissions/`,
    method: 'get'
  })
}

export function getRecordList(params) {
  let url = `/admin/record/`
  if (params.export === 1) {
    url = `/admin/record_export/`
  }
  return request({
    url,
    method: 'get',
    params
  })
}

export function getRoleDetail(id) {
  return request({
    url: `/admin/roles/${id}/`,
    method: 'get'
  })
}

export function getRoleList(params) {
  return request({
    url: '/admin/roles/',
    method: 'get',
    params
  })
}

export function getUserDetail(id) {
  return request({
    url: `/admin/users/${id}/`,
    method: 'get'
  })
}

//修改个人密码
export function resetMyPassword(data) {
  return request({
    url: '/admin/reset_password/',
    method: 'put',
    data
  })
}

//重置密码
export function resetPassword(id) {
  return request({
    url: `/admin/reset_password/${id}/`,
    method: 'put'
  })
}

export function saveAddRole(data) {
  return request({
    url: `/admin/roles/`,
    method: 'post',
    data
  })
}

export function saveAddUser(data) {
  return request({
    url: `/admin/users/`,
    method: 'post',
    data
  })
}
