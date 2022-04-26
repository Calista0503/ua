<template>
  <Select v-bind="$attrs" :options="options" :title="title" @change="notify"></Select>
</template>

<script>
// 所属商户筛选。
import Select from "./index";
import { channelMchApi } from "@/api/channel";

export default {
  components: {
    Select
  },
  props: {
    title: {
      type: String,
      default: "通道商"
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
      let selectItem = this.options.find(e => e.id === id);
      this.$emit("changeCallBack", selectItem);
      this.$emit("input", id);
    },
    getOptions() {
      channelMchApi.getChanneMchlList().then(res => {
        if (res.status === 0) {
          this.options = res.data.map(item => ({
            id: Object.values(item)[0],
            name: Object.values(item)[1],
            channel_type: Object.values(item)[2]
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
    }
  }
};
</script>