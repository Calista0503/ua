<template>
  <div class="saveUpdate">
    <el-dialog
      destroy-on-close
      :close-on-click-modal="false"
      :title="`${title}提示`"
      :visible.sync="showDialog"
      @close="close"
      width="400px"
    >
      <el-form v-if="row" :model="form" ref="form" label-width="40px" size="mini">
        <p style="text-align:center;margin-bottom:40px;">
          确定{{title}}商户【{{row.mch_name}}】
          <span
            style="color:red"
          >【{{Number(row.recharge_amount)/100}}】</span>元的充值申请？
        </p>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="2" v-model="form.remark" />
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
import DialogWrapper from "@/components/DialogWrapper";
import { mchApi } from "@/api/mch";

export default {
  components: { DialogWrapper },
  data() {
    return {
      showDialog: false,
      updateList: false,
      form: {
        remark: ""
      },
      row: null,
      title: ""
    };
  },
  methods: {
    relaod() {
      (this.updateList = false),
        (this.form = {
          remark: ""
        });
      this.row = null;
      this.title = "";
    },
    open(row, title) {
      this.row = row;
      this.title = title;
      this.showDialog = true;
    },
    close() {
      this.$emit("onclose", { update: this.updateList });
      this.relaod();
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const data = {
            order_id: this.row.id,
            ...this.form
          };
          if (this.title === "通过") {
            this.$vcode().then(() => {
              mchApi.rechargeAgree(data).then(res => {
                if (res.status === 0) {
                  this.$message.success("充值申请已通过");
                  this.showDialog = false;
                  this.updateList = true;
                }
              });
            });
          }

          if (this.title === "拒绝") {
            this.$vcode().then(() => {
              mchApi.rechargeRefuse(data).then(res => {
                if (res.status === 0) {
                  this.$message.success("充值申请已拒绝");
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



