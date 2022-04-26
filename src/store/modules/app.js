import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get("sidebarStatus"),
      withoutAnimation: false
    },
    listReq: {
      $size: 30,
      $page: 1
    },
    pageSizeArr: [10, 30, 100, 200, 500, 1000],
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set("sidebarStatus", 1);
      } else {
        Cookies.set("sidebarStatus", 0);
      }
      state.sidebar.opened = !state.sidebar.opened;
    },
    CHANGE_SHOWSERVICEIFRAME: state => {
      this.state.showServiceIframe = !this.state.showServiceIframe;
    }
  },
  actions: {
      ToggleSideBar: ({ commit }) => {
      commit("TOGGLE_SIDEBAR");
    },
    CHANGE_SHOWSERVICEIFRAME: ({ commit }) => {
      commit("CHANGE_SHOWSERVICEIFRAME");
    }
  }
};

export default app
