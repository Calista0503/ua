<template>
  <div class="opera-log">
    <div class="toolbar">
      <el-form :inline="true" :model="q" size="mini">
        <el-form-item label="操作时间">
          <el-date-picker
            v-model="q.time_range"
            type="datetimerange"
            align="right"
            value-format="yyyy-MM-dd HH:mm:ss"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="操作人">
          <el-select v-model="q.operator" clearable filterable placeholder="请选择">
            <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="操作内容">
          <el-select v-model="q.action" clearable placeholder="请选择">
            <el-option label="所有" :value="null"></el-option>
            <el-option
              v-for="(statu, index) of actionOption"
              :key="index"
              :label="statu"
              :value="index"
            ></el-option>
          </el-select>
        </el-form-item>-->

        <el-form-item label="所属模块">
          <el-select v-model="q.resources" clearable placeholder="请选择">
            <el-option
              v-for="(value, key) of permissionsSelect"
              :key="key"
              :label="key"
              :value="value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="ip地址">
          <el-input v-model="q.ip" placeholder="ip" prefix-icon="el-icon-edit"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query">查询</el-button>
          <el-button type="danger" @click="reload">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-row type="flex" class="table-btns" justify="end">
      <el-button
        size="mini"
        @click="asyncRecord"
        type="warning"
      >异步导出记录</el-button>
      <el-button
        size="mini"
        @click="downloadData"
        type="primary"
        :loading="downloading"
        icon="el-icon-printer"
      >异步导出</el-button>
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
      <el-table-column prop="created_at" label="操作时间" sortable></el-table-column>
      <el-table-column prop="operator_name" label="操作人"></el-table-column>
      <el-table-column prop="resource_name" label="所属模块">
        <template slot-scope="scope">
          <div
            v-if="permissionsMap && (Object.keys(permissionsMap).length > 0) && scope.row.resource"
          >{{permissionsMap[scope.row.resource]}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="resource_name" label="操作内容"></el-table-column>
      <el-table-column prop="ip" label="ip地址"></el-table-column>
      <el-table-column prop="user_agent" label="设备"></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <div>
            <el-button type="primary" size="mini" icon="el-icon-view" @click="viewC(scope.row)">查看</el-button>
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

    <el-dialog
      :close-on-click-modal="false"
      title="内容详情"
      :visible.sync="showContent"
      width="30%"
      class="showContent"
    >
      <el-form size="mini" label-width="100px">
        <el-form-item label="所属模块：">
          <span v-if="permissionsMap && resource">{{permissionsMap[resource]}}</span>
        </el-form-item>
        <el-form-item label="操作内容：">
          <span>{{DetailContent.resource_name}}</span>
        </el-form-item>
        <el-form-item label="操作项：">
          <div class="oprates">
            <p>{{`账号 => ${DetailContent.resource_id}`}}</p>
            <p
              v-if="DetailContent.content && DetailContent.content.name"
            >{{`账户名 => ${DetailContent.content.name}`}}</p>
            <p v-if="DetailContent.content">{{`详情=> ${JSON.stringify(DetailContent.content)}`}}</p>
            <p v-if="DetailContent.remark">{{`备注 => ${DetailContent.remark}`}}</p>
            <p
              v-if="DetailContent.content && DetailContent.content.enable !== void 0"
            >{{`状态 => ${DetailContent.content.enable?'开启':'禁用'}`}}</p>
          </div>
        </el-form-item>
      </el-form>
      <!-- <li v-for="(cont, key) of DetailContent" :key="key">{{key}} => {{cont}}</li> -->
    </el-dialog>
    <exportTable ref="recordDialog" />
  </div>
</template>

<script>
import { queryFilter } from "@/utils/patch";
import { getRecordList, getUserList, getPermissions } from "@/api";
import timedate from '@/utils/timedate';
import exportTable from "@/components/exportTable";
export default {
  components: {
    exportTable
  },
  data() {
    return {
      listData: {},
      q: { page_size: 30, page_no: 1 },
      showUpdate: false,
      userList: [],
      downloading: false,
      showContent: false,
      show_id: null,
      resource: null, // 当前操作项权限code
      permissionsMap: {}, // 权限code对应的模块名称
      permissionsSelect: {}, // 所属模块选择框
      DetailContent: {},
      actionOption: {
        1: "创建",
        2: "更新",
        3: "删除"
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", [timedate.dateToday, timedate.dateToday]);
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              picker.$emit("pick", [
                timedate.dateYesterday,
                timedate.dateYesterday
              ]);
            }
          },
          {
            text: "最近一周",
            onClick(picker) {
              picker.$emit("pick", [timedate.dateWeek, timedate.dateToday]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              picker.$emit("pick", [timedate.dateOneMonth, timedate.dateToday]);
            }
          }
        ]
      }
    };
  },
  activated() {
    this.getList();
    getUserList({ page_size: 30, page_no: 1 }).then(res => {
      if (res.status === 0) {
        this.userList = res.data.items;
      }
    });
  },
  deactivated() {},
  methods: {
    asyncRecord() {
      this.$refs.recordDialog.open('RECORD_LIST');
    },
    downloadData() {
      const query = this.$dateFilter({
        data: this.q,
        range: "time_range",
        start: "created_at_begin",
        end: "created_at_end"
      });
      this.$vcode().then(() => {
        this.downloading = true;
        Object.assign(query, {export: 1})
        getRecordList(this.$qfilter(query)).then(res => {
          if (res.status===0){
            this.$message({
              type: 'success',
              message: '异步导出耗时较长，请稍后至异步导出记录下载',
              duration: 3000
            })
            this.downloading = false;
          }
        }).catch(()=> {
          this.downloading = false
        })
      });
    },
    viewC(row) {
      if (row.content == "") {
        this.DetailContent = { ...row };
        delete this.DetailContent.content;
      } else {
        this.DetailContent = { ...row };
        this.DetailContent.content =
          typeof this.DetailContent.content === "string"
            ? JSON.parse(this.DetailContent.content)
            : this.DetailContent.content;
      }

      this.resource = row.resource;
      this.showContent = true;
    },
    add() {
      this.show_id = null;
      this.showUpdate = true;
    },
    update(row) {
      this.show_id = row.id;
      this.showUpdate = true;
    },
    remove() {},
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
    },
    getList() {

      // 根据权限建立对应的模块的关系
      getPermissions().then(res => {
        if (res.status === 0) {
          try {
            const permissions = res.data.permissions[0].children;
            for (let item of permissions) {
              const level3Permissions = item.children;
              for (let subItem of level3Permissions) {
                const codes = [];
                for (let miniItem of subItem.children) {
                  this.permissionsMap[miniItem.code] = subItem.name;
                  codes.push(miniItem.code);
                }
                this.permissionsSelect[subItem.name] = codes.join(",");
              }
            }
          } catch (err) {
            this.permissionsMap = null;
            this.permissionsSelect = null;
          }
        }
      });
      const query = this.$dateFilter({
        data: this.q,
        range: "time_range",
        start: "created_at_begin",
        end: "created_at_end"
      });
      let data = queryFilter(query);
      getRecordList(data).then(res => {
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

<style lang="scss">
.opera-log {
  .queryParam div {
    background: #f2f2f2;
    .el-collapse-item__content {
      padding-bottom: 0;
    }
  }
  .showContent {
    .el-dialog__body {
      padding-top: 5px;
    }
  }

  .oprates {
    display: inline-block;
    > p {
      margin-top: 0;
    }
  }
}
</style>
