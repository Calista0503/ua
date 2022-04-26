<template>
  <div>
    <div class="toolbar">
      <el-form :inline="true" :model="q" size="mini">
        <el-form-item :label="dataStatus === 1 ? $t('message.create_time') : $t('message.success_time')" >
          <el-button v-if="dataStatus === 1" type="text" @click="changeDateStatus(2)">（{{$t('message.click_switch')}}）</el-button>
          <el-button v-if="dataStatus === 2" type="text" @click="changeDateStatus(1)">（{{$t('message.click_switch')}}）</el-button>
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
          <el-input
            type="text"
            v-model.trim="q.mch_withdraw_no"
            :placeholder="$t('message.please_input')"
          ></el-input>
        </el-form-item>

        <Merchant
          @getOptions="getOptions"
          :title="$t('message.parent_mch')"
          v-model="q.user_mch_id"
        ></Merchant>

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

        <BankSelect
          :title="$t('message.card_number')"
          v-model.trim="q.bankcard_id"
          :placeholder="$t('message.please_input')"
        />

        <el-form-item :label="$t('message.order_status')">
          <el-select v-model="q.status" :placeholder="$t('message.please_select')" clearable>
            <el-option
              v-for="(value,key) in $store.state.ua.channelOrderStatus"
              :key="key"
              :label="value"
              :value="key"
            ></el-option>
          </el-select>
        </el-form-item>

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

        <HandlePerson v-model="q.operator_id" :title="$t('message.operator')" />

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
      <el-table-column prop="id" :label="$t('message.order_id')" fixed="left" min-width="100"></el-table-column>
      <el-table-column
        prop="mch_withdraw_no"
        fixed="left"
        :label="$t('message.platform_order_number')"
        :min-width="160"
      ></el-table-column>
      <el-table-column
        prop="user_mch_name"
        fixed="left"
        :label="$t('message.parent_mch')"
        :min-width="isEnglish?130:100"
      ></el-table-column>
      <el-table-column
        prop="user_id"
        :label="$t('message.withdraw_method')"
        :min-width="isEnglish?150:100"
      >
        <template slot-scope="scope">{{$store.state.ua.withdrawType[scope.row.withdraw_type]}}</template>
      </el-table-column>
      <el-table-column prop="currency_type" fixed="left" label="币别" min-width="80"></el-table-column>
      <el-table-column
        prop="user_id"
        :label="$t('message.withdraw_amount')"
        :min-width="isEnglish?150:100"
      >
        <template slot-scope="scope">
          <span>{{scope.row.amount | rmb}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bankcard_id" :label="$t('message.card_number')" min-width="150">
        <template slot-scope="scope">
          <div
            v-if="scope.row.bankcard_id && scope.row.bankcard"
          >{{`${scope.row.bankcard.id} > ${scope.row.bankcard.name} - ${$store.getters.allBankCodeTypeString[scope.row.bankcard.bank_name]} - ${scope.row.bankcard.card_user}`}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="used_channels"
        :label="$t('message.last_channel')"
        :width="$store.state.ua.isEnglish?200:170"
      >
        <template slot-scope="scope">
          <div>{{scope.row.used_channels && scope.row.used_channels.join("\n")}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" sortable :label="$t('message.create_time')" min-width="150"></el-table-column>
      <el-table-column prop="success_at" sortable :label="$t('message.success_time')" min-width="150"></el-table-column>
      <el-table-column prop="updated_at" sortable :label="$t('message.last_update_time')" min-width="150"></el-table-column>
      <el-table-column
        prop="user_id"
        :label="$t('message.order_status')"
        :min-width="isEnglish?150:120"
      >
        <template slot-scope="scope">{{$store.state.ua.channelOrderStatus[scope.row.status]}}</template>
      </el-table-column>
      <el-table-column prop="operator_name" :label="$t('message.operator')" min-width="100"></el-table-column>
      <el-table-column prop="remark" :label="$t('message.remark')" min-width="200"></el-table-column>
      <el-table-column
        :label="$t('message.operation')"
        :min-width="isEnglish?200:150"
        fixed="right"
      >
        <template slot-scope="scope">
          <div>
            <!-- 人工处理不需要查看 -->
            <el-button
              type="primary"
              v-if="!((scope.row.status === 'lock') && (scope.row.operator_id == $store.getters.userinfo.id))"
              size="mini"
              @click="look(scope.row)"
            >{{$t('message.view')}}</el-button>
            <el-button
              v-if="scope.row.status === 'new'"
              type="danger"
              size="mini"
              @click="lock(scope.row)"
            >{{$t('message.lock')}}</el-button>
            <!-- 订单锁定，且操作人是自己才可以人工处理 -->
            <el-button
              size="mini"
              v-if="(scope.row.status === 'lock') && (scope.row.operator_id == $store.getters.userinfo.id)"
              @click="handleOrder(scope.row)"
            >{{$t('message.manual_processing')}}</el-button>
            <!-- 下分成功返款 -->
            <el-button
              size="mini"
              type="warning"
              v-if="(scope.row.status === 'success')"
              @click="returnOrder(scope.row)"
            >{{$t('message.refund')}}</el-button>
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

    <detailDialog ref="detailDialog" @onclose="dialogClose" />
    <exportTable ref="recordDialog" @onclose="dialogClose" />
  </div>
</template>

<script>
import { manualOrderApi } from "@/api/myChannel";
import HandlePerson from "@/components/Select/HandlePerson";
import detailDialog from "./detailDialog";
import Merchant from "@/components/Select/Merchant";
import BankSelect from "@/components/Select/BankSelect";
import {getIsVietnam} from '@/utils/config';
import timedate from "@/utils/timedate.js";
import exportTable from "@/components/exportTable";
export default {
  components: {
    detailDialog,
    HandlePerson,
    Merchant,
    BankSelect,
    exportTable
  },
  data() {
    return {
      dataStatus: 1, // 1.创建时间，2.完成时间
      downloading: false,
      isVietnam: getIsVietnam(),
      options: [],
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
      listData: {},
      q: { page_size: 30, page_no: 1 }
    };
  },
  activated() {
    this.getList();
  },
  computed: {
    isEnglish() {
      return this.$store.state.ua.isEnglish;
    },
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
      this.$refs.recordDialog.open('INNER_CHANNEL_ORDER');
    },
    getOptions(options) {
      this.options = options;
    },
    changeDateStatus(status) {
      this.dataStatus = status;
      this.$set(this.q, "time_range", "");
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
      }else {
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
        manualOrderApi.getList(this.$qfilter(query)).then(res => {
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

      });
    },
    // 返款
    returnOrder(row) {
      this.$confirm(
        this.isEnglish
          ? `Are you sure to refund the order【<span style="color:red">${row.mch_withdraw_no}</span>】 to the merchant【<span style="color:red">${row.user_mch_name}</span>】? `
          : `确定给【<span style="color:red">${row.user_mch_name}</span>】商户【<span style="color:red">${row.mch_withdraw_no}</span>】订单返款吗`,
        this.$t("message.hint"),
        {
          confirmButtonText: this.isEnglish ? "ok" : "确定返款",
          cancelButtonText: this.$t("message.cancel"),
          type: "warning",
          dangerouslyUseHTMLString: true
        }
      )
        .then(() => {
          this.$vcode().then(() => {
            manualOrderApi.returnOrder(row.id, {}).then(res => {
              if (res.status === 0) {
                this.$message({
                  type: "success",
                  message: this.isEnglish
                    ? `Order【<span style="color:red">${row.id}</span>】refund successful`
                    : `订单【<span style="color:red">${row.id}</span>】返款成功`,
                  dangerouslyUseHTMLString: true
                });
                this.getList();
              }
            });
          });
        })
        .catch(() => {
          this.$message.info(this.$t("message.cancelled"));
        });
    },
    // 人工处理
    handleOrder(row) {
      this.$refs.detailDialog.open(row.id, "handle");
    },
    // 查看
    look(row) {
      this.$refs.detailDialog.open(row.id, "look");
    },
    // 锁定
    lock(row) {
      this.$confirm(
        this.isEnglish
          ? `This order cannot be processed by others after being locked. Are you sure you want to lock it?`
          : `锁定后该订单无法被其他人处理，是否确定锁定？`,
        this.$t("message.hint"),
        {
          confirmButtonText: this.$t("message.ok"),
          cancelButtonText: this.$t("message.cancel"),
          type: "warning"
        }
      )
        .then(() => {
          manualOrderApi.lock(row.id).then(res => {
            if (res.status === 0) {
              this.$message({
                type: "success",
                message: this.isEnglish
                  ? `Order【<span style="color:red">${row.id}</span>】locked successfully`
                  : `订单【<span style="color:red">${row.id}</span>】锁定成功`,
                dangerouslyUseHTMLString: true
              });
              this.getList();
            }
          });
        })
        .catch(() => {
          this.$message.info(this.$t("message.cancelled"));
        });
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
      }else {
        query = this.$dateFilter({
          data: this.q,
          range: "time_range",
          start: "created_at_begin",
          end: "created_at_end"
        });
      }
      manualOrderApi.getList(this.$qfilter(query)).then(res => {
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
    dialogClose({ update }) {
      // 需要更新
      if (update) {
        this.getList();
      }
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
