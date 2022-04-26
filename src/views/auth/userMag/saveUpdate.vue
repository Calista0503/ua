<template>
  <div class="saveUpdate">
    <el-dialog
      :close-on-click-modal="false"
      :title="id?'编辑用户':'新增用户'"
      :visible.sync="showDialog"
      @close="$emit('update:showUpdate', false)"
      :showUpdate="showUpdate"
      width="600px"
    >
      <el-form :model="DetailInfo" ref="saveChn" label-width="120px" size="mini">
        <dialog-wrapper>
          <el-form-item label="用户名:" prop="name" :rules="[{ required: true, message: '名称不能为空'}]">
            <el-input placeholder="请输入用户名" v-model="DetailInfo.name" autocomplete="off" :disabled="!!id"></el-input>
          </el-form-item>
          <el-form-item
            v-if="!id"
            label="用户密码:"
            prop="password"
            :rules="[{ required: true, message: '密码不能为空'}]"
          >
            <el-input placeholder="密码必须含有大小写字母，且至少6位" v-model="DetailInfo.password" autocomplete="off" type="password"></el-input>
          </el-form-item>
          <el-form-item label="关联角色:">
            <el-select v-model="role_ids" clearable placeholder="请选择关联角色">
              <el-option
                v-for="(value, key) in rolelist"
                :key="key"
                :label="value"
                :value="parseInt(key)"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="商务组长:" v-if="showParent">
            <el-select v-model="DetailInfo.parent_id" clearable placeholder="请选择">
              <el-option
                v-for="value in Parents"
                :key="value.id"
                :label="value.name"
                :value="value.id"
              ></el-option>
            </el-select>
          </el-form-item>-->
          <!-- <el-form-item label="是否启用：">
            <el-switch v-model="DetailInfo.enable"></el-switch>
          </el-form-item>-->
          <!--<div style="margin-bottom: 20px">-->
          <!--<div style="margin-bottom: 8px">每日设备数据权限: &nbsp;&nbsp;-->
          <!--<el-checkbox :indeterminate="deviceIsCheck" v-model="deviceAll" @change="CheckAllDevice">全选</el-checkbox>-->
          <!--</div>-->
          <!--<el-checkbox-group v-model="deviceCheckeds" @change="CheckDevices">-->
          <!--<el-checkbox v-for="(value,key) in devicePrems" :label="key" :key="key">{{value}}</el-checkbox>-->
          <!--</el-checkbox-group>-->
          <!--</div>-->
          <!--<div style="margin-bottom: 20px">-->
          <!--<div style="margin-bottom: 8px">每日s2s分析数据权限:-->
          <!--<el-checkbox :indeterminate="s2sIsCheck" v-model="s2sAll" @change="CheckAllS2s">全选</el-checkbox>-->
          <!--</div>-->
          <!--<el-checkbox-group v-model="s2sCheckeds" @change="CheckS2s">-->
          <!--<el-checkbox v-for="(value,key) in s2sPrems" :label="key" :key="key">{{value}}</el-checkbox>-->
          <!--</el-checkbox-group>-->
          <!--</div>-->
          <!--<div style="margin-bottom: 20px">-->
          <!--<div style="margin-bottom: 8px">每日用户分析数据权限: &nbsp;&nbsp;-->
          <!--<el-checkbox :indeterminate="userIsCheck" v-model="userAll" @change="CheckAllUser">全选</el-checkbox>-->
          <!--</div>-->
          <!--<el-checkbox-group v-model="userCheckeds" @change="CheckUsers">-->
          <!--<el-checkbox v-for="(value,key) in userPrems" :label="key" :key="key">{{value}}</el-checkbox>-->
          <!--</el-checkbox-group>-->
          <!--</div>-->
        </dialog-wrapper>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$emit('update:showUpdate', false)" size="small">取 消</el-button>
        <el-button
          v-if="id"
          type="primary"
          :loading="loading"
          @click="updateDetail"
          size="small"
        >确 定</el-button>
        <el-button v-else type="primary" :loading="loading" @click="saveDetail" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import DialogWrapper from "@/components/DialogWrapper";
import { getUserDetail, saveAddUser, editUserDetail } from "@/api";

export default {
  components: { DialogWrapper },
  data() {
    return {
      // deviceAll: false,
      // deviceCheckeds: [],
      // devicePrems: devicePremList,
      // deviceIsCheck: false,
      // s2sAll: false,
      // s2sCheckeds: [],
      // s2sPrems: s2sPremList,
      // s2sIsCheck: false,
      // userAll: false,
      // userCheckeds: [],
      // userPrems: userPremList,
      // userIsCheck: false,

      showDialog: this.showUpdate,
      loading: false,
      DetailInfo: {
        enable: true
      },
      role_ids: [],
      accountType: this.$store.state.app.accountType,
      showParent: false,
      Parents: []
    };
  },
  props: {
    showUpdate: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number
    },
    rolelist: {
      type: Object
    }
  },
  created() {
    if (this.id) {
      this.getDetail();
    }
  },
  methods: {
    saveDetail() {
      if (!this.role_ids || this.role_ids == null || this.role_ids == "") {
        this.$message({ message: "请关联角色", type: "error" });
        return;
      }
      this.$refs.saveChn.validate(valid => {
        if (valid) {
          this.$vcode().then(() => {
            let roleid = [];
            if (this.role_ids) {
              roleid.push(this.role_ids);
            }
            roleid.push(this.role_ids);
            Object.assign(this.DetailInfo, { role_ids: roleid });
            saveAddUser(this.DetailInfo).then(res => {
              if (res.status === 0) {
                this.$message({
                  message: `账号【${this.DetailInfo.name}】创建成功，登录密码为：${this.DetailInfo.password}`,
                  type: "success",
                  duration: 5000
                });
                this.$emit("update:showUpdate", false);
              }
            });
          });
        }
      });
    },
    updateDetail() {
      if (!this.role_ids || this.role_ids == null || this.role_ids == "") {
        this.$message({ message: "请关联角色", type: "error" });
        return;
      }
      this.$refs.saveChn.validate(valid => {
        if (valid) {
          this.$vcode().then(() => {
            let roleid = [];
            if (this.role_ids) {
              roleid.push(this.role_ids);
            }
            let data = { role_ids: roleid, enable: this.DetailInfo.enable };
            editUserDetail(data, this.id).then(res => {
              if (res.status === 0) {
                this.$message({ message: "编辑成功。", type: "success" });
                this.$emit("update:showUpdate", false);
              }
            });
          });
        }
      });
    },
    getDetail() {
      this.role_ids = [];
      getUserDetail(this.id).then(res => {
        if (res.status === 0) {
          this.DetailInfo = res.data;
          this.DetailInfo.roles.map(item => {
            this.role_ids = item.id;
          });
        }
      });
    }
  },
  watch: {
    showUpdate() {
      this.showDialog = this.showUpdate;
    }
  }
};
</script>
