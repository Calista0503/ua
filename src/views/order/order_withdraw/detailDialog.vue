
<template>
  <!-- 批量操作的弹窗 -->
  <el-dialog
    destroy-on-close
    :close-on-click-modal="false"
    :title="$t('message.order_details')"
    :visible.sync="dialogVisible"
    width="800px"
    @close="close"
  >
    <el-form v-if="dialogVisible" :label-width="labelWidth" size="mini">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('message.user_id')}：`">
            <span>{{detail.user_id}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${$t('message.parent_mch')}：`">
            <span>{{detail.mch_name}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('message.current_channel')}：`">
            <span>{{detail.channel_name}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${$t('message.order_id')}：`">
            <span>{{detail.id}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('message.mch_order')}：`">
            <span>{{detail.mch_withdraw_no}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${$t('message.withdraw_amount')}：`">
            <span v-if="detail.amount">{{Number(detail.amount)/100}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('message.currency_type')}：`">
            <span>{{detail.currency_type}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('message.withdraw_method')}：`">
            <span>{{$store.state.ua.withdrawType[detail.withdraw_type]}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${$t('message.receiving_account')}：`">
            <span>{{detail.withdraw_account}}</span>
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
            <span
              v-if="detail.withdraw_bank_code"
            >
              <span>{{$store.getters.allBankCodeTypeString[detail.withdraw_bank_code]}}</span>
            </span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('message.order_status')}：`">
            <span v-if="detail.status">{{$store.state.ua.orderStatus[detail.status]}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${$t('message.callback_status')}：`">
            <span
              v-if="detail.mch_callback_status"
            >{{$store.state.ua.callbackStatus[detail.mch_callback_status]}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('message.create_time')}：`">
            <span>{{detail.created_at}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${$t('message.success_time')}：`">
            <span>{{detail.success_at}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('message.last_update_time')}：`">
            <span>{{detail.updated_at}}</span>
          </el-form-item>
        </el-col>
         <el-col :span="12">
          <el-form-item :label="`${$t('message.platform_order_number')}：`">
            <span>{{detail.order_no}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item :label="`${$t('message.channel_remark')}：`">
            <div>{{detail.channel_remark}}</div>
          </el-form-item>
        </el-col>
      </el-row>

<!--      <el-row>-->
<!--        <el-col :span="24">-->
<!--          <el-form-item :label="`${$t('message.mch_remark')}：`">-->
<!--            <span>{{detail.mch_remark}}</span>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--      </el-row>-->

      <el-form-item align="right">
        <el-button type @click="cancel">关闭</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { orderApi } from "@/api/order";
import {getIsVietnam} from '@/utils/config'
const isEnglish = localStorage.getItem("ua-admin-lang") === "en";

export default {
  data() {
    return {
      isVietnam: getIsVietnam(),
      dialogVisible: false,
      detail: {},
      labelWidth: isEnglish ? "180px" : "120px"
    };
  },
  methods: {
    cancel() {
      this.dialogVisible = false;
    },
    open(id) {
      orderApi.getDetailById(id).then(res => {
        if (res.status === 0) {
          this.detail = res.data;
        }
      });
      this.dialogVisible = true;
    },
    close() {
      this.detail = {};
    }
  }
};
</script>
