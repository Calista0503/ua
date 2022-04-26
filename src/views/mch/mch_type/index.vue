<template>
  <div>
    <el-row type="flex" class="table-btns" justify="end">
      <el-button size="mini" @click="add" type="primary" icon="el-icon-plus">新增类型</el-button>
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
      <el-table-column prop="id" fixed="left" label="商户ID"></el-table-column>
      <el-table-column prop="name" fixed="left" label="类型名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="currency_type" fixed="left" label="币别" min-width="80"></el-table-column>
      <el-table-column prop="mch" label="关联商户" >
        <template slot-scope="scope">
          <div
            v-if="scope.row.mchs && (scope.row.mchs instanceof Array) && (scope.row.mchs.length>0)"
          >
            <span
              v-for="(item,index) in getAssociatedMch(scope.row.mchs)"
              :key="item.id"
            >{{item.name}}{{index==(getAssociatedMch(scope.row.mchs).length-1)?'':'，'}}</span>
          </div>
          <div v-else></div>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" ></el-table-column>
      <el-table-column prop="created_at" label="创建时间" ></el-table-column>
      <el-table-column prop="updated_at" label="最后更新时间" ></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <div>
            <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteType(scope.row)">删除</el-button>
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
    <saveUpdate ref="dialog" @onclose="dialogClose" />
  </div>
</template>

<script>
  import saveUpdate from "./saveUpdate";
  import { mchApi } from "@/api/mch";

  export default {
    name: 'mch_type',
    components: {
      saveUpdate
    },
    data() {
      return {
        listData: {},
        q: { page_size: 30, page_no: 1 },
        row_data: null,
      };
    },
    activated() {
      this.getList();
    },
    methods: {
      //获取关联商户
      getAssociatedMch(mchs){
        let arr = []
        for (let item of mchs){
            arr.push(item)
        }
        return arr
      },

      add() {
        this.$refs.dialog.open();
      },
      edit(row) {
        this.$refs.dialog.open(row);
      },
      deleteType(row) {
          this.$confirm(
            `确认要删除【<span style="color:red">${row.name}</span>】的类型吗？`,
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
                mchApi.mchTypeDel(row.id).then(res => {
                  if (res.status === 0) {
                    this.$message({ type: "success", message: "删除成功!" });
                    this.getList();
                  }
                })
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除"
              });
            });
      },


      getList() {
        mchApi.GetMchTypeList(this.q).then(res => {
          if (res.status === 0) {
            this.listData = res.data;
          }
        });
      },
      // 监听弹窗关闭，查看是否需要更新列表
      dialogClose({ update }) {
        // 需要更新
        if (update) {
          this.getList();
        }
      },
      sortlist(sort) {
        this.q.$orderby = sort.prop;
        this.getList();
      },
      handleSizeChange(val) {
        this.q.page_size = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.q.page_no = val;
        this.getList();
      }
    }
  };
</script>
