<template>
  <el-dialog
    destroy-on-close
    :close-on-click-modal="false"
    :title="isEnglish?'Order exception handling':'订单异常处理'"
    :visible.sync="dialogVisible"
    width="560px"
    @close="close"
  >
    <span style="margin-left: 20px">只能针对<span style="color: red">第三方已经处理但当前状态异常</span>的订单进行处理</span>
    <el-form style="margin-top: 20px" :model="form" ref="form" :label-width="isEnglish?'120px':'100px'" size="mini">
      <el-form-item
        :label="$t('message.platform_order_number')"
        prop="order_no"
        :rules="[{ required: true, message: $t('message.required',[$t('message.platform_order_number')])}]"
      >
        <el-input
          style="width: 320px"
          type="text"
          :placeholder="$t('message.please_input')"
          v-model="form.order_no"
        />
        <el-button style="margin-left: 10px" type="warning" @click="query">{{$t('message.search')}}</el-button>
      </el-form-item>

      <el-form-item
        v-if="form.status"
        :label="$t('message.order_status')"
        prop="status"
      >
        <el-select disabled v-model="form.status" :placeholder="$t('message.please_select')" clearable style="width: 320px">
          <el-option
            v-for="(value,key) in $store.state.ua.orderStatus"
            :key="value"
            :label="value"
            :value="key"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="form.amount"
        :label="$t('message.order_amount')"
        prop="amount"
      >
        <el-input
          disabled
          style="width: 320px"
          type="text"
          :placeholder="$t('message.please_input')"
          v-model="form.amount"
        />
      </el-form-item>

      <el-form-item
        v-if="form.status==='commit' || form.status==='third_unknown' ||form.status == 'third_fail'"
        :label="$t('message.process_result')"
        prop="process_result"
        :rules="[{ required: true, message: $t('message.required',[$t('message.process_result')])}]"
      >
        <el-select v-model="form.process_result" :placeholder="$t('message.please_select')" clearable style="width: 320px">
          <el-option
            v-for="(value,key) in $store.state.ua.processResult"
            :key="value"
            :label="value"
            :value="key"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="form.process_result==='fail'"
        :label="$t('message.remark')"
        prop="remark"
        :rules="[{ required: true, message: $t('message.required',[$t('message.remark')])}]"
      >
        <el-input
          style="width: 320px"
          type="textarea"
          :rows="2"
          :placeholder="$t('message.please_input')"
          v-model="form.remark"
        />
      </el-form-item>

      <el-form-item align="right">
        <el-button type @click="cancel">{{$t('message.cancel')}}</el-button>
        <el-button v-if="form.status==='commit' || form.status==='third_unknown' || form.status == 'third_fail'" type="primary" @click="submit">{{$t('message.ok')}}</el-button>
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
      form: {}
    };
  },
  computed: {
    isEnglish() {
      return this.$store.state.ua.isEnglish;
    }
  },
  methods: {
    query() {
      this.$refs.form.validate(valid => {
        if (valid) {
          orderApi.getDetailByNo(this.form.order_no).then(res => {
            if (res.status===0) {
              this.form = res.data
              if (this.form.amount) {
                this.form.amount = Number(this.form.amount / 100).toFixed(2)
              }
            }
          })
          }
        })
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.process_result==='success') {
            //下分成功
            orderApi.order_modify_success({order_no: this.form.order_no}).then(res => {
              if (res.status===0) {
                this.$message({
                  type: "success",
                  message: `${this.$t('message.successful_operation')}`
                });
                this.updateList = true;
                this.dialogVisible = false;
              }
            })

          }else {
            //下分失败
            orderApi.order_modify_fail({order_no: this.form.order_no, remark: this.form.remark}).then(res => {
              if (res.status===0) {
                this.$message({
                  type: "success",
                  message: `${this.$t('message.successful_operation')}`
                });
                this.updateList = true;
                this.dialogVisible = false;
              }
            })
          }

        }
      });
    },
    cancel() {
      this.dialogVisible = false;
    },
    open() {
      this.dialogVisible = true;
    },
    close() {
      this.$emit("onclose", { update: this.updateList });
      this.form = {};
      this.updateList = false;
    }
  }
};
</script>
