<template>
  <div>
    <div class="toolbar">
      <el-form :inline="true" :model="q" size="mini">
        <el-form-item :label="labelTime" >
          <el-button v-if="dataStatus === 1" type="text" @click="changeDateStatus(2)">（{{$t('message.click_switch')}}）</el-button>
          <el-button v-if="dataStatus === 2" type="text" @click="changeDateStatus(3)">（{{$t('message.click_switch')}}）</el-button>
          <el-button v-if="dataStatus === 3" type="text" @click="changeDateStatus(1)">（{{$t('message.click_switch')}}）</el-button>
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

        <el-form-item :label="$t('message.order_id')">
          <el-input type="text" v-model.trim="q.order_id" :placeholder="$t('message.please_input')"></el-input>
        </el-form-item>

        <el-form-item :label="$t('message.platform_order_number')">
          <el-input type="text" v-model.trim="q.order_no" :placeholder="$t('message.please_input')"></el-input>
        </el-form-item>

        <el-form-item :label="$t('message.mch_order')">
          <el-input
            type="text"
            v-model.trim="q.mch_withdraw_no"
            :placeholder="$t('message.please_input')"
          ></el-input>
        </el-form-item>

        <Merchant :title="$t('message.parent_mch')" v-model="q.mch_id" />

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

        <el-form-item :label="$t('message.user_id')">
          <el-input type="text" v-model.trim="q.user_id" :placeholder="$t('message.please_input')"></el-input>
        </el-form-item>

        <el-form-item :label="$t('message.withdraw_method')">
          <el-select v-if="isVietnam" v-model="q.withdraw_type" :placeholder="$t('message.please_select')" clearable>
            <el-option
              v-for="(value,key) in $store.state.ua.vnWithdrawType"
              :key="key"
              :label="value"
              :value="key"
            ></el-option>
          </el-select>

          <el-select v-else v-model="q.withdraw_type" :placeholder="$t('message.please_select')" clearable>
            <el-option
              v-for="(value,key) in $store.state.ua.withdrawType"
              :key="key"
              :label="value"
              :value="key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('message.related_bank')">
          <el-select v-model="q.withdraw_bank_code" :placeholder="$t('message.please_select')" clearable filterable>
            <el-option
              v-for="(value,key) in this.$store.getters.allBankCodeTypeString"
              :key="key"
              :label="value"
              :value="key"
            ></el-option>
          </el-select>
        </el-form-item>

        <ChannelSelect :title="$t('message.current_channel')" v-model="q.channel_id" />

        <el-form-item :label="$t('message.order_status')">
          <el-select v-model="q.order_status" :placeholder="$t('message.please_select')" clearable>
            <el-option
              v-for="(value,key) in $store.state.ua.orderStatus"
              :key="key"
              :label="value"
              :value="key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('message.callback_status')">
          <el-select
            v-model="q.mch_callback_status"
            :placeholder="$t('message.please_select')"
            clearable
          >
            <el-option
              v-for="(value,key) in $store.state.ua.callbackStatus"
              :key="key"
              :label="value"
              :value="key"
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
        @click="abnormal"
        type="danger"
      >{{$t('message.abnormal')}}</el-button>
      <el-button
        v-if="multipleCallbackElem.length > 0"
        icon="el-icon-paperclip"
        size="mini"
        @click="multipleCallback"
        type="danger"
      >{{$t('message.multiple_callback')}}</el-button>
      <el-button
        v-if="multipleRefreshElem.length > 0"
        icon="el-icon-refresh"
        size="mini"
        @click="multipleRefresh"
        type="success"
      >{{$t('message.multiple_refresh')}}</el-button>
      <!-- 不需要批量推送 -->
       <el-button
        v-if="multiplePushElem.length > 0"
        icon="el-icon-coordinate"
        size="mini"
        @click="multiplePush"
        type="warning"
      >{{$t('message.multiple_push')}}</el-button>
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
      ref="multipleTable"
      :data="listData.items"
      @sort-change="sortlist"
      size="mini"
      stripe
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="id" fixed="left" :label="$t('message.order_id')" width="80"></el-table-column>
      <el-table-column prop="currency_type" fixed="left" label="币别" min-width="80"></el-table-column>
      <el-table-column prop="order_no" :label="$t('message.platform_order_number')" width="160"></el-table-column>
      <el-table-column prop="mch_withdraw_no" :label="$t('message.mch_order')" width="200"></el-table-column>
      <el-table-column prop="mch_name" :label="$t('message.parent_mch')" width="130"></el-table-column>
      <el-table-column prop="user_id" :label="$t('message.user_id')" width="130"></el-table-column>
      <el-table-column
        prop="user_id"
        :label="$t('message.withdraw_method')"
        :width="$store.state.ua.isEnglish?150:100"
      >
        <template slot-scope="scope">
          <span v-if="isVietnam">{{$store.state.ua.vnWithdrawType[scope.row.withdraw_type]}}</span>
          <span v-else>{{$store.state.ua.withdrawType[scope.row.withdraw_type]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="withdraw_bank_code"
        :label="$t('message.related_bank')"
        :width="$store.state.ua.isEnglish?150:100"
      >
        <template slot-scope="scope">
          <span>{{$store.getters.allBankCodeTypeString[scope.row.withdraw_bank_code]}}</span>
        </template>
      </el-table-column>
      
      <el-table-column
        prop="user_id"
        :label="$t('message.withdraw_amount')"
        :width="$store.state.ua.isEnglish?150:120"
      >
        <template slot-scope="scope">
          <span>{{scope.row.amount | rmb}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="channel_name"
        :label="$t('message.current_channel')"
        :width="$store.state.ua.isEnglish?150:120"
      ></el-table-column>
      <el-table-column
        prop="used_channels"
        :label="$t('message.last_channel')"
        :width="$store.state.ua.isEnglish?200:170"
      >
        <template slot-scope="scope">
          <div>{{scope.row.used_channels && scope.row.used_channels.join("\n")}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="recommit_times" :label="$t('message.recommit_times')" min-width="150"></el-table-column>
      <el-table-column prop="created_at" sortable :label="$t('message.create_time')" min-width="150"></el-table-column>
      <el-table-column prop="channel_success_at" sortable :label="$t('message.channel_time')" min-width="150"></el-table-column>
      <el-table-column prop="success_at" sortable :label="$t('message.success_time')" min-width="150"></el-table-column>
      <el-table-column prop="updated_at" sortable :label="$t('message.last_update_time')" min-width="150"></el-table-column>
      <el-table-column
        prop="user_id"
        :label="$t('message.order_status')"
        :min-width="$store.state.ua.isEnglish?180:120"
      >
        <template slot-scope="scope">
          <div>{{$store.state.ua.orderStatus[scope.row.status]}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="user_id"
        :label="$t('message.callback_status')"
        :width="$store.state.ua.isEnglish?150:100"
      >
        <template slot-scope="scope">
          <div
            v-if="scope.row.mch_callback_status === 'new'"
          >{{$store.state.ua.callbackStatus[scope.row.mch_callback_status]}}</div>
          <div
            style="color:green;"
            v-if="scope.row.mch_callback_status === 'success'"
          >{{$store.state.ua.callbackStatus[scope.row.mch_callback_status]}}</div>
          <div
            style="color:red;"
            v-if="scope.row.mch_callback_status === 'fail'"
          >{{$store.state.ua.callbackStatus[scope.row.mch_callback_status]}}</div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="220">
        <template slot-scope="scope">
          <div>
            <el-button type="primary" size="mini" @click="look(scope.row)">{{$t('message.view')}}</el-button>
            <!-- 回调失败 || 订单（成功，失败）未回调 -->
            <el-button
              type="danger"
              size="mini"
              v-if="(scope.row.mch_callback_status === 'fail') || ((scope.row.status === 'order_fail'|| scope.row.status === 'order_success') && (scope.row.mch_callback_status === 'new'))"
              @click="callback(scope.row)"
            >{{$t('message.callback')}}</el-button>
            <el-button
              v-if="scope.row.can_apply_return && scope.row.status === 'order_success'"
              size="mini"
              @click="chase(scope.row)"
            >{{$t('message.refund')}}</el-button>
            <el-button
              type="warning"
              v-if="scope.row.status === 'third_unknown'|| scope.row.status==='new'"
              size="mini"
              @click="pushFn(scope.row)"
            >{{$t('message.push')}}</el-button>
            <el-button
              size="mini"
              type="success"
              v-if="(scope.row.status === 'commit')"
              @click="refresh(scope.row)"
            >{{$t('message.refresh')}}</el-button>
            <!-- 日志 -->
            <el-button
              v-if="($store.state.user.userinfo.permissions.includes('order_log'))&&checkAbleLookLogs(scope.row)"
              type="warning"
              size="mini"
              @click="lookLogs(scope.row)"
            >{{$t('message.logs')}}</el-button>
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

    <multipleDialog ref="multipleDialog" @onclose="onDialogClose" />
    <detailDialog ref="detailDialog" />
    <logsDialog ref="logsDialog" />
    <exportTable ref="recordDialog" />

    <saveUpdate ref="dialog" @onclose="onDialogClose" />
  </div>
</template>

<script>
import { orderApi } from "@/api/order";
import Merchant from "@/components/Select/Merchant";
import ChannelSelect from "@/components/Select/ChannelSelect";
import multipleDialog from "./multipleDialog";
import detailDialog from "./detailDialog";
import logsDialog from "./logsDialog";
import {getIsVietnam} from '@/utils/config';
import timedate from '@/utils/timedate';
import exportTable from "@/components/exportTable";
import saveUpdate from "./saveUpdate";

export default {
  components: {
    Merchant,
    ChannelSelect,
    multipleDialog,
    detailDialog,
    logsDialog,
    exportTable,
    saveUpdate
  },
  data() {
    return {
      labelTime: this.$t('message.create_time'),
      dataStatus: 1, // 1.创建时间，2.完成时间 3.第三方到账时间
      multipleSelection: [], // 表格多选
      downloading: false,
      isVietnam: getIsVietnam(),
      listData: {},
      q: { page_size: 30, page_no: 1, time_range: [timedate.dateTodayStartHMS, timedate.dateTomorrowHMS]},
      max: 30, // 批量操作最多30条,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() + 60 * 60 * 1000 * 24;
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
    },
    // 批量回调的元素ids
    multipleCallbackElem() {
      const arr = [];
      this.multipleSelection.forEach(item => {
        if (item.mch_callback_status === "fail") {
          arr.push(item.id);
        }
      });
      return arr;
    },
    // 批量刷新的元素ids
    multipleRefreshElem() {
      const arr = [];
      this.multipleSelection.forEach(item => {
        if (item.status === "commit") {
          arr.push(item.id);
        }
      });
      return arr;
    },
    // 批量推送的元素ids
    multiplePushElem() {
      const arr = [];
      this.multipleSelection.forEach(item => {
        if (item.status === "third_unknown") {
          arr.push(item.id);
        }
      });
      return arr;
    }
  },
  methods: {
    abnormal() {
      this.$refs.dialog.open()
    },

    changeDateStatus(status) {
      this.dataStatus = status;
      this.$set(this.q, "time_range", "");
      if (status===2){
        this.labelTime = this.$t('message.success_time')
      }else if (status===3){
        this.labelTime = this.$t('message.channel_time')
      }else {
       this.labelTime = this.$t('message.create_time')
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    asyncRecord() {
      this.$refs.recordDialog.open('WITHDRAW_ORDER');
    },
    downloadData() {
      let query = {}
      if (this.dataStatus===2){
        query = this.$dateFilter({
          data: this.q,
          range: "time_range",
          start: "success_at_begin",
          end: "success_at_end"
        });
      } else if (this.dataStatus===3){
        query = this.$dateFilter({
          data: this.q,
          range: "time_range",
          start: "channel_success_at_begin",
          end: "channel_success_at_end"
        });
      } else {
        query = this.$dateFilter({
          data: this.q,
          range: "time_range",
          start: "created_at_begin",
          end: "created_at_end"
        });
      }
      this.$vcode().then(() => {
        this.downloading = true;
        Object.assign(query, {export: 1})
        orderApi.getList(this.$qfilter(query)).then(res => {
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
    // 查看
    look(row) {
      this.$refs.detailDialog.open(row.id);
    },
    lookLogs(row) {
      this.$refs.logsDialog.open(row.id);
    },
    checkAbleLookLogs(row) {
      if(row.created_at) {
        //创建时间距离当前时间超过7天的订单隐藏日志按钮
        let createdUTCtime = this.isVietnam ? new Date(row.created_at + " GMT+0700").toUTCString() : new Date(row.created_at + " GMT+0800").toUTCString()
        let nowUTCtime = new Date().toUTCString();
        if((new Date(nowUTCtime).getTime() - new Date(createdUTCtime).getTime())/1000/60/60/24 < 7) {
          return true;
        }
      }
      return false;
    },
    // 回调手动
    callback(row) {
      this.$confirm(
        this.isEnglish
          ? `Are you sure of the callback order 【<span style="color:red">${row.id}</span>】】?`
          : `确定回调订单【<span style="color:red">${row.id}</span>】吗？`,
        this.isEnglish ? "Callback hint" : "回调提示",
        {
          confirmButtonText: this.$t("message.ok"),
          cancelButtonText: this.$t("message.cancel"),
          type: "warning",
          dangerouslyUseHTMLString: true
        }
      )
        .then(() => {
          orderApi.callback([row.id]).then(res => {
            if (res.status === 0) {
              if (
                res.data &&
                res.data.result &&
                res.data.result.length &&
                res.data.result.length > 0
              ) {
                res.data.result.forEach(item => {
                  this.$message({
                    type: "error",
                    showClose: true,
                    message: this.isEnglish
                      ? `Order【${item.order_id}】 callback failed -【${item.biz}】`
                      : `订单【${item.order_id}】回调失败 - 【${item.biz}】`,
                    duration: 50000
                  });
                });
              } else {
                this.$message.success(
                  this.isEnglish
                    ? `Order【${row.id}】 callback success`
                    : `订单【${row.id}】回调成功`
                );
                this.getList();
              }
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("message.cancelled")
          });
        });
    },
    // 刷新
    refresh(row) {
      this.$confirm(
        this.isEnglish
          ? `Are you sure you want to refresh the order【<span style="color:red">${row.id}</span>】`
          : `确定刷新订单【<span style="color:red">${row.id}</span>】吗？`,
        this.isEnglish ? `Refresh hint` : "刷新提示",
        {
          confirmButtonText: this.$t("message.ok"),
          cancelButtonText: this.$t("message.cancel"),
          type: "warning",
          dangerouslyUseHTMLString: true
        }
      )
        .then(() => {
          orderApi.refresh([row.id]).then(res => {
            if (res.status === 0) {
              if (
                res.data &&
                res.data.result &&
                res.data.result.length &&
                res.data.result.length > 0
              ) {
                res.data.result.forEach(item => {
                  this.$message({
                    type: "error",
                    showClose: true,
                    message: this.isEnglish
                      ? `Order【${item.order_id}】 refresh failed -【${item.biz}`
                      : `订单【${item.order_id}】刷新失败 - 【${item.biz}】`,
                    duration: 50000
                  });
                });
              } else {
                this.$message.success(
                  this.isEnglish
                    ? `Order【${row.id}】refreshed successfully`
                    : `订单【${row.id}】刷新成功`
                );
                this.getList();
              }
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("message.cancelled")
          });
        });
    },
    // 推送
    pushFn(row) {
      this.$confirm(
        this.isEnglish
          ? `Before pushing, make sure that the order is not received by the current channel. Are you sure you want to push?`
          : `推送前需确保当前通道没有收到该订单，是否确定推送？`,
        this.isEnglish ? `Push hint` : "推送提示",
        {
          confirmButtonText: this.$t("message.ok"),
          cancelButtonText: this.$t("message.cancel"),
          type: "warning",
          dangerouslyUseHTMLString: true
        }
      )
        .then(() => {
          orderApi.push([row.id]).then(res => {
            if (res.status === 0) {
              if (
                res.data &&
                res.data.result &&
                res.data.result.length &&
                res.data.result.length > 0
              ) {
                res.data.result.forEach(item => {
                  this.$message({
                    type: "error",
                    showClose: true,
                    message: this.isEnglish
                      ? `Order【${item.order_id}】 push failed -【${item.biz}`
                      : `订单【${item.order_id}】推送失败 - 【${item.biz}】`,
                    duration: 50000
                  });
                });
              } else {
                this.$message.success(
                  this.isEnglish
                    ? `Order【${row.id}】 pushed successfully`
                    : `订单【${row.id}】推送成功`
                );
                this.getList();
              }
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("message.cancelled")
          });
        });
    },
    // 追分
    chase(row) {
      this.$confirm(
        this.isEnglish
          ? `Are you sure you want to apply for a refund for a withdrawal order【<span style="color:red">${
              row.id
            }</span>】 of channel【<span style="color:red">${
              row.channel_name
            }</span>】amount 【<span style="color:red">${Number(row.amount) /
              100}</span>】?`
          : `确定对通道【<span style="color:red">${
              row.channel_name
            }</span>】金额为【<span style="color:red">${Number(row.amount) /
              100}</span>】的提现订单【<span style="color:red">${
              row.id
            }</span>】申请返款吗？`,
        this.isEnglish ? `Apply for a refund` : "申请返款",
        {
          confirmButtonText: this.$t("message.ok"),
          cancelButtonText: this.$t("message.cancel"),
          type: "warning",
          dangerouslyUseHTMLString: true
        }
      )
        .then(() => {
          orderApi.chase(row.id).then(res => {
            if (res.status === 0) {
              this.$message({
                type: "success",
                message: this.isEnglish ? "Chase success" : "追分成功!",
                showClose: true
              });
              this.getList();
            } else {
              // this.$message.error('该通道不支持返款操作')
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("message.cancelled")
          });
        });
    },
    // 批量回调
    multipleCallback() {
      if (this.multipleCallbackElem.length > this.max) {
        this.$message.warning(
          this.isEnglish
            ? `The number of operations cannot exceed 30`
            : `批量回调数量不能超过${this.max}个`
        );
        return;
      }
      this.$refs.multipleDialog.open({
        method: "callback",
        ids: this.multipleCallbackElem
      });
    },
    // 批量刷新
    multipleRefresh() {
      if (this.multipleRefreshElem.length > this.max) {
        this.$message.warning(
          this.isEnglish
            ? `The number of operations cannot exceed 30`
            : `批量刷新数量不能超过${this.max}个`
        );
        return;
      }
      this.$refs.multipleDialog.open({
        method: "refresh",
        ids: this.multipleRefreshElem
      });
    },
    // 批量推送
    multiplePush() {
      if (this.multiplePushElem.length > this.max) {
        this.$message.warning(
          this.isEnglish
            ? `The number of operations cannot exceed 30`
            : `批量推送数量不能超过${this.max}个`
        );
        return;
      }
      this.$refs.multipleDialog.open({
        method: "push",
        ids: this.multiplePushElem
      });
    },
    // 取消所有选择
    cancelAllSelect() {
      this.$refs.multipleTable.clearSelection();
    },

    onDialogClose({ update }) {
      if (update) {
        this.getList();
        this.cancelAllSelect();
      }
    },

    getList() {
      let query = {}
      if (this.dataStatus===2){
        query = this.$dateFilter({
          data: this.q,
          range: "time_range",
          start: "success_at_begin",
          end: "success_at_end"
        });
      } else if (this.dataStatus===3){
        query = this.$dateFilter({
          data: this.q,
          range: "time_range",
          start: "channel_success_at_begin",
          end: "channel_success_at_end"
        });
      } else {
        query = this.$dateFilter({
          data: this.q,
          range: "time_range",
          start: "created_at_begin",
          end: "created_at_end"
        });
      }
      orderApi.getList(this.$qfilter(query)).then(res => {
        if (res.status === 0) {
          this.listData = res.data;
        }
      });
    },
    query() {
      this.q = Object.assign(this.q, { page_no: 1});
      this.getList();
    },
    reload() {
      this.q = { page_size: 30, page_no: 1, time_range: [timedate.dateTodayStartHMS, timedate.dateTomorrowHMS] };
      this.getList();
    },

    sortlist(sort) {
      this.q.order_by = sort.order==='descending' ? '-'+sort.prop : sort.prop;
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

<style lang="scss">
  .el-table .cell {
    white-space: pre-line;
    text-align: center;
  }
</style>