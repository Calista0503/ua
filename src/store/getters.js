const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  id: state => state.user.id,
  userinfo: state => state.user.userinfo,
  roles: state => state.user.roles,
  enable: state => state.user.enable,
  deleted: state => state.user.deleted,
  name: state => state.user.userinfo.name,
}
export default getters
