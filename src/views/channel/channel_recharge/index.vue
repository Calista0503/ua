<template>
  <div>
    <div class="toolbar">
      <el-form :inline="true" :model="q" size="mini">
        <el-form-item label="充值时间">
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

        <channel-mch @getOptions="getOptions" title="所属通道商" v-model="q.channel_provider_id"></channel-mch>

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
      <el-table-column prop="id" fixed="left" label="订单号"></el-table-column>
      <el-table-column prop="user_id" fixed="left" label="所属通道商">
        <template slot-scope="scope">{{optionsMap[String(scope.row.channel_provider_id)]}}</template>
      </el-table-column>
      <el-table-column prop="currency_type" fixed="left" label="币别" min-width="80"></el-table-column>
      <el-table-column prop="user_id" label="充值金额">
        <template slot-scope="scope">
          <span>{{scope.row.recharge_amount | rmb}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="user_id" label="充值前余额">
        <template slot-scope="scope">
          <span>{{scope.row.balance | rmb}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="充值时间"></el-table-column>
      <el-table-column prop="operator" label="处理人"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
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
    <exportTable ref="recordDialog" @onclose="dialogClose" />
  </div>
</template>

<script>
import ChannelMch from "@/components/Select/ChannelMch";
import HandlePerson from "@/components/Select/HandlePerson";
import timedate from "@/utils/timedate.js";
import { channelMchApi } from "@/api/channel";
import exportTable from "@/components/exportTable";
import { getIsVietnam } from '@/utils/config';

export default {
  components: {
    ChannelMch,
    HandlePerson,
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
    // 通道商id和通道商名称的映射
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
      this.$refs.recordDialog.open('CHANNEL_PROVIDER_RECHARGE');
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
        channelMchApi.getRechargeList(this.$qfilter(query)).then(res => {
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
    getOptions(options) {
      this.options = options;
    },
    getList() {
       const query = this.$dateFilter({
          data: this.q,
          range: "time_range",
          start: "created_at_begin",
          end: "created_at_end"
        });
      channelMchApi.getRechargeList(this.$qfilter(query)).then(res => {
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
