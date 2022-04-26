<template>
  <div>
    <div class="toolbar">
      <el-form :inline="true" :model="q" size="mini">
        <el-form-item label="发起时间">
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

        <Merchant title="所属商户" v-model="q.mch_id"></Merchant>

        <el-form-item label="订单号">
          <el-input v-model.trim="q.id" type="text" placeholder="请输入订单号"></el-input>
        </el-form-item>

        <el-form-item label="当前状态">
          <el-select clearable v-model="q.status" placeholder="请选择">
            <el-option
              :label="value"
              :value="key"
              v-for="(value,key) in $store.state.ua.rechargeStatus"
              :key="key"
            ></el-option>
          </el-select>
        </el-form-item>

        <handle-person v-model="q.operator_id"></handle-person>

        <el-form-item label="币别">
          <el-select clearable v-model="q.currency_type" placeholder="请选择">
            <el-option
              :label="value"
              :value="value"
              v-for="(value) in (isVietnam ? $store.state.ua.vnCurrencyType : $store.state.ua.currencyType)"
              :key="value"
            ></el-option>
          </el-select>
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
      <el-table-column prop="id" fixed="left" label="订单号" min-width="100"></el-table-column>
      <el-table-column prop="mch_name" fixed="left" label="所属商户" min-width="120">
        <!-- <template slot-scope="scope">{{optionsMap[String(scope.row.mch_id)]}}</template> -->
      </el-table-column>
      <el-table-column prop="currency_type" fixed="left" label="币别" min-width="80"></el-table-column>
      <el-table-column prop="user_id" label="充值金额" min-width="120">
        <template slot-scope="scope">
          <span>{{scope.row.recharge_amount | rmb}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="user_id" label="充值前余额" min-width="120">
        <template slot-scope="scope">
          <span>{{scope.row.balance | rmb}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="发起时间" min-width="150"></el-table-column>
      <el-table-column prop="user_id" label="当前状态" min-width="100">
        <template slot-scope="scope">
          <div
            v-if="scope.row.status === 3"
          >{{$store.state.ua.rechargeStatus[String(scope.row.status)]}}</div>
          <div
            style="color:green;"
            v-if="scope.row.status === 1"
          >{{$store.state.ua.rechargeStatus[String(scope.row.status)]}}</div>
          <div
            style="color:red;"
            v-if="scope.row.status === 2"
          >{{$store.state.ua.rechargeStatus[String(scope.row.status)]}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="operator_at" label="处理时间" min-width="150"></el-table-column>
      <el-table-column prop="operator" label="处理人" min-width="100"></el-table-column>
      <el-table-column prop="remark" label="备注" min-width="100"></el-table-column>
      <el-table-column label="操作" min-width="150">
        <template slot-scope="scope">
          <div v-if="scope.row.status == 3">
            <el-button type="primary" size="mini" @click="agree(scope.row)">通过</el-button>
            <el-button size="mini" @click="refuse(scope.row)">拒绝</el-button>
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

    <handle-dialog ref="dialog" @onclose="dialogClose"></handle-dialog>

    <exportTable ref="recordDialog" @onclose="dialogClose" />
  </div>
</template>

<script>
import Merchant from "@/components/Select/Merchant";
import HandlePerson from "@/components/Select/HandlePerson";
import timedate from "@/utils/timedate.js";
import { mchApi } from "@/api/mch";
import HandleDialog from "./HandleDialog";
import exportTable from "@/components/exportTable";
import { getIsVietnam } from '@/utils/config';

export default {
  components: {
    Merchant,
    HandlePerson,
    HandleDialog,
    exportTable
  },
  data() {
    return {
      options: [],
      listData: {},
      q: { page_size: 30, page_no: 1 },
      downloading: false,
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
      },
      isVietnam: getIsVietnam()
    };
  },
  activated() {
    this.getList();
  },
  computed: {
    // 商户id和商户名称的映射
    optionsMap() {
      const obj = {};
      this.options.forEach(item => {
        obj[item.id] = item.name;
      });
      return obj;
    }
  },
  methods: {
    asyncRecord() {
      this.$refs.recordDialog.open('MCH_RECHARGE');
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
        mchApi.getRechargeList(this.$qfilter(query)).then(res => {
          if (res.status===0){
            this.$message({
              type: 'success',
              message: '异步导出耗时较长，请稍后至异步导出记录下载',
              duration: 3000
            })
            this.downloading = false;
          }
        }).catch(()=> {
          this.downloading = false;
        })

        // this.$exportReport({
        //   http: mchApi.getRechargeList,
        //   query: query,
        //   complete: () => (this.downloading = false)
        // });
      });
    },
    // 通过
    agree(row) {
      this.$refs.dialog.open(row, "通过");
    },
    // 拒绝
    refuse(row) {
      this.$refs.dialog.open(row, "拒绝");
    },
    // 监听弹窗关闭，查看是否需要更新列表
    dialogClose({ update }) {
      // 需要更新
      if (update) {
        this.getList();
      }
    },
    getList() {
      const query = this.$dateFilter({
        data: this.q,
        range: "time_range",
        start: "created_at_begin",
        end: "created_at_end"
      });
      mchApi.getRechargeList(this.$qfilter(query)).then(res => {
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
