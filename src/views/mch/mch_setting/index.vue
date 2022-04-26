<template>
  <div>
    <el-row type="flex" class="table-btns" justify="end">
      <el-button size="mini" @click="add" type="primary" icon="el-icon-plus">新增商户</el-button>
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
      <el-table-column prop="id" fixed="left" label="商户ID" min-width="80"></el-table-column>
      <el-table-column prop="name" fixed="left" label="商户名称" show-overflow-tooltip min-width="120"></el-table-column>
      <el-table-column prop="merchant_code" fixed="left" label="商户代码" min-width="120"></el-table-column>
      <el-table-column prop="currency_type" fixed="left" label="币别" min-width="80"></el-table-column>
      <el-table-column prop="name" label="商户类型" min-width="150">
        <template slot-scope="scope">
          <div
            v-if="scope.row.mch_types && (scope.row.mch_types instanceof Array) && (scope.row.mch_types.length>0)"
          >
            <span
              v-for="(item,index) in getAssociatedMchType(scope.row.mch_types)"
              :key="item.id"
            >{{item.name}}{{index==(getAssociatedMchType(scope.row.mch_types).length-1)?'':'，'}}</span>
          </div>
          <div v-else></div>
        </template>
      </el-table-column>
      <el-table-column prop="user_id" label="下分类型" min-width="150">
        <template slot-scope="scope">
          <div
            v-if="scope.row.withdraw_types && (scope.row.withdraw_types instanceof Array) && (scope.row.withdraw_types.length>0)"
          >
            <span
              v-for="(item,index) in getEnableWithdrawTypes(scope.row.withdraw_types)"
              :key="item.id"
            >
             <span v-if="isVietnam">{{$store.state.ua.vnWithdrawType[item.withdraw_type]}}{{index==(getEnableWithdrawTypes(scope.row.withdraw_types).length-1)?'':'，'}}</span>
              <span v-else>{{$store.state.ua.withdrawType[item.withdraw_type]}}{{index==(getEnableWithdrawTypes(scope.row.withdraw_types).length-1)?'':'，'}}</span>
            </span>
          </div>
          <div v-else></div>
        </template>
      </el-table-column>
      <el-table-column prop="user_id" label="银行卡费率" min-width="100">
        <template slot-scope="scope">{{getRate(scope.row,'银行卡')}}</template>
      </el-table-column>
      <el-table-column prop="user_id" label="支付宝费率" min-width="100">
        <template slot-scope="scope">{{getRate(scope.row,'支付宝')}}</template>
      </el-table-column>
      <el-table-column v-if="isVietnam" prop="user_id" label="MoMo费率" min-width="100">
        <template slot-scope="scope">{{getRate(scope.row,'越南MoMo')}}</template>
      </el-table-column>
      <el-table-column prop="user_id" label="银行卡金额" min-width="100">
        <template slot-scope="scope">{{getAmount(scope.row,'银行卡')}}</template>
      </el-table-column>
      <el-table-column prop="user_id" label="支付宝金额" min-width="100">
        <template slot-scope="scope">{{getAmount(scope.row,'支付宝')}}</template>
      </el-table-column>
      <el-table-column v-if="isVietnam" prop="user_id" label="MoMo金额" min-width="100">
        <template slot-scope="scope">{{getAmount(scope.row,'越南MoMo')}}</template>
      </el-table-column>
      <el-table-column prop="user_id" label="当前余额" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.balance">{{scope.row.balance | rmb}}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column prop="user_id" label="当前状态" min-width="100">
        <template slot-scope="scope">
          <div :style="{color:scope.row.enable?'green':'red'}">{{scope.row.enable?'启用':'禁用'}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" min-width="180"></el-table-column>
      <el-table-column prop="updated_at" label="最后更新时间" min-width="180"></el-table-column>
      <el-table-column label="操作" min-width="300" fixed="right">
        <template slot-scope="scope">
          <div>
            <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
            <el-button size="mini" @click="resetPassword(scope.row)">重置密码</el-button>
            <el-button size="mini" @click="resetVcodeSecret(scope.row)">重置验证器</el-button>
            <el-button type="danger" size="mini" @click="keyMgr(scope.row)">密钥</el-button>
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
    <key-dialog ref="keyDialog" />
  </div>
</template>

<script>
import saveUpdate from "./saveUpdate";
import keyDialog from "./keyDialog";
import { mchApi } from "@/api/mch";
import {getIsVietnam} from '@/utils/config'
export default {
  components: {
    saveUpdate,
    keyDialog
  },
  data() {
    return {
      isVietnam: getIsVietnam(),
      listData: {},
      q: { page_size: 30, page_no: 1 }
    };
  },
  activated() {
    this.getList();
  },
  methods: {
    //获取商户类型
    getAssociatedMchType(mchs) {
      let arr = [];
      for (let item of mchs) {
        arr.push(item);
      }
      return arr;
    },
    // 获取可用的提现方案
    getEnableWithdrawTypes(withdrawTypes) {
      const arr = [];
      for (let item of withdrawTypes) {
        if (item.enable) {
          arr.push(item);
        }
      }
      return arr;
    },
    add() {
      this.$refs.dialog.open();
    },
    edit(row) {
      console.log(row);
      this.$refs.dialog.open(row.id);
    },
    resetPassword(row) {
      this.$vcode().then(() => {
        mchApi.resetPassword(row.id).then(res => {
          if (res.status === 0) {
            this.$message({
              type: "success",
              message: `商户【${row.name}】密码重置成功，新密码为：${res.data.console_password}`,
              duration: 10000
            });
          }
        });
      });
    },
    resetVcodeSecret(row) {
      this.$vcode().then(() => {
        mchApi.resetVcodeSecret(row.id).then(res => {
          if (res.status === 0) {
            this.$message({
              type: "success",
              message: `商户【${row.name}】绑定验证器重置成功`,
              duration: 10000
            });
          }
        });
      });
    },
    // 打开密钥管理
    keyMgr(row) {
      this.$refs.keyDialog.open(row.id);
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
            rate = (item.rate > 0 ? Number(item.rate) * 100 : 0) + "%";
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
      mchApi.get(this.$qfilter(this.q)).then(res => {
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
