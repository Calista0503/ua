import {
  login,
  logout,
  getInfo,
  signIn
} from '@/api/login'
import {
  getToken,
  removeUserId,
  setUserId,
  getUserId,
  setToken
} from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    roles: {},
    enable: false,
    deleted: false,
    id: getUserId(),
    userinfo: {},
    im_token: null,
    im_id: null,
    showserviceIframe: false
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_USER_ENABLE: (state, enable) => {
      state.enable = enable
    },
    SET_USER_DELETED: (state, deleted) => {
      state.deleted = deleted
    },
    SET_USERID: (state, id) => {
      state.id = id
    },
    SET_USER: (state, userinfo) => {
      state.userinfo = userinfo
      if (!userinfo.perm_user) {
        userinfo.perm_user = []
      }
      if (!userinfo.perm_s2s) {
        userinfo.perm_s2s = []
      }
      if (!userinfo.perm_device) {
        userinfo.perm_device = []
      }
    },
    SET_IMTOKEN: (state, token) => {
      state.im_token = token
    },
    SET_IMID: (state, id) => {
      state.im_id = id
    },
    SHOWSERVICEIFRAME: (state) => {
      state.showserviceIframe = !state.showserviceIframe
    }
  },

  actions: {
    // 登录
    Login({
      commit
    }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          if (response.status === 0) {
            const data = response.data
            setUserId(data.id)
            commit('SET_TOKEN', data.token);
            setToken(data.token);
            // commit('SET_ROLES', data.userinfo.role)
            commit('SET_USERID', data.id);

            // commit('SET_USER', data)
            resolve()
          } else {
            this.$message.error(response.msg)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 注册
    Register({
      commit
    }, userInfo) {
      return new Promise((resolve, reject) => {
        signIn(userInfo).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // // 个人设置
    // UserSet({ commit, state }, userInfo) {
    //   return new Promise((resolve, reject) => {
    //     userSet(userInfo, state.id).then(response => {
    //       resolve(response)
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 获取用户信息
    GetInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        getInfo(state.id).then(response => {
          const data = response.data
          commit('SET_USER_ENABLE', data.enable)
          commit('SET_USER_DELETED', data.deleted)
          commit('SET_USER', data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetIMtoken({
      commit
    }) {
      return new Promise((resolve, reject) => {
        getImToken().then(response => {
          const data = response.data
          commit('SET_IMTOKEN', data.token)
          commit('SET_IMID', data.id)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          console.log('dd')
          removeUserId()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({
      commit
    }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeUserId()
        resolve()
      })
    },
    SHOWSERVICEIFRAME({
      commit
    }) {

      commit("SHOWSERVICEIFRAME")
    }
  }
}

export default user
