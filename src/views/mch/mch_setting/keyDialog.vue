
<template>
  <el-dialog
    destroy-on-close
    :close-on-click-modal="false"
    title="密钥管理"
    :visible.sync="dialogVisible"
    width="400px"
    @close="close"
  >
    <el-form>
      <el-form-item label="商户名称">{{name}}</el-form-item>
      <el-form-item label="商户密钥">{{api_key}}</el-form-item>
      <el-form-item align="right">
        <el-button type @click="updateKey">更新</el-button>
        <el-button type="primary" @click="copyKey">复制</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { mchApi } from "@/api/mch";

export default {
  data() {
    return {
      dialogVisible: false,
      name: "",
      api_key: "",
      id: null
    };
  },
  methods: {
    open(id) {
      if (!id) {
        this.$message({
          type: "error",
          message: "id不存在"
        });
        return;
      }
      this.id = id;
      mchApi.getKeyById(id).then(res => {
        if (res.status === 0) {
          this.api_key = res.data.api_key;
          this.name = res.data.name;
        }
      });
      this.dialogVisible = true;
    },
    close() {
      this.name = "";
      this.api_key = "";
      this.id = null;
    },
    // 更新密钥
    updateKey() {
      if (!this.id) {
        this.$message.error("id不存在");
      }
      this.$confirm(
        "更新密钥将影响当前商户功能使用，确定要更新密钥吗?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$vcode().then(() => {
            mchApi.updateKeyById(this.id).then(res => {
              if (res.status === 0) {
                this.api_key = res.data.api_key;
                this.$message.success("更新成功");
              }
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消更新"
          });
        });
    },
    // 复制
    copyKey() {
      let oInput = document.createElement("input");
      oInput.value = this.api_key; //赋值
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      oInput.className = "oInput";
      oInput.style.display = "none";
      document.body.removeChild(oInput);
      this.$message.success("商户密钥已复制到剪切板");
    }
  }
};
</script>
