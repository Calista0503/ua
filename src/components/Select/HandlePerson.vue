<template>
  <Select v-bind="$attrs" :options="options" :title="title" @change="notify"></Select>
</template>

<script>
// 处理人筛选。
import Select from "./index";
import { getUserList } from "@/api/index";

export default {
  components: {
    Select
  },
  props: {
    title: {
      type: String,
      default: "处理人"
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
      getUserList({ page_size: 1000, page_no: 1 }).then(res => {
        if (res.status === 0) {
          this.options = res.data.items.map(item => ({
            id: item.id,
            name: item.name
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
