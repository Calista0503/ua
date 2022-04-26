<template>
  <div class="saveUpdate">
    <el-dialog
      destroy-on-close
      :close-on-click-modal="false"
      :title="id?'编辑类型':'新增类型'"
      :visible.sync="showDialog"
      @close="close"
      width="400px"
    >
      <el-form inline :model="form" ref="form" label-width="100px" size="mini">
        <el-form-item
          label="类型名称"
          prop="name"
          :rules="[{ required: true, message: '商户名称不能为空'}]"
        >
          <el-input placeholder="请输入" type="text" v-model="form.name" />
        </el-form-item>
        <el-form-item label="币别" prop="currency_type" :rules="[{ required: true, message: '币别类型不能为空'}]">
          <el-select v-model="form.currency_type"  placeholder="请选择" :disabled="!!id">
              <el-option :label="value" :value="value"
                v-for="(value, key) in (isVietnam ? $store.state.ua.vnCurrencyType : $store.state.ua.currencyType)"
                :key="key"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="2" placeholder="请输入" v-model="form.remark" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false;" size="small">取 消</el-button>
        <el-button type="primary" @click="submit" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mchApi } from "@/api/mch";
import {getIsVietnam} from '@/utils/config';

export default {
  name: "saveUpdate",
  data() {
    return {
      id: null,
      showDialog: false,
      updateList: false, // 关闭弹窗时是否更新列表
      form: {
        currency_type: null
      },
      isVietnam: getIsVietnam()
    };
  },

  methods: {
    // 打开弹窗，外部调用，有id时是编辑
    open(row) {
      if (row) {
        this.id = row.id;
        let { remark, name ,currency_type} = row;
        remark = remark || "";
        this.form = { remark, name ,currency_type };
      }
      this.showDialog = true;
    },
    close() {
      this.$emit("onclose", { update: this.updateList });
      this.reload();
    },
    reload() {
      this.id = null;
      this.form = {};
    },

    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 新增
          if (!this.id) {
            this.$vcode().then(() => {
              let data = this.$qfilter(this.form);
              mchApi.mchTypePost(data).then(res => {
                if (res.status === 0) {
                  this.$message({
                    type: "success",
                    message: `类型【${this.form.name}】创建成功`
                  });
                  this.showDialog = false;
                  this.updateList = true;
                }
              });
            });
          } else {
            this.$vcode().then(() => {
              let data = this.$qfilter(this.form);
              mchApi.mchTypePut(this.id, data).then(res => {
                if (res.status === 0) {
                  this.$message({
                    type: "success",
                    message: `类型【${this.form.name}】编辑成功`
                  });
                  this.showDialog = false;
                  this.updateList = true;
                }
              });
            });
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.content-block {
  background: #f3fbf5;
  margin: 5px 0;
  border: 1px dotted #ccc;
  padding-top: 10px;
}
</style>



