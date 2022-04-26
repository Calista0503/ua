<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
    <el-dropdown class="i18n-select" trigger="click">
      <span class="el-dropdown-link">
        {{langString}}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="selectLang('cn')">中文</el-dropdown-item>
        <el-dropdown-item @click.native="selectLang('en')">English</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <i class="icon iconfont icon-mine" style="font-size: large"></i>
        <span class="user-avatar">{{name}}</span>
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <el-dropdown-item @click.native="showUserSet=true">
          <i class="icon iconfont icon-setup" style="font-size: 16px"></i>&nbsp;修改密码
        </el-dropdown-item>
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">
            <i class="icon iconfont icon-guanbi1" style="font-size: 14px"></i>&nbsp;退出登录
          </span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <user-set :showUserSet.sync="showUserSet"></user-set>
  </el-menu>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import UserSet from "./UserSet";

// import { getIMInfoByTopicId } from "@/api";

export default {
  props: {
    tipicId: { type: Number }
  },
  data() {
    return {
      showUserSet: false,
      showServiceIframe: false,
      lang: localStorage.getItem("ua-admin-lang") || "cn"
    };
  },
  created() {},
  components: {
    Breadcrumb,
    Hamburger,
    UserSet
  },
  computed: {
    ...mapGetters(["sidebar", "name"]),
    // eslint-disable-next-line vue/return-in-computed-property
    langString() {
      if (this.lang === "cn") return "中文";
      if (this.lang === "en") return "English";
    }
  },
  methods: {
    selectLang(lang) {
      this.lang = lang;
      localStorage.setItem("ua-admin-lang", lang);
      window.location.reload();
    },
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    },
    logout() {
      this.$store.dispatch("FedLogOut").then(() => {
        location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    }
  },
  watch: {
    "$store.getters.showServiceIframe": function() {
      console.log(this.tipicId);
      this.showServiceIframe = !this.showServiceIframe;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  background-color: #fff;

  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }

  .i18n-select {
    position: absolute;
    right: 180px;
    height: 50px;
  }

  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 60px;

    .avatar-wrapper {
      cursor: pointer;
      position: relative;

      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        margin-right: 5px;
      }

      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 17px;
        font-size: 18px;
        color: #606266;
      }
    }
  }

  #serviceIframe {
    position: fixed;
    right: 10px;
    bottom: 20px;
    z-index: 111;
    border: solid #00ff8b 2px;
  }
}

.top {
  margin: 20px 0 0 0;
}
</style>

