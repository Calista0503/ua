
<template>
  <el-dialog destroy-on-close :close-on-click-modal="false" :title="$t('message.order_details')"
    :visible.sync="dialogVisible" width="800px" @close="close">
    <el-form :model="form" ref="form" v-if="dialogVisible" :label-width="isEnglish?`200px`:`100px`" size="mini">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('message.order_id')}：`">
            <span>{{detail.id}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${$t('message.parent_mch')}：`">
            <span>{{detail.user_mch_name}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('message.platform_order_number')}：`">
            <span>{{detail.mch_withdraw_no}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${$t('message.order_amount')}：`">
            <span v-if="detail.amount">{{Number(detail.amount)/100}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('message.withdraw_method')}：`">
            <span v-if="isVietnam">{{$store.state.ua.vnWithdrawType[detail.withdraw_type]}}</span>
            <span v-else>{{$store.state.ua.withdrawType[detail.withdraw_type]}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${$t('message.receiving_account')}：`">
            <span>{{detail.withdraw_account}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="`幣別：`">
            <span>{{detail.currency_type}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${$t('message.order_status')}：`">
            <span v-if="detail.status">{{$store.state.ua.channelOrderStatus[detail.status]}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 银行卡才展示 -->
      <el-row v-if="detail.withdraw_type === 'bankcard'">
        <el-col :span="12">
          <el-form-item :label="`${$t('message.user_name')}：`">
            <span>{{detail.withdraw_name}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${$t('message.bank_name')}：`">
            <span v-if="detail.withdraw_bank_code">
              <span>{{$store.getters.allBankCodeTypeString[detail.withdraw_bank_code]}}</span>
            </span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        
        <el-col :span="12">
          <el-form-item :label="`${$t('message.operator')}：`">
            <div>{{detail.operator_name}}</div>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="回调状态：">
            <span
              v-if="detail.mch_callback_status"
            >{{$store.state.ua.callbackStatus[detail.mch_callback_status]}}</span>
          </el-form-item>
        </el-col>-->
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('message.create_time')}：`">
            <span>{{detail.created_at}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${$t('message.update_time')}：`">
            <span>{{detail.updated_at}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <!-- 人工处理时才选择 -->
        <el-col :span="12" v-if="method==='handle'">
          <InnerBankChannelSelect prop="bankcard_id" ref="InnerBankChannelSelect" v-model="form.bankcard_id"
            :placeholder="$t('message.please_select')" :title="$t('message.card_number')" />
        </el-col>
        <el-col :span="12" v-else>
          <el-form-item :label="`${$t('message.card_number')}：`" v-if="detail.bankcard_id && detail.bankcard">
            <div>
              {{`${detail.bankcard.id} > ${detail.bankcard.name} - ${this.$store.getters.allBankCodeTypeString[detail.bankcard.bank_name]} - ${detail.bankcard.card_user}`}}
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24" v-if="method==='handle'">
          <el-form-item :label="`${$t('message.remark')}：`">
            <el-input type="textarea" v-model="detail.remark"
              :placeholder="isEnglish?`Remarks must be filled when the score fails`:`下分失败备注必填`" />
          </el-form-item>
        </el-col>
        <el-col :span="24" v-else>
          <el-form-item :label="`${$t('message.remark')}：`" v-if="detail.remark">
            <span>{{detail.remark}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item align="right">
        <el-button v-if="detail.id && method==='handle'" type="danger" @click="fail">{{$t('message.withdrawal_failed')}}
        </el-button>
        <el-button v-if="detail.id && method==='handle'" type="primary" @click="success">
          {{$t('message.complete_withdrawal')}}</el-button>
        <el-button v-if="method==='look'" type="primary" @click="cancel">{{$t('message.close')}}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import {
    manualOrderApi
  } from "@/api/myChannel";
  import InnerBankChannelSelect from "@/components/Select/InnerBankChannelSelect";
  import {
    getIsVietnam
  } from '@/utils/config'
  export default {
    components: {
      InnerBankChannelSelect
    },
    data() {
      return {
        isVietnam: getIsVietnam(),
        dialogVisible: false,
        detail: {},
        method: "", // look（查看）|handle(人工处理)
        isUpdateList: false, // 是否更新列表
        form: {
          bankcard_id: null // 指定银行卡id
        }
      };
    },
    computed: {
      isEnglish() {
        return this.$store.state.ua.isEnglish;
      }
    },
    methods: {
      // 指定提现银行卡
      dispatchBankcard() {
        return new Promise((resolve, reject) => {
          manualOrderApi
            .dispatchBankcard({
              order_id: this.detail.id,
              bankcard_id: this.form.bankcard_id
            })
            .then(res => {
              if (res.status === 0) {
                resolve();
              } else {
                reject("指定提现银行卡失败");
              }
            });
        });
      },
      // 下分成功
      success() {
        console.log(this.detail);
        if (this.form.bankcard_id) {
          this.$confirm(
              this.isEnglish ?
              `After the operation, the status cannot be modified. Are you sure that this order has been withdrawn?` :
              `操作后状态将无法修改,确定该笔订单<span style="color: red">完成下分</span>吗`,
              this.$t("message.hint"), {
                confirmButtonText: this.$t("message.ok"),
                cancelButtonText: this.$t("message.cancel"),
                type: "warning",
                dangerouslyUseHTMLString: true
              }
            )
            .then(() => {
              this.dispatchBankcard().then(
                () => {
                  let data = this.detail.remark != null ? this.detail.remark : "";
                  manualOrderApi
                    .success(this.detail.id, {
                      remark: data
                    })
                    .then(res => {
                      if (res.status === 0) {
                        this.$message({
                          type: "success",
                          message: this.isEnglish ?
                            `Order【<span style="color:red">${
                              this.detail.id
                            }</span>】successfully withdrawn 【<span style="color:red">${Number(
                              this.detail.amount
                            ) / 100}</span> RMB` :
                            `订单【<span style="color:red">${
                              this.detail.id
                            }</span>】成功下分【<span style="color:red">${Number(
                              this.detail.amount
                            ) / 100}</span>】元`,
                          dangerouslyUseHTMLString: true
                        });
                        this.isUpdateList = true;
                        this.dialogVisible = false;
                      }
                    });
                },
                err => {
                  this.$message.error(err);
                }
              );
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: this.$t("message.cancelled")
              });
            });
        } else {
          this.$message.error(
            this.isEnglish ?
            `${this.$t("message.card_number")} must be filled` :
            "派卡编号不能为空"
          );
          return;
        }
      },
      // 下分失败
      fail() {
        if (this.detail.remark === null) {
          this.$message.error(
            this.isEnglish ?
            "Remarks must be filled when withdrawal fails" :
            "下分失败备注不能为空"
          );
          return;
        } else {
          this.$confirm(
              this.isEnglish ?
              `The status cannot be modified after the operation. Are you sure the withdrawal fails?` :
              `操作后状态将无法修改,确定该笔订单<span style="color: red">下分失败</span>吗`,
              this.$t("message.hint"), {
                confirmButtonText: this.$t("message.ok"),
                cancelButtonText: this.$t("message.cancel"),
                type: "warning",
                dangerouslyUseHTMLString: true
              }
            )
            .then(() => {
              if (this.form.bankcard_id) {
                this.dispatchBankcard().then(
                  () => {
                    manualOrderApi
                      .fail(this.detail.id, {
                        remark: this.detail.remark
                      })
                      .then(res => {
                        if (res.status === 0) {
                          this.$message({
                            type: "success",
                            message: this.isEnglish ?
                              `Order【<span style="color:red">${this.detail.id}</span>】 operation【Withdrawal failed】 succeeded` :
                              `订单【<span style="color:red">${this.detail.id}</span>】操作【下分失败】 成功`,
                            dangerouslyUseHTMLString: true
                          });
                          this.isUpdateList = true;
                          this.dialogVisible = false;
                        }
                      });
                  },
                  err => {
                    this.$message.error(err);
                  }
                );
              } else {
                manualOrderApi
                  .fail(this.detail.id, {
                    remark: this.detail.remark
                  })
                  .then(res => {
                    if (res.status === 0) {
                      this.$message({
                        type: "success",
                        message: this.isEnglish ?
                          `Order【<span style="color:red">${this.detail.id}</span>】 operation【Withdrawal failed】 succeeded` :
                          `订单【<span style="color:red">${this.detail.id}</span>】操作【下分失败】 成功`,
                        dangerouslyUseHTMLString: true
                      });
                      this.isUpdateList = true;
                      this.dialogVisible = false;
                    }
                  });
              }
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: this.$t("message.cancelled")
              });
            });
        }
      },
      cancel() {
        this.dialogVisible = false;
      },
      open(id, method) {
        this.method = method;
        manualOrderApi.getDetailById(id).then(res => {
          if (res.status === 0) {
            this.detail = res.data;
          }
        });
        this.dialogVisible = true;
        if (method === "handle") {
          this.$nextTick(() => {
            this.$refs.InnerBankChannelSelect.getOptions(id);
          });
        }
      },
      close() {
        this.detail = {};
        this.method = "";
        this.$emit("onclose", {
          update: this.isUpdateList
        });
        this.isUpdateList = false;
        this.form = {
          bankcard_id: null // 指定银行卡id
        };
      }
    }
  };

</script>
