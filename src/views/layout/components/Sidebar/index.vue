<template>
  <scroll-bar>
    <div class="sidebar-title" v-show="!isCollapse">
      <div class="titleLogo">{{PROJECTNAME}}</div>
    </div>
    <el-menu mode="vertical" :show-timeout="200" :default-active="$route.path" :collapse="isCollapse" background-color="#304156" text-color="#bfcbd9" active-text-color="#409EFF">
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'
import { PROJECTNAME } from '@/utils/config';

export default {
  components: { SidebarItem, ScrollBar },
   data(){
      return {
        PROJECTNAME
      }
    },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<style>
  .sidebar-title {
    height: 60px;
    line-height: 50px;
    color: #fff;
    font-size: 20px;
    text-align: center;
  }
</style>
