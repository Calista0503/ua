<template>
  <div>
    <div class="toolbar">
      <el-form :inline="true" :model="q" size="mini">
        <el-form-item :label="$t('message.account_type')">
          <el-select v-model="q.account_type" :placeholder="$t('message.please_select')" clearable>
            <el-option
              v-for="(value,key) in $store.state.ua.withdrawType"
              :key="value"
              :label="value"
              :value="key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('message.account')">
          <el-input
            type="text"
            v-model="q.account_number"
            :placeholder="$t('message.please_input')"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="query">{{$t('message.search')}}</el-button>
          <el-button type="danger" @click="reload">{{$t('message.reload')}}</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-row type="flex" class="table-btns" justify="end">
      <el-row type="flex" class="table-btns" justify="end">
        <el-button
          size="mini"
          @click="asyncRecord"
          type="warning"
        >{{$t('message.exportRecord')}}</el-button>
        <el-button
          size="mini"
          @click="downloadData"
          type="success"
          :loading="downloading"
          icon="el-icon-printer"
        >{{$t('message.export')}}</el-button>
      </el-row>

      <el-button
        style="height:28px;"
        size="mini"
        @click="add"
        type="primary"
        icon="el-icon-plus"
      >{{isEnglish?'Add blacklist':'添加黑名单'}}</el-button>
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
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="account_type" :label="$t('message.account_type')">
        <template slot-scope="scope">
          <div>{{$store.state.ua.withdrawType[scope.row.account_type]}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="account_number" :label="$t('message.account')">
        <template slot-scope="scope">
          <div v-for="item in handleAccount(scope.row.account_number)" :key="item">{{item}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="operator" :label="$t('message.operator1')"></el-table-column>

      <el-table-column prop="remark" :label="$t('message.remark')"></el-table-column>
      <el-table-column prop="updated_at" :label="$t('message.operating_time')"></el-table-column>
      <el-table-column :label="$t('message.operation')" fixed="right">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="deleteFn(scope.row)">{{$t('message.delete')}}</el-button>
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

    <exportTable ref="recordDialog" @onclose="dialogClose" />
  </div>
</template>

<script>
import saveUpdate from "./saveUpdate";
import { blackListApi } from "@/api/order";
import exportTable from "@/components/exportTable";

export default {
  components: {
    saveUpdate,
    exportTable
  },
  data() {
    return {
      listData: {},
      q: { page_size: 30, page_no: 1 },
      downloading: false
    };
  },
  activated() {
    this.getList();
  },
  computed: {
    isEnglish() {
      return this.$store.state.ua.isEnglish;
    }
  },
  methods: {
    asyncRecord() {
      this.$refs.recordDialog.open('BLACK_LIST');
    },
    downloadData() {
      this.$vcode().then(() => {
        this.downloading = true;
        Object.assign(this.q, {export: 1})
        blackListApi.get(this.$qfilter(this.q)).then(res => {
          if (res.status===0){
            this.$message({
              type: 'success',
              message: '异步导出耗时较长，请稍后至异步导出记录下载',
              duration: 3000
            })
            this.downloading = false;
          }
        }).catch(()=>{
          this.downloading = false
        })
      });
    },
    // 处理账号
    handleAccount(account_number) {
      if (!account_number) return [];
      return account_number.split(",");
    },
    // 监听弹窗关闭，是否更新列表。
    dialogClose({ update }) {
      if (update) this.getList();
    },
    add() {
      this.$refs.dialog.open();
    },
    deleteFn(row) {
      this.$confirm(
        this.isEnglish
          ? `Are you sure you want to delete this blacklist?`
          : `<div style="word-break: break-all;">确定删除<span style="color:red">【${
              this.$store.state.ua.withdrawType[row.account_type]
            }】【${row.account_number}】</span>的黑名单信息吗?</div>`,
        this.$t("message.hint"),
        {
          confirmButtonText: this.$t("message.ok"),
          cancelButtonText: this.$t("message.cancel"),
          type: "warning",
          dangerouslyUseHTMLString: true
        }
      )
        .then(() => {
          blackListApi.delete(row.id).then(res => {
            if (res.status === 0) {
              this.$message.success(
                this.isEnglish ? `successfully deleted` : `删除成功`
              );
              this.getList();
            }
          });
        })
        .catch(() => {
          this.$message.info(this.$t("message.cancelled"));
        });
    },

    getList() {
      blackListApi.get(this.$qfilter(this.q)).then(res => {
        if (res.status === 0) {
          this.listData = res.data;
        }
      });
    },
    query() {
      this.q = Object.assign(this.q, { page_no: 1, page_size: 30 });
      this.getList();
    },
    reload() {
      this.q = { page_size: 30, page_no: 1 };
      this.getList();
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
