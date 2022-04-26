<template>
  <div class="saveUpdate">
    <el-dialog
      :close-on-click-modal="false"
      :title="id?'编辑角色':'新增角色'"
      :visible.sync="showDialog"
      @close="$emit('update:showUpdate', false)"
      :showUpdate="showUpdate"
      width="800px"
    >
      <el-form :model="DetailInfo" ref="saveChn" label-width="120px" size="mini">
        <dialog-wrapper :MaxWidth="800">
          <el-form-item label="角色名称:" prop="name" :rules="[{ required: true, message: '名称不能为空'}]">
            <el-input v-model="DetailInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="描述:">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              v-model="DetailInfo.desc"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色权限:">
            <el-tree
              ref="permTree"
              :data="permssionArray"
              show-checkbox
              default-expand-all
              node-key="id"
              :props="defaultProps"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span v-if="data.fields">
                  <el-popover placement="bottom" trigger="click" width="600">
                    <div>
                      <el-checkbox
                        v-model="checkAll[data.code]"
                        @change="handleCheckAllChange(data.id,data.fields,checkAll[data.code])"
                      >全选{{ data.code }}</el-checkbox>
                      <div style="margin: 15px 0;"></div>
                      <el-checkbox-group v-model="reportprem[data.id]">
                        <el-checkbox
                          v-for="col in data.fields"
                          :label="col"
                          :key="col"
                        >{{report[col]}}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                    <el-button type="text" size="mini" slot="reference">[展示列]</el-button>
                  </el-popover>
                </span>
              </span>
            </el-tree>
          </el-form-item>
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
import { getRoleDetail, saveAddRole, editRoleDetail } from "@/api";
export default {
  components: { DialogWrapper },
  data() {
    return {
      showDialog: this.showUpdate,
      loading: false,
      DetailInfo: {},
      role_perm: [],
      CheckedKey: [],
      checkedcols: [],
      reportprem: {
        1001: [],
        1002: [],
        1003: [],
        1004: []
      },
      checkAll: {
        report_s2s: false,
        report_cps: false,
        report_user: false,
        report_device: false
      },
      permssionArray: this.permissions,
      defaultProps: {
        children: "children",
        label: "name"
      }
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
    permissions: {
      type: Array
    }
  },
  created() {
    if (this.id) {
      this.getDetail();
    }
  },
  methods: {
    handleCheckAllChange(id, fields, isAll) {
      if (isAll) {
        this.reportprem[id] = fields;
      } else {
        this.reportprem[id] = [];
      }
    },
    getCheckedNode() {
      let CheckedKeys = this.$refs.permTree.getCheckedNodes();
      this.CheckedKey = [];
      CheckedKeys.map(item => {
        if (!item.children) {
          if (item.fields) {
            this.CheckedKey.push({
              permission_id: item.id,
              include_fields: this.reportprem[item.id]
            });
          } else {
            this.CheckedKey.push({ permission_id: item.id });
          }
        }
      });
      this.DetailInfo.permissions = this.CheckedKey;
    },
    saveDetail() {
      this.getCheckedNode();
      this.$refs.saveChn.validate(valid => {
        if (valid) {
          this.$vcode().then(() => {
            Object.assign(this.DetailInfo);
            saveAddRole(this.DetailInfo).then(res => {
              if (res.status === 0) {
                this.$message({ message: "新增成功。", type: "success" });
                this.$emit("update:showUpdate", false);
              }
            });
          });
        }
      });
    },
    updateDetail() {
      this.getCheckedNode();
      this.$refs.saveChn.validate(valid => {
        if (valid) {
          this.$vcode().then(() => {
            editRoleDetail(this.DetailInfo, this.id).then(res => {
              if (res.status === 0) {
                this.$message({ message: "编辑成功。", type: "success" });
                this.$emit("update:showUpdate", false);
              }
            });
          });
        }
      });
    },
    async getDetail() {
      await getRoleDetail(this.id).then(res => {
        if (res.status === 0) {
          let { name, desc, permissions } = res.data;
          this.DetailInfo = { name, desc };
          permissions.map(item => {
            permissions.push(item.permission_id);
            if (item.include_fields) {
              this.reportprem[item.permission_id] = item.include_fields;
            }
          });
          this.$refs.permTree.setCheckedKeys(permissions);
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
