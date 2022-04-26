
<template>
  <el-dialog destroy-on-close :close-on-click-modal="false" :title="this.id?'编辑通道商':'新增通道商'"
    :visible.sync="dialogVisible" width="400px" @close="close">
    <el-form :model="form" ref="form" label-width="100px" size="mini">
      <el-form-item label="通道商名称" prop="name" :rules="[{ required: true, message: '通道商名称名称不能为空'}]">
        <el-input v-model="form.name" placeholder="请输入"></el-input>
      </el-form-item>
      <!-- 通道商类型-编辑状态不做验证 -->
      <el-form-item label="通道商类型" prop="channel_type" :rules="[{ required: true, message: '通道商类型不能为空'}]">
        <el-select :disabled="!!id" v-model="form.channel_type" placeholder="请选择">
          <el-option v-for="(item, key) in chnnelMchType" :key="key" :label="item" :value="key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="币别" prop="currency_type" :rules="[{ required: true, message: '币别类型不能为空'}]">
        <el-select v-model="form.currency_type" placeholder="请选择" :disabled="!!id">
          <el-option :label="value" :value="value"
            v-for="(value, key) in (isVietnam ? $store.state.ua.vnCurrencyType : $store.state.ua.currencyType)"
            :key="key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="下分类型" prop="withdraw_type" :rules="[{ required: true, message: '下分类型不能为空'}]">
        <el-select v-if="isVietnam" multiple v-model="form.withdraw_type" placeholder="请选择">
          <el-option :label="value" :value="key" v-for="(value,key) in $store.state.ua.vnWithdrawType" :key="key">
          </el-option>
        </el-select>
        <el-select v-else multiple v-model="form.withdraw_type" placeholder="请选择">
          <el-option :label="value" :value="key" v-for="(value,key) in $store.state.ua.withdrawType" :key="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="后台地址" prop="console_url">
        <el-input v-model="form.console_url" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="当前状态">
        <el-switch v-model="form.enable" @change="switchChange"></el-switch>
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
  import {
    channelMchApi
  } from "@/api/channel";
  import {
    getIsVietnam
  } from '@/utils/config'

  export default {
    props: ["chnnelMchType"],
    data() {
      return {
        isVietnam: getIsVietnam(),
        dialogVisible: false,
        updateList: false, // 弹窗关闭时是否更新列表
        id: null,
        form: {
          name: "",
          console_url: "",
          channel_type: "",
          remark: "",
          currency_type: "",
          enable: true,
          withdraw_type: [],
          currency_type: ""
        }
      };
    },
    methods: {
      // 编辑回显
      getDetailById(id) {
        channelMchApi.getById(id).then(res => {
          if (res.status === 0) {
            this.form.name = res.data.name;
            this.form.console_url = res.data.console_url;
            this.form.remark = res.data.remark ? res.data.remark : "";
            this.form.enable = res.data.enable;
            this.form.channel_type = res.data.channel_type;
            this.form.currency_type = res.data.currency_type;
            this.form.withdraw_type = res.data.withdraw_type ?
              res.data.withdraw_type :
              [];
          }
        });
      },
      submit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            if (this.id) {
              // 编辑
              this.$vcode().then(() => {
                channelMchApi.put({
                  id: this.id,
                  data: this.form
                }).then(res => {
                  if (res.status === 0) {
                    this.$message.success(`通道商【${this.form.name}】编辑成功`);
                    this.updateList = true;
                    this.dialogVisible = false;
                  }
                });
              });
            } else {
              // 新增
              channelMchApi.post(this.form).then(res => {
                if (res.status === 0) {
                  this.$message.success(`通道商【${this.form.name}】新增成功`);
                  this.updateList = true;
                  this.dialogVisible = false;
                }
              });
            }
          }
        });
      },
      cancel() {
        this.dialogVisible = false;
      },
      open(id) {
        if (id) {
          this.id = id;
          this.getDetailById(id);
        }
        this.dialogVisible = true;
      },
      close() {
        this.$emit("onclose", {
          update: this.updateList
        });
        this.form = {
          name: "",
          console_url: "",
          remark: "",
          enable: true,
          channel_type: "",
          withdraw_type: [],
          currency_type: ""
        };
        this.id = null;
        this.updateList = false;
      },
      // 切换状态需要警告提示
      switchChange(val) {
        this.$confirm(
            `确定${val ? "启用" : "禁用"}通道商【${this.form.name}】吗`,
            "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
          .then(() => {})
          .catch(() => {
            this.form.enable = !val;
          });
      }
    }
  };

</script>
