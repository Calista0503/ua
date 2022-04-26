<template>
  <Select v-bind="$attrs" :options="options" :title="title" @change="notify"></Select>
</template>

<script>
// 所属商户筛选。
import Select from "./index";
import { bankApi } from "@/api/myChannel";
import {getIsVietnam} from '@/utils/config'
export default {
  components: {
    Select
  },
  props: {
    title: {
      type: String,
      default: "派卡编号"
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
      bankApi.get({ page_size: 1000, page_no: 1 }).then(res => {
        if (res.status === 0) {
            this.options = res.data.items.map(item => ({
              id: item.id,
              name: `${item.name} - ${
                this.$store.getters.allBankCodeTypeString[item.bank_name]
              } - ${item.card_user}`
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
