<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎【{{name}}】使用{{PROJECTNAME}}</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { PROJECTNAME } from "@/utils/config";

export default {
  name: "dashboard",
  data() {
    return {
      PROJECTNAME,
      q: { merchant: 1 }
    };
  },
  computed: {
    ...mapGetters(["name"])
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
