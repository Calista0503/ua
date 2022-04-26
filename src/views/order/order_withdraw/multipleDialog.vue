
<template>
  <!-- 批量操作的弹窗 -->
  <el-dialog
    destroy-on-close
    :close-on-click-modal="false"
    :title="`${isEnglish?'Multiple ':'批量'}${titleString}`"
    :visible.sync="dialogVisible"
    width="400px"
    @close="close"
  >
    <el-form v-if="method" :label-width="isEnglish?'150px':'100px'" size="mini">
      <el-form-item :label="`${$t('message.order_info')}：`">
        <span>{{this.order.info}}</span>
      </el-form-item>
      <el-form-item :label="`${$t('message.order_status')}：`">
        <span>{{this.order.status}}</span>
      </el-form-item>
      <el-form-item :label="`${$t('message.callback_status')}：`">
        <span>{{this.order.callbackStatus}}</span>
      </el-form-item>

      <el-form-item :label="`${$t('message.operation_type')}：`">
        <span>{{this.titleString}}</span>
      </el-form-item>

      <el-form-item align="right">
        <el-button type @click="cancel">{{$t('message.cancel')}}</el-button>
        <el-button type="primary" @click="submit">{{$t('message.ok')}}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { orderApi } from "@/api/order";

export default {
  data() {
    return {
      dialogVisible: false,
      updateList: false, // 弹窗关闭时是否更新列表
      method: "", // refresh刷新|callback回调|push推送
      orderList: []
    };
  },
  computed: {
    isEnglish() {
      return this.$store.state.ua.isEnglish;
    },
    titleString() {
      if (this.method === "refresh") return this.$t("message.refresh");
      if (this.method === "push") return this.$t("message.push");
      if (this.method === "callback") return this.$t("message.callback");
      return "";
    },
    // 需要显示的信息
    order() {
      const count = 3;
      if (this.method === "refresh") {
        return {
          info: `${this.orderList.slice(0, count).join("，")}${
            this.orderList.length > count
              ? this.isEnglish
                ? ` ...${this.orderList.length} orders`
                : "...等" + this.orderList.length + "个订单"
              : ""
          }`,
          status: this.$store.state.ua.orderStatus["commit"],
          callbackStatus: this.$store.state.ua.callbackStatus["new"]
        };
      }

      if (this.method === "callback") {
        return {
          info: `${this.orderList.slice(0, count).join("，")}${
            this.orderList.length > count
              ? this.isEnglish
                ? ` ...${this.orderList.length} orders`
                : "...等" + this.orderList.length + "个订单"
              : ""
          }`,
          status: this.isEnglish
            ? `Withdrawn/Rejected/Withdrawal failed`
            : "已下分/已拒绝/下分失败",
          callbackStatus: this.$store.state.ua.callbackStatus["fail"]
        };
      }

      if (this.method === "push") {
        return {
          info: `${this.orderList.slice(0, count).join("，")}${
            this.orderList.length > count
              ? this.isEnglish
                ? ` ...${this.orderList.length} orders`
                : "...等" + this.orderList.length + "个订单"
              : ""
          }`,
          status: this.$store.state.ua.orderStatus["third_unknown"],
          callbackStatus: this.$store.state.ua.callbackStatus["new"]
        };
      }

      return {};
    }
  },
  methods: {
    submit() {
      if (this.method) {
        if (this.method =='push'){
          this.$confirm(
            this.isEnglish
              ? `Before pushing, make sure that the order is not received by the current channel. Are you sure you want to push?`
              : `推送前需确保当前通道没有收到该订单，是否确定推送？`,
            this.isEnglish ? `Push hint` : "推送提示",
            {
              confirmButtonText: this.$t("message.ok"),
              cancelButtonText: this.$t("message.cancel"),
              type: "warning",
              dangerouslyUseHTMLString: true
            }
          )
            .then(() => {
              orderApi[this.method](this.orderList).then(res => {
                if (res.status === 0) {
                  if (
                    res.data &&
                    res.data.result &&
                    res.data.result.length &&
                    res.data.result.length > 0
                  ) {
                    res.data.result.forEach((item, index) => {
                      this.$message({
                        type: "error",
                        showClose: true,
                        message: `订单【${item.order_id}】${this.titleString}失败 - 【${item.biz}】`,
                        duration: 5000,
                        offset: 20 + index * 50
                      });
                    });

                    this.updateList = true;
                    this.dialogVisible = false;
                  } else {
                    this.$message.success(`批量${this.titleString}全部成功`);
                    this.updateList = true;
                    this.dialogVisible = false;
                  }
                }
                this.updateList = true;
                this.dialogVisible = false;
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: this.$t("message.cancelled")
              });
            });
        }else {
          orderApi[this.method](this.orderList).then(res => {
            if (res.status === 0) {
              if (
                res.data &&
                res.data.result &&
                res.data.result.length &&
                res.data.result.length > 0
              ) {
                res.data.result.forEach((item, index) => {
                  this.$message({
                    type: "error",
                    showClose: true,
                    message: `订单【${item.order_id}】${this.titleString}失败 - 【${item.biz}】`,
                    duration: 5000,
                    offset: 20 + index * 50
                  });
                });

                this.updateList = true;
                this.dialogVisible = false;
              } else {
                this.$message.success(`批量${this.titleString}全部成功`);
                this.updateList = true;
                this.dialogVisible = false;
              }
            }
          });
        }

      }
    },
    cancel() {
      this.dialogVisible = false;
    },
    open({ method, ids }) {
      this.method = method;
      this.orderList = ids;
      this.dialogVisible = true;
    },
    close() {
      this.$emit("onclose", { update: this.updateList });
      this.method = "";
      this.orderList = [];
      this.updateList = false;
    }
  }
};
</script>
