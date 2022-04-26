<template>
  <Select v-bind="$attrs" :options="options" :title="title" @change="notify"></Select>
</template>

<script>
// 派卡编号
import Select from "./index";
import { manualOrderApi } from "@/api/myChannel";
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
    getOptions(order_id) {
      if (!order_id) {
        this.$message.error("订单id不存在");
        return;
      }

      manualOrderApi.getBankcard(order_id).then(res => {
        if (res.status === 0) {
          this.options = res.data.map(item => ({
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
