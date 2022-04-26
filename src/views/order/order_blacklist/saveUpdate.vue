<template>
  <el-dialog
    destroy-on-close
    :close-on-click-modal="false"
    :title="isEnglish?'Add blacklist':'添加黑名单'"
    :visible.sync="dialogVisible"
    width="400px"
    @close="close"
  >
    <el-form :model="form" ref="form" :label-width="isEnglish?'120px':'100px'" size="mini">
      <el-form-item
        :label="$t('message.account_type')"
        prop="account_type"
        :rules="[{ required: true, message: $t('message.required',[$t('message.account_type')])}]"
      >
        <el-select v-model="form.account_type" :placeholder="$t('message.please_select')" clearable>
          <el-option
            v-for="(value,key) in $store.state.ua.withdrawType"
            :key="value"
            :label="value"
            :value="key"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        :label="$t('message.account')"
        prop="account_number"
        :rules="[{ required: true, message: $t('message.required',[$t('message.account')])}]"
      >
        <el-input
          type="textarea"
          :rows="2"
          :placeholder="isEnglish?'Separate multiple accounts with commas':'多个账号请用英文逗号隔开'"
          v-model="form.account_number"
        />
      </el-form-item>

      <el-form-item :label="$t('message.remark')" prop="remark">
        <el-input
          type="textarea"
          :rows="2"
          :placeholder="$t('message.please_input')"
          v-model="form.remark"
        />
      </el-form-item>
      <el-form-item align="right">
        <el-button type @click="cancel">{{$t('message.cancel')}}</el-button>
        <el-button type="primary" @click="submit">{{$t('message.ok')}}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { blackListApi } from "@/api/order";

export default {
  data() {
    return {
      dialogVisible: false,
      updateList: false, // 弹窗关闭时是否更新列表
      form: {
        account_type: "",
        account_number: "",
        remark: ""
      }
    };
  },
  computed: {
    isEnglish() {
      return this.$store.state.ua.isEnglish;
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 新增
          blackListApi.post({ ...this.form }).then(res => {
            if (res.status === 0) {
              this.$message.success(
                this.isEnglish ? `Added successfully` : `新增成功`
              );
              this.updateList = true;
              this.dialogVisible = false;
            }
          });
        }
      });
    },
    cancel() {
      this.dialogVisible = false;
    },
    open(id) {
      this.dialogVisible = true;
    },
    close() {
      this.$emit("onclose", { update: this.updateList });
      this.form = {
        account_type: "",
        account_number: "",
        remark: ""
      };
      this.updateList = false;
    }
  }
};
</script>
