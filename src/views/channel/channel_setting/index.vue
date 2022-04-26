<template>
  <div>
    <div class="toolbar">
      <el-form :inline="true" :model="q" size="mini">
        <ChannelNameSelect
          ref="channelNameSelect"
          v-model="q.name"
          :title="$t('message.channel_name')"
        ></ChannelNameSelect>

        <channel-mch
          :title="$t('message.channel_mch_parent')"
          v-model="q.channel_provider_id"
          @getOptions="onGetChannelMchOptions"
        ></channel-mch>

        <el-form-item :label="$t('message.withdraw_method1')">
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

        <Merchant v-model="q.mch_id" :title="$t('message.support_merchants')" />

        <el-form-item :label="$t('message.current_status')">
          <el-select v-model="q.enable" :placeholder="$t('message.please_select')" clearable>
            <el-option
              v-for="(value,key) in {[$t('message.enable')]:true,[$t('message.disable')]:false}"
              :key="key"
              :label="key"
              :value="value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('message.support_decimal')">
          <el-select v-model="q.support_decimal" :placeholder="$t('message.please_select')" clearable>
            <el-option
              v-for="(value,key) in {[$t('message.enable')]:true,[$t('message.disable')]:false}"
              :key="key"
              :label="key"
              :value="value"
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

        <el-form-item :label="$t('message.support_other_banks')">
          <el-select v-model="q.support_other_banks" :placeholder="$t('message.please_select')" clearable>
            <el-option
              v-for="(value,key) in {['是']:true,['否']:false}"
              :key="key"
              :label="key"
              :value="value"
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
        @click="add"
        type="primary"
        icon="el-icon-plus"
      >{{isEnglish?'Add channel':'新增通道'}}</el-button>
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
      <el-table-column
        prop="id"
        fixed="left"
        :label="$t('message.channel_id')"
        :min-width="isEnglish?100:80"
      ></el-table-column>
      <el-table-column
        prop="name"
        fixed="left"
        :label="$t('message.channel_name')"
        show-overflow-tooltip
        min-width="120"
      ></el-table-column>
      <el-table-column
        prop="name"
        :label="$t('message.channel_mch_parent')"
        show-overflow-tooltip
        :min-width="isEnglish?200:120"
      >
        <template slot-scope="scope">
          <div>{{channelMchMap[scope.row.channel_provider_id]}}</div>
        </template>
      </el-table-column>
      <el-table-column v-if="isVietnam" prop="user_id" :label="$t('message.withdraw_method1')" min-width="150">
        <template slot-scope="scope">
          <div v-if="scope.row.withdraw_type">
            <span>{{$store.state.ua.vnWithdrawType[scope.row.withdraw_type]}}</span>
          </div>
          <div v-else></div>
        </template>
      </el-table-column>
      <el-table-column v-else prop="user_id" :label="$t('message.withdraw_method1')" min-width="150">
        <template slot-scope="scope">
          <div v-if="scope.row.withdraw_type">
            <span>{{$store.state.ua.withdrawType[scope.row.withdraw_type]}}</span>
          </div>
          <div v-else></div>
        </template>
      </el-table-column>
      <el-table-column prop="user_id" :label="$t('message.support_bank')" min-width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.bank_codes">
            <span v-for="(item, index) in scope.row.bank_codes" :key="index">
              {{index===0?'':'，'}}{{$store.getters.allBankCodeTypeString[item]}}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="user_id" :label="$t('message.support_merchants')" min-width="200">
        <template slot-scope="scope">
          <div v-if="scope.row.support_mch">
            <span
              v-for="(item,index) in scope.row.support_mch"
              :key="item.name"
            >{{index===0?'':'，'}}{{item.name}}</span>
          </div>
          <div v-else>{{$t('message.all')}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="user_id"
        :label="$t('message.rate',[$t('message.channel')])"
        min-width="100"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.rate">{{`${(scope.row.rate)}%`}}</span>
          <span v-else>0%</span>
        </template>
      </el-table-column>
      <el-table-column prop="weight" :label="$t('message.initial_weight')" min-width="100"></el-table-column>
       <!-- 越南版不显示定额 -->
      <el-table-column
        prop="user_id"
        :label="$t('message.quota_amount')"
        :min-width="200"
        v-if="!isVietnam"
      >
        <template slot-scope="scope">
          <div
            style="white-space:nowrap;text-overflow: ellipsis;width: 100%; overflow: hidden;"
            v-if="scope.row.quota_amount"
          >
            <span
              v-for="(item,index) in scope.row.quota_amount"
              :key="item"
            >{{index>0?'，':''}}{{rmbFilter(item)}}</span>
          </div>
          <div v-else>
            <span>--</span>
          </div>
        </template>
      </el-table-column>      
      <el-table-column
        prop="user_id"
        :label="$t('message.amount_range')"
        :min-width="isEnglish?160:100"
      >
        <template slot-scope="scope">
          <span
            v-if="scope.row.single_min_amount !== null && scope.row.single_max_amount !== null"
          >{{`${rmbFilter(scope.row.single_min_amount)} - ${rmbFilter(scope.row.single_max_amount)}`}}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="user_id"
        :label="$t('message.minute_frequency_limit')"
        :min-width="isEnglish?160:100"
      >
        <template slot-scope="scope">{{scope.row.minute_frequency_limit}}</template>
      </el-table-column>

      <el-table-column
        prop="user_id"
        :label="$t('message.upper_limit',[$t('message.daily')])"
        :min-width="isEnglish?160:100"
      >
        <template slot-scope="scope">{{Number(scope.row.daily_amount_limit)/100}}</template>
      </el-table-column>
      <el-table-column prop="user_id" :label="$t('message.opening_time')" min-width="100">
        <template slot-scope="scope">{{timeFormat(scope.row.start_hour)}}</template>
      </el-table-column>
      <el-table-column prop="user_id" :label="$t('message.closing_time')" min-width="100">
        <template slot-scope="scope">{{timeFormat(scope.row.end_hour)}}</template>
      </el-table-column>
      <el-table-column prop="currency_type" fixed="left" label="币别" min-width="80"></el-table-column>
      <el-table-column
        prop="user_id"
        :label="$t('message.current_status')"
        :min-width="isEnglish?120:100"
      >
        <template slot-scope="scope">
          <div :style="`color:${scope.row.enable?'green':'red'}`">{{scope.row.enable?'启用':'禁用'}}</div>
        </template>
      </el-table-column>
      
      <el-table-column
        prop="user_id"
        :label="$t('message.support_decimal')"
        :min-width="isEnglish?120:100"
      >
        <template slot-scope="scope">
          <div :style="`color:${scope.row.support_decimal?'green':'red'}`">{{scope.row.support_decimal?'启用':'禁用'}}</div>
        </template>
      </el-table-column>

      <el-table-column
        prop="user_id"
        :label="$t('message.support_other_banks')"
        :min-width="isEnglish?120:100"
      >
        <template slot-scope="scope">
          <div :style="`color:${scope.row.support_other_banks?'green':'red'}`">{{scope.row.support_other_banks?'启用':'禁用'}}</div>
        </template>
      </el-table-column>

      <el-table-column
        prop="user_id"
        :label="$t('message.remark')"
        show-overflow-tooltip
        width="150"
      >
        <template slot-scope="scope">{{scope.row.remark?scope.row.remark:''}}</template>
      </el-table-column>
      <el-table-column prop="created_at" :label="$t('message.create_time')" min-width="150"></el-table-column>
      <el-table-column prop="updated_at" :label="$t('message.last_update_time')" min-width="150"></el-table-column>
      <el-table-column :label="$t('message.operation')" min-width="150" fixed="right">
        <template slot-scope="scope">
          <div>
            <el-button
              :type="scope.row.enable?'danger':'success'"
              size="mini"
              @click="changeStatus(scope.row)"
            >{{scope.row.enable?$t('message.disable'):$t('message.enable')}}</el-button>
            <el-button type="primary" size="mini" @click="edit(scope.row)">{{$t('message.edit')}}</el-button>
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
import { channelApi } from "@/api/channel";
import ChannelMch from "@/components/Select/ChannelMch";
import ChannelNameSelect from "@/components/Select/ChannelNameSelect";
import Merchant from "@/components/Select/Merchant";
import {getIsVietnam} from '@/utils/config';

export default {
  components: {
    saveUpdate,
    ChannelMch,
    ChannelNameSelect,
    Merchant
  },
  data() {
    return {
      isVietnam: getIsVietnam(),
      channelMch: [],
      listData: {},
      q: { page_size: 30, page_no: 1, enable: true},
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
    channelMchMap() {
      const channelMchMap = {};
      this.channelMch.forEach(item => {
        channelMchMap[item.id] = item.name;
      });
      return channelMchMap;
    }
  },
  methods: {
    // 小时补全
    timeFormat(h) {
      h = Number(h);
      return `${h < 10 ? "0" + h : h}:00`;
    },
    // 获取通道商
    onGetChannelMchOptions(val) {
      console.log(val);
      this.channelMch = val;
    },
    changeStatus(row) {
      this.$confirm(
        this.isEnglish
          ? `Are you sure to ${
              row.enable ? "disable" : "enable"
            } the channel【${row.name}】`
          : `确定${row.enable ? "禁用" : "开启"}通道【${row.name}】吗`,
        this.$t("message.hint"),
        {
          confirmButtonText: this.$t("message.ok"),
          cancelButtonText: this.$t("message.cancel"),
          type: "warning"
        }
      )
        .then(() => {
          const d = { ...row };
          d.enable = !d.enable;
          d.rate = d.rate / 100;
          // d.exclude_mch_types || (d.exclude_mch_types = []);
          this.$vcode().then(() => {
            channelApi.put({ data: d, id: row.id }).then(res => {
              if (res.status === 0) {
                this.$message.success(
                  this.isEnglish
                    ? `${d.enable ? "Enable" : "Disable"}【${
                        row.name
                      }】successfully`
                    : `${d.enable ? "开启" : "禁用"}【${row.name}】成功`
                );
                this.getList();
              }
            });
          });
        })
        .catch(() => {
          this.$message.info(this.$t("message.cancelled"));
        });
    },
    add() {
      this.$refs.dialog.open();
    },
    edit(row) {
      this.$refs.dialog.open(row.id,row.currency_type);
    },
    // 获取列表中某种支付方式的费率,返回‘’表示不支持该下分类型
    getRate(row, method) {
      const key = this.$store.state.ua.withdrawType_byString[method];
      let rate = "";
      if (
        row.withdraw_types &&
        row.withdraw_types instanceof Array &&
        row.withdraw_types.length > 0
      ) {
        for (let item of row.withdraw_types) {
          if (item.withdraw_type === key) {
            rate = Number(item.rate) * 100 + "%";
            break;
          }
        }
      }
      return rate;
    },
    // 获取列表中某种支付方式的金额范围,返回‘’表示不支持该下分类型
    getAmount(row, method) {
      const key = this.$store.state.ua.withdrawType_byString[method];
      let amount = "";
      if (
        row.withdraw_types &&
        row.withdraw_types instanceof Array &&
        row.withdraw_types.length > 0
      ) {
        for (let item of row.withdraw_types) {
          if (item.withdraw_type === key) {
            amount = `${Number(item.min_amount) / 100}-${Number(
              item.max_amount
            ) / 100}`;
            break;
          }
        }
      }
      return amount;
    },

    getList() {
      channelApi.get(this.$qfilter(this.q)).then(res => {
        if (res.status === 0) {
          this.listData = res.data;
          this.listData.items.map(item => {
            item.rate = item.rate.mul(100);
          });
        }
      });
    },
    // 监听弹窗关闭，查看是否需要更新列表
    dialogClose({ update }) {
      // 需要更新
      if (update) {
        this.$refs.channelNameSelect.refresh();
        this.getList();
      }
    },
    query() {
      this.getList();
    },
    reload() {
      this.q = { page_size: 30, page_no: 1, enable: true};
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
    rmbFilter(val) {
      if (val) {
        const amount = (Number(val) / 100).toFixed(2);
        // 1.00 => 1
        if (/\d*\.00/g.test(amount)) {
          return amount.substring(0, amount.length - 3);
        }
        // 1.10 => 1.1
        if (amount[amount.length - 1] == "0") {
          return amount.substring(0, amount.length - 1);
        }
        return amount;
      } else {
        return "0";
      }
    },
  }
};
</script>
