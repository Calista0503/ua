<template>
  <div>
    <div class="toolbar">
      <el-form :inline="true" :model="q" size="mini">
        <el-form-item :label="$t('message.statistical_date')">
          <el-date-picker
            v-model="q.time_range"
            type="daterange"
            align="right"
            value-format="yyyy-MM-dd"
            unlink-panels
            :range-separator="$t('message.to')"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>

        <Merchant multiple :title="$t('message.parent_mch')" v-model="q.mch_ids"></Merchant>

        <channel-mch
          multiple
          :title="$t('message.channel_mch_parent')"
          v-model="q.channel_provider_ids"
        ></channel-mch>

        <ChannelSelect
          :api="channelApi.getChannelByChannelMch"
          v-if="q.channel_provider_ids && q.channel_provider_ids.length > 0"
          multiple
          :condition="{channel_provider_ids:q.channel_provider_ids}"
          v-model="q.channel_ids"
          :title="$t('message.associated_channel')"
        ></ChannelSelect>

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
          <el-button type="primary" @click="query">{{$t('message.search')}}</el-button>
          <el-button type="danger" @click="reload">{{$t('message.reload')}}</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-row type="flex" class="table-btns" justify="end">
      <el-button
        size="mini"
        @click="asyncRecord"
        type="warning"
      >{{$t('message.exportRecord')}}</el-button>
      <el-button
        size="mini"
        @click="downloadData"
        type="primary"
        :loading="downloading"
        icon="el-icon-printer"
      >{{$t('message.export')}}</el-button>
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
      <el-table-column prop="date" fixed="left" :label="$t('message.date')"></el-table-column>
      <el-table-column prop="mch_name" fixed="left" :label="$t('message.parent_mch')">
        <template slot-scope="scope">
          <span>{{(scope.row.mch_name=='全部' && isEnglish)?'All':scope.row.mch_name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="channel_provider_name"
        fixed="left"
        :label="$t('message.channel_mch_parent')"
      >
        <template slot-scope="scope">
          <span>{{(scope.row.channel_provider_name=='全部' && isEnglish)?'All':scope.row.channel_provider_name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="channel_name" fixed="left" :label="$t('message.associated_channel')">
        <template slot-scope="scope">
          <span>{{(scope.row.channel_name=='全部' && isEnglish)?'All':scope.row.channel_name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="currency_type" fixed="left" label="币别" min-width="80"></el-table-column>
      <el-table-column prop="count_out_withdraw" :label="$t('message.withdrawal_times')"></el-table-column>
      <el-table-column prop="user_id" :label="$t('message.withdraw_amount')">
        <template slot-scope="scope">
          <span>{{scope.row.amount_out_withdraw | rmb}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="user_id" :label="$t('message.channel_handling_fee')">
        <template slot-scope="scope">
          <span>{{scope.row.amount_out_service_channel | rmb}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="user_id" :label="$t('message.merchant_fee')">
        <template slot-scope="scope">
          <span>{{scope.row.amount_in_service_mch | rmb}}</span>
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
    <exportTable ref="recordDialog" @onclose="dialogClose" />
  </div>
</template>

<script>
import Merchant from "@/components/Select/Merchant";
import ChannelMch from "@/components/Select/ChannelMch";
import ChannelSelect from "@/components/Select/ChannelSelect";
import timedate from "@/utils/timedate.js";
import { orderApi } from "@/api/order";
import { channelApi } from "@/api/channel";
import exportTable from "@/components/exportTable";
import { getIsVietnam } from '@/utils/config';

export default {
  components: {
    Merchant,
    ChannelMch,
    ChannelSelect,
    exportTable
  },
  data() {
    return {
      channelApi,
      options: [],
      listData: {},
      q: {
        page_size: 30,
        page_no: 1,
        time_range: [timedate.dateWeek, timedate.dateToday]
      },
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
    isEnglish() {
      return this.$store.state.ua.isEnglish;
    }
  },
  methods: {
    asyncRecord() {
      this.$refs.recordDialog.open('ORDER_REPORT');
    },
    downloadData() {
      this.$vcode().then(() => {
        this.downloading = true;
        Object.assign(this.q, {export: 1})
        orderApi.getReportList(this.$qfilter(this.q)).then(res=> {
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
        }).finally(() => {
          this.q = {
            page_size: 30,
            page_no: 1,
            time_range: [timedate.dateWeek, timedate.dateToday]
          };
        })
      });
    },
    // 监听弹窗关闭，查看是否需要更新列表
    dialogClose({ update }) {
      // 需要更新
      if (update) {
        this.getList();
      }
    },
    getList() {
      orderApi.getReportList(this.$qfilter(this.q)).then(res => {
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
      this.q = {
        page_size: 30,
        page_no: 1,
        time_range: [timedate.dateWeek, timedate.dateToday]
      };
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
