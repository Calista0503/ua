<template>
  <div>
    <el-row type="flex" class="table-btns" justify="end">
      <el-button
        size="mini"
        @click="add"
        type="primary"
        icon="el-icon-plus"
      >{{'新增配置'}}</el-button>
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
      <el-table-column prop="id" :label="$t('message.channel_id')" :min-width="isEnglish ? 100 : 60"></el-table-column>
      <el-table-column prop="merchant_name" :label="$t('message.related_mch')" show-overflow-tooltip min-width="120"></el-table-column>
      <el-table-column prop="channel_provider_id" :label="$t('message.channel_mch_parent')" show-overflow-tooltip :min-width="isEnglish ? 200 : 120">
        <template slot-scope="scope">
          <div>{{getChannelMchName(scope.row.channel_provider_id)}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="bot_type" :label="$t('message.connect_software')" min-width="150">
        <template slot-scope="scope">
          <div>
            <span>{{scope.row.bot_type}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="group_id" :label="$t('message.software_id')" min-width="150"></el-table-column>
      <el-table-column prop="delay_time" :label="$t('message.delay_time')" min-width="120"></el-table-column>
      <el-table-column prop="created_at" :label="$t('message.create_time')" min-width="200"></el-table-column>
      <el-table-column prop="updated_at" :label="$t('message.update_time')" min-width="200"></el-table-column>
      <el-table-column :label="$t('message.operation')" min-width="150" fixed="right">
        <template slot-scope="scope">
          <div>
            <el-button type="primary" size="mini" @click="edit(scope.row)">{{$t('message.edit')}}</el-button>
            <el-button type="danger" size="mini" @click="deleteFn(scope.row)">{{$t('message.delete')}}</el-button>
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
    <saveUpdate ref="dialog" @onclose="dialogClose" :channelMch="channelMch" />
  </div>
</template>

<script>
import saveUpdate from "./saveUpdate";
import { orderSyncApi, channelMchApi } from "@/api/channel";
export default {
  components: {
    saveUpdate,
  },
  data() {
    return {
      channelMch: [],
      listData: {},
      q: { page_size: 30, page_no: 1, enable: true}
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
    getChannelMchName(id) {
      let objMch = this.channelMch.find(item => item.id === id && item.name);
      return objMch ? objMch.name : '';
    },
    add() {
      this.$refs.dialog.open();
    },
    edit(row) {
      this.$refs.dialog.open(row.id);
    },
    deleteFn(row) {
      this.$confirm(
        `确定要删除商户【${row.merchant_name}】通道商【${this.getChannelMchName(row.channel_provider_id)}】的申诉同步配置吗？`,
        this.$t("message.hint"),
        {
          confirmButtonText: this.$t("message.ok"),
          cancelButtonText: this.$t("message.cancel"),
          type: "warning"
        }
      )
        .then(() => {
          this.$vcode().then(() => {
            orderSyncApi.delete(row.id).then(res => {
              if (res.status === 0) {
                this.$message.success(`同步配置【${row.name}】删除成功`);
                this.getList();
              }
            });
          });
        })
        .catch(() => {
          this.$message.info(this.$t("message.cancelled"));
        });
    },
    async getList() {
      if (this.channelMch.length === 0) {
        await channelMchApi.get({ page_size: 1000, page_no: 1 }).then(res => {
          if (res.status === 0) {
            this.channelMch = res.data.items.map(item => ({
              id: item.id,
              name: item.name
            }));
          }
        });
      };
      await orderSyncApi.get(this.$qfilter(this.q)).then(res => {
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
