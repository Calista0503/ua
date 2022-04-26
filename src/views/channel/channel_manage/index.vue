<template>
  <div>
    <div class="toolbar">
      <el-form :inline="true" :model="q" size="mini">
        <channel-mch title="通道商名称" multiple ref="channelMch" v-model="q.ids"></channel-mch>

        <el-form-item label="通道商类型">
          <el-select v-model="q.channel_type" placeholder="请选择" clearable>
            <el-option v-for="(item, key) in channelMchType" :key="key" :label="item" :value="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下分类型">
          <el-select v-if="isVietnam" v-model="q.withdraw_type" placeholder="请选择" clearable>
            <el-option
              v-for="(value,key) in $store.state.ua.vnWithdrawType"
              :key="key"
              :label="value"
              :value="key"
            ></el-option>
          </el-select>

          <el-select v-else v-model="q.withdraw_type" placeholder="请选择" clearable>
            <el-option
              v-for="(value,key) in $store.state.ua.withdrawType"
              :key="key"
              :label="value"
              :value="key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="当前状态">
          <el-select v-model="q.enable" placeholder="请选择" clearable>
            <el-option
              v-for="(value,key) in {'启用':true,'禁用':false}"
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

        <el-form-item>
          <el-button type="primary" @click="query">查询</el-button>
          <el-button type="danger" @click="reload">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-row type="flex" class="table-btns" justify="end">
      <el-button size="mini" @click="add" type="primary" icon="el-icon-plus">新增通道商</el-button>
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
      <el-table-column prop="id" fixed="left" label="通道商ID" min-width="80"></el-table-column>
      <el-table-column prop="name" fixed="left" label="通道商名称" min-width="120"></el-table-column>
      <el-table-column prop="channel_type" label="通道商类型" min-width="140">
        <template slot-scope="scope">{{channelMchType[scope.row.channel_type]}}</template>
      </el-table-column>
      <el-table-column prop="currency_type" fixed="left" label="币别" min-width="80"></el-table-column>
      <el-table-column v-if="isVietnam" prop="user_id" label="下分类型" min-width="100">
        <template slot-scope="scope">
          <div v-if="scope.row.withdraw_type && (scope.row.withdraw_type instanceof Array)">
            <span
              :key="item"
              v-for="(item,index) in scope.row.withdraw_type"
            >{{index === 0?'':'，'}}{{$store.state.ua.vnWithdrawType[item]}}</span>
          </div>
          <div v-else></div>
        </template>
      </el-table-column>
      <el-table-column v-else prop="user_id" label="下分类型" min-width="100">
        <template slot-scope="scope">
          <div v-if="scope.row.withdraw_type && (scope.row.withdraw_type instanceof Array)">
            <span
              :key="item"
              v-for="(item,index) in scope.row.withdraw_type"
            >{{index === 0?'':'，'}}{{$store.state.ua.withdrawType[item]}}</span>
          </div>
          <div v-else></div>
        </template>
      </el-table-column>
      <el-table-column prop="console_url" label="后台地址" min-width="150"></el-table-column>
      <el-table-column prop="balance" label="当前余额" min-width="100">
        <template slot-scope="scope">
          <span>{{scope.row.balance | rmb}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="enable" label="启用状态" min-width="80">
        <template slot-scope="scope">
          <div :style="scope.row.enable?'color:green':'color:red'">{{scope.row.enable?'启用':'禁用'}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="200"></el-table-column>
      <el-table-column prop="created_at" label="创建时间" min-width="150"></el-table-column>
      <el-table-column prop="updated_at" label="最后更新时间" min-width="150"></el-table-column>
      <el-table-column label="操作" min-width="150" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="recharge(scope.row)">充值</el-button>
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

    <saveUpdate ref="dialog" @onclose="dialogClose" :chnnelMchType="channelMchType" />
    <rechargeDialog ref="rechargeDialog" @onclose="dialogClose" />
  </div>
</template>

<script>
import ChannelMch from "@/components/Select/ChannelMch";
import saveUpdate from "./saveUpdate";
import rechargeDialog from "./rechargeDialog";
import { channelMchApi } from "@/api/channel";
import {getIsVietnam} from '@/utils/config';

export default {
  components: {
    ChannelMch,
    saveUpdate,
    rechargeDialog
  },
  data() {
    return {
      isVietnam: getIsVietnam(),
      listData: {},
      q: { page_size: 30, page_no: 1 },
      channelMchType: [],
    };
  },
  activated() {
    this.getChnnelMchType();
    this.getList();
  },
  methods: {
    // 获取通道商类型
    getChnnelMchType() {
      channelMchApi.getChanneMchlType().then(res => {
        if (res.status === 0) {
          this.channelMchType = res.data;
        }
      });
    },
    recharge(row) {
      this.$refs.rechargeDialog.open(row);
    },
    // 监听弹窗关闭，是否更新列表。
    dialogClose({ update }) {
      if (update) {
        this.$refs.channelMch.getOptions();
        this.getList();
      }
    },
    add() {
      this.$refs.dialog.open();
    },
    edit(row) {
      this.$refs.dialog.open(row.id);
    },

    getList() {
      channelMchApi.get(this.$qfilter(this.q)).then(res => {
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
