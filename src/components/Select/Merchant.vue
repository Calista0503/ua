<template>
  <Select v-bind="$attrs" :options="options" :title="title" @change="notify"></Select>
</template>

<script>
// 所属商户筛选。
import Select from "./index";
import { mchApi } from "@/api/mch";

export default {
  components: {
    Select
  },
  props: {
    title: {
      type: String,
      default: "所属商户"
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
      mchApi.getMchList().then(res => {
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
    }
  }
};
</script>
