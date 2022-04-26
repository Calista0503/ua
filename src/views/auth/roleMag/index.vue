<template>
  <div>
    <el-row type="flex" class="table-btns" justify="end">
      <el-button size="mini" @click="add" type="primary" icon="el-icon-plus">添加角色</el-button>
    </el-row>
    <el-table :data="listData.items" size="mini" stripe border fit highlight-current-row>
      <el-table-column prop="id" label="角色ID"></el-table-column>
      <el-table-column prop="name" label="角色名称">
        <template slot-scope="scope">{{scope.row.name || '游客账号'}}</template>
      </el-table-column>
      <el-table-column prop="desc" label="备注"></el-table-column>
      <!--<el-table-column prop="role_perm" label='角色权限' min-width="200">-->
      <!--<template slot-scope="scope">{{permsFilter(scope.row.role_perm)}}</template>-->
      <!--</el-table-column>-->
      <el-table-column prop="created_at" sortable label="创建时间"></el-table-column>
      <el-table-column prop="updated_at" sortable label="最后修改时间"></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <div v-if="scope.row.can_update">
            <el-button type="primary" size="mini" @click="update(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="deleteRole(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="q.page_no"
        :page-sizes="$store.state.app.pageSizeArr"
        :page-size="q.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listData.total"
      ></el-pagination>
    </div>
    <save-update
      v-if="showUpdate"
      :showUpdate.sync="showUpdate"
      :id="show_id"
      :permissions="permissions"
    ></save-update>
  </div>
</template>

<script>
import saveUpdate from "./saveUpdate";
import { getRoleList, getPermissions, deleteRole } from "@/api";

export default {
  components: { saveUpdate },
  data() {
    return {
      listData: {},
      q: { page_size: 30, page_no: 1 },
      showUpdate: false,
      show_id: null,
      permissions: [],
      permssionArray: this.$store.state.app.permssionArray
    };
  },
  activated() {
    this.getList();
    this.getPerm();
  },
  deactivated() {},
  methods: {
    permsFilter(perms) {
      let Array = perms ? perms.split(",") : [];
      let resu = [];
      Array.map(item => {
        resu.push(this.permssionArray[item]);
      });
      return `${resu}`;
    },
    add() {
      this.show_id = null;
      this.showUpdate = true;
    },
    update(row) {
      this.show_id = row.id;
      this.showUpdate = true;
    },
    handleSizeChange(val) {
      this.q.page_size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.q.page_no = val;
      this.getList();
    },
    getList() {
      getRoleList(this.q).then(res => {
        if (res.status === 0) {
          this.listData = res.data;
        }
      });
    },
    deleteRole(row) {
      this.$confirm(
        `删除后对应的账号将不可用，是否确认删除角色【${row.name}】`,
        "删除",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$vcode().then(() => {
            deleteRole(row.id).then(res => {
              if (res.status === 0) {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                  showClose: true
                });
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
    getPerm() {
      getPermissions().then(res => {
        if (res.status === 0) {
          this.permissions = res.data.permissions;
          // let aaarray = []
          // this.permissions.map(item => {
          //   if(item.children){
          //     item.children.map(child => {
          //       if(child.fields){
          //         aaarray = [...new Set([...child.fields, ...aaarray])]
          //         console.log(aaarray)
          //       }
          //     })
          //   }
          // })
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
