<template>
  <Select v-bind="$attrs" :options="options" :title="title" @change="notify"></Select>
</template>

<script>
// 通道名称筛选。
import Select from "./index";
import { channelApi } from "@/api/channel";

export default {
  components: {
    Select
  },
  props: {
    title: {
      type: String,
      default: "通道名称"
    }
  },
  data() {
    return {
      options: []
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
            id: Object.values(item)[1]
          }));
        }
      });
    },
    refresh() {
      this.getOptions();
    }
  },
  watch: {
    options: {
      handler: function() {
        this.$emit("getOptions", this.options);
      },
      immediate: true
    }
  }
};
</script>