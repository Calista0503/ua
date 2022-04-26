<template>
  <div>
    <div class="toolbar">
      <el-form :inline="true" :model="q" size="mini">
        <el-form-item label="账号名称:">
          <el-select v-model="q.name" clearable filterable placeholder="请选择">
            <el-option
              v-for="(item) in listData.items"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="关联角色:">
          <el-select v-model="q.role_id" clearable placeholder="请选择">
            <el-option v-for="(item,key) in rolelist" :key="key" :label="item" :value="key"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="状态:">
          <el-select clearable v-model="q.enable" placeholder="请选择">
            <el-option :key="true" label="激活" :value="true"></el-option>
            <el-option :key="false" label="禁用" :value="false"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="query">查询</el-button>
          <el-button type="danger" @click="reload">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row type="flex" class="table-btns" justify="end">
      <el-button size="mini" @click="add" type="primary" icon="el-icon-plus">添加用户</el-button>
    </el-row>
    <el-table
      :data="listData.items"
      @sort-change="sortlist"
      size="mini"
      stripe
      border
      fit
      highlight-current-row
    >
      <el-table-column prop="id" label="账户ID" ></el-table-column>
      <el-table-column prop="name" label="账户名"></el-table-column>
      <el-table-column prop="roles" label="关联角色" >
        <template slot-scope="scope">
          <span
            v-if="scope.row.roles.length!=0"
          >{{ scope.row.roles.reduce((roles, role)=> {return roles.concat(role.name)},'') }}</span>
          <span v-else>游客账号</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="enable" label="状态" width="100">
        <template slot-scope="scope">{{scope.row.enable?'激活':'禁用'}}</template>
      </el-table-column>-->
      <el-table-column prop="created_at" label="创建时间"></el-table-column>
      <el-table-column prop="updated_at" label="更新时间"></el-table-column>
      <el-table-column prop="last_login_at" label="最后登录时间" ></el-table-column>
       <el-table-column prop="login_count" label="登录次数"></el-table-column>
      <el-table-column label="操作" min-width="140">
        <template slot-scope="scope">
          <div>
            <el-button type="success" size="mini" @click="resetPwd(scope.row)">重置密码</el-button>
            <el-button type="primary" size="mini" @click="update(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="remove(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <!-- <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="q.page_no"
        :page-sizes="$store.state.app.pageSizeArr"
        :page-size="q.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listData.total"
      ></el-pagination> -->
    </div>
    <save-update v-if="showUpdate" :showUpdate.sync="showUpdate" :id="show_id" :rolelist="rolelist"></save-update>
  </div>
</template>

<script>
import saveUpdate from "./saveUpdate";
import { getUserList, deleteUser, getRoleList, resetPassword } from "@/api";

export default {
  components: { saveUpdate },
  data() {
    return {
      listData: {},
      q: { page_size: 1000, page_no: 1 },
      showUpdate: false,
      show_id: null,
      rolelist: {},
      resetPwdMeg: false
    };
  },
  activated() {
    this.getRoleList();
    this.getList();
  },
  deactivated() {},
  methods: {
    add() {
      this.show_id = null;
      this.showUpdate = true;
    },
    update(row) {
      this.show_id = row.id;
      this.showUpdate = true;
    },
    restPassword(row) {
      alert(row.id);
    },
    remove(row) {
      this.$confirm(
        `确认要删除账号【<span style="color:red">${row.name}</span>】的吗？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          dangerouslyUseHTMLString: true
        }
      )
        .then(() => {
          this.$vcode().then(() => {
            deleteUser(row.id).then(res => {
              if (res.status === 0) {
                this.$message({ type: "success", message: "删除成功!" });
                this.getList();
              }
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    query() {
      this.q = Object.assign(this.q, { page_no: 1, page_size: 1000 });
      this.getList();
    },
    reload() {
      this.q = { page_size: 1000, page_no: 1 };
      this.getList();
    },
    sortlist(sort) {
      if (sort.order === "descending") {
        this.q.order_by = "-" + sort.prop;
      } else {
        this.q.order_by = sort.prop;
      }
      this.getList();
    },
    handleSizeChange(val) {
      this.q.page_size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.q.page_no = val;
      this.getList();
    },
    resetPwd(row) {
      this.$confirm(
        `确认重置账号【<span style="color:red">${row.name}</span>】 的登录密码？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          dangerouslyUseHTMLString: true
        }
      )
        .then(() => {
          this.$vcode().then(() => {
            if (this.resetPwdMeg) {
              this.resetPwdMeg.close();
            }
            resetPassword(row.id).then(res => {
              if (res.status === 0) {
                let msg =
                  "【" +
                  row.name +
                  "】的密码已被重置，新密码为" +
                  res.data.password;
                this.$message({
                  type: "success",
                  message: msg,
                  duration: 5000,
                  showClose: true
                });
              }
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    getRoleList() {
      getRoleList().then(res => {
        if (res.status === 0) {
          let Array = res.data.items;
          Array.map(item => {
            this.rolelist[item.id] = item.name;
          });
        }
      });
    },
    getList() {
      getUserList(this.q).then(res => {
        if (res.status === 0) {
          this.listData = res.data;
        }
      });
    }
  },
  watch: {
    showUpdate() {
      if (!this.showUpdate) {
        this.getList();
      }
    }
  }
};
</script>
