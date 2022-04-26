
<template>
  <el-dialog
    destroy-on-close
    :close-on-click-modal="false"
    title="通道商充值"
    :visible.sync="dialogVisible"
    width="400px"
    @close="close"
  >
    <el-form :model="form" ref="form" label-width="100px" size="mini">
      <el-form-item label="通道商名称" prop="name">
        <el-input :disabled="true" v-model="form.name" placeholder></el-input>
      </el-form-item>

      <el-form-item label="当前余额" prop="balance">
        <el-input :disabled="true" v-model="form.balance" placeholder></el-input>
      </el-form-item>

      <el-form-item
        label="充值金额"
        prop="recharge_amount"
        :rules="[{ required: true, message: '充值金额不能为空'}]"
      >
        <el-input v-model="form.recharge_amount" placeholder="请输入"></el-input>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :rows="2" placeholder="请输入" v-model="form.remark" />
      </el-form-item>
      <el-form-item align="right">
        <el-button type @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { channelMchApi } from "@/api/channel";

export default {
  data() {
    return {
      dialogVisible: false,
      updateList: false, // 弹窗关闭时是否更新列表
      form: {
        recharge_amount: "",
        channel_provider_id: "",
        balance: "",
        remark: "",
        name: ""
      }
    };
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let { channel_provider_id, recharge_amount, remark } = this.form;
          channel_provider_id = Number(channel_provider_id);
          recharge_amount = Number(recharge_amount) * 100;

          this.$vcode().then(() => {
            channelMchApi
              .recharge({ channel_provider_id, recharge_amount, remark })
              .then(res => {
                if (res.status === 0) {
                  this.$message.success(`充值成功`);
                  this.updateList = true;
                  this.dialogVisible = false;
                }
              });
          });
        }
      });
    },
    cancel() {
      this.dialogVisible = false;
    },
    open(row) {
      const { id: channel_provider_id, balance, name } = row;

      this.form.channel_provider_id = channel_provider_id;
      this.form.balance = String(Number(balance) / 100);
      this.form.name = name;

      this.dialogVisible = true;
    },
    close() {
      this.$emit("onclose", { update: this.updateList });
      this.form = {
        recharge_amount: "",
        channel_provider_id: "",
        balance: "",
        remark: "",
        name: ""
      };
      this.info = null;
      this.updateList = false;
    }
  }
};
</script>