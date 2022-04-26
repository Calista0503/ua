<template>
  <div>
    <div class="toolbar">
      <el-form :inline="true" :model="q" size="mini">
        <el-form-item :label="$t('message.card_number1')">
          <el-input v-model="q.name" :placeholder="$t('message.please_input')"></el-input>
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
        <Merchant
          @getOptions="getOptions"
          :title="$t('message.designated_merchant')"
          v-model="q.user_mch_id"
        ></Merchant>

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
      >{{isEnglish?'Add bank card':'新增银行卡'}}</el-button>
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
        :label="$t('message.bankcard_id')"
        :min-width="isEnglish?100:80"
      ></el-table-column>
      <el-table-column prop="name" fixed="left" :label="$t('message.card_number1')" min-width="100"></el-table-column>
      <el-table-column prop="currency_type" fixed="left" label="币别" min-width="80"></el-table-column>
      <el-table-column
        prop="user_mch_name"
        :label="$t('message.designated_merchant')"
        :min-width="isEnglish?150:100"
      ></el-table-column>
      <el-table-column prop="card_number" :label="$t('message.bank_card_number')" min-width="150"></el-table-column>
      <el-table-column
        prop="card_user"
        :label="$t('message.account_holder')"
        :min-width="isEnglish?120:100"
      ></el-table-column>
      <el-table-column
        prop="bank_name"
        :label="$t('message.bank_name')"
        min-width="100"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <div v-if="scope.row.bank_name">
            <span>{{$store.getters.allBankCodeTypeString[scope.row.bank_name]}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="stale_dated_at" :label="$t('message.expire_date')" min-width="150">
        <template slot-scope="scope">{{timeFormat(scope.row.stale_dated_at)}}</template>
      </el-table-column>
      <el-table-column prop="user_id" :label="$t('message.daily_limit')" min-width="100">
        <template slot-scope="scope">{{Number(scope.row.daily_limit)/100}}</template>
      </el-table-column>
      <el-table-column
        prop="user_id"
        :label="$t('message.cumulative_limit')"
        :min-width="isEnglish?120:100"
      >
        <template slot-scope="scope">{{Number(scope.row.total_limit)/100}}</template>
      </el-table-column>
      <el-table-column
        prop="user_id"
        :label="$t('message.current_status')"
        :min-width="isEnglish?120:100"
      >
        <template slot-scope="scope">
          <div
            :style="`color:${scope.row.enable?'green':'red'}`"
          >{{scope.row.enable?$t('message.enable'):$t('message.disable')}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="user_id"
        :label="$t('message.remark')"
        show-overflow-tooltip
        min-width="150"
      >
        <template slot-scope="scope">{{scope.row.remark?scope.row.remark:''}}</template>
      </el-table-column>
      <el-table-column prop="created_at" :label="$t('message.create_time')" min-width="150"></el-table-column>
      <el-table-column prop="updated_at" :label="$t('message.last_update_time')" min-width="150"></el-table-column>
      <el-table-column
        :label="$t('message.operation')"
        :min-width="isEnglish?200:150"
        fixed="right"
      >
        <template slot-scope="scope">
          <div>
            <el-button
              type="primary"
              size="mini"
              @click="edit(scope.row)"
            >{{$t('message.edit')}}</el-button>
            <el-button
              type="danger"
              size="mini"
              @click="deleteFn(scope.row)"
            >{{$t('message.delete')}}</el-button>
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
import { bankApi } from "@/api/myChannel";
import Merchant from "@/components/Select/Merchant";
import {getIsVietnam} from '@/utils/config'
export default {
  components: {
    saveUpdate,
    Merchant
  },
  data() {
    return {
      isVietnam: getIsVietnam(),
      listData: {},
      options: [],
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
    getOptions(options) {
      this.options = options;
    },
    timeFormat(time) {
      return time;
    },
    deleteFn(row) {
      this.$confirm(
        this.isEnglish
          ? `Are you sure you want to delete bank card【${row.name}】`
          : `确定要删除银行卡【${row.name}】吗`,
        this.$t("message.hint"),
        {
          confirmButtonText: this.$t("message.ok"),
          cancelButtonText: this.$t("message.cancel"),
          type: "warning"
        }
      )
        .then(() => {
          this.$vcode().then(() => {
            bankApi.delete(row.id).then(res => {
              if (res.status === 0) {
                this.$message.success(
                  this.isEnglish
                    ? `Bank card【${row.name}】deleted successfully`
                    : `银行卡【${row.name}】删除成功`
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
      this.$refs.dialog.open(row.id, row.currency_type);
    },

    getList() {
      bankApi.get(this.$qfilter(this.q)).then(res => {
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
