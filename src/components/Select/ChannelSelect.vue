<template>
  <Select v-bind="$attrs" :options="options" :title="title" @change="notify"></Select>
</template>

<script>
// 关联通道筛选，注意这个是和通道商联通的，和别的下拉有区别
import Select from "./index";
import { channelApi } from "@/api/channel";

export default {
  components: {
    Select
  },
  props: {
    title: {
      type: String,
      default: "通道"
    },
    condition: {
      type: Object,
      default: () => {}
    },
    api: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      options: [],
    };
  },
  activated() {
    this.getOptions();
  },
  methods: {
    notify(id) {
      this.$emit("input", id);
    },
    getOptions() {
      channelApi.getChanneList().then(res => {
        if (res.status === 0) {
          this.options = res.data.map(item => ({
            id: Object.values(item)[0],
            name: Object.values(item)[1]
          }));
        }
      });
    
    }
  },
  watch: {
    options: {
      handler: function() {
        this.$emit("getOptions", this.options);
      },
      immediate: true
    },
    condition: {
      handler: function(val, oldval) {
        // 查询条件变化才请求新的值
        if (val === oldval) return;

        let isEqual = true;
        if (
          val !== oldval &&
          typeof val == "object" &&
          typeof oldval == "object"
        ) {
          for (let key in val) {
            if (val[key] !== oldval[key]) {
              isEqual = false;
              break;
            }
          }
        } else {
          isEqual = false;
        }
        if (isEqual) return;
        this.$emit("input", "");
        this.getOptions();
      },
      immediate: true
    }
  }
};
</script>