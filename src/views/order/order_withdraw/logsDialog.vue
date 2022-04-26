<template>
  <!-- 批量操作的弹窗 -->
  <el-dialog
    destroy-on-close
    :close-on-click-modal="false"
    :title="$t('message.channel_logs')"
    :visible.sync="dialogVisible"
    width="800px"
    @close="close"
  >
    <el-form v-if="dialogVisible" :label-width="labelWidth" size="mini">
      <el-row>
        <el-col :span="24">
          <div class="logs">
            <div v-for="(item, index) in detail" :key="index" class="logsDetail">
              {{item}}
            </div>
            <div v-if="isNoData" class="logsDetail">
              {{$t('message.no_data')}}
            </div>
          </div>
        </el-col>
      </el-row>
      <el-form-item align="right">
        <el-button type v-if="!isNoData" @click="copyLog">{{$t('message.copy')}}</el-button>
        <el-button type @click="cancel">{{$t('message.close')}}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { orderApi } from "@/api/order";
import {getIsVietnam} from '@/utils/config'
const isEnglish = localStorage.getItem("ua-admin-lang") === "en";

export default {
  data() {
    return {
      isVietnam: getIsVietnam(),
      dialogVisible: false,
      detail: [],
      labelWidth: isEnglish ? "180px" : "120px",
      isNoData: true,
    };
  },
  methods: {
    cancel() {
      this.dialogVisible = false;
    },
    open(id) {
      orderApi.getLogsById(id).then(res => {
        if (res.status === 0) {
          if(res.data.log_data.length > 0) {
            this.detail = res.data.log_data;
            this.isNoData = false;
          }
          else {
            this.detail = [];
            this.isNoData = true;
          }
        }
      });
      this.dialogVisible = true;
    },
    close() {
      this.detail = {};
    },
    copyLog() {
      let text = this.detail;
      this.$copyText(text).then(() => {
        this.$message({
          type: 'success',
          message: this.$t('message.copy') + text,
          showClose: true,
        });
      }, (e) => {
        console.log(e)
      });
    },
  }
};
</script>

<style lang="css" scoped>
  .logs{
    padding: 4%;
    box-sizing: border-box;
  }
  .logsDetail{
    margin-bottom: 30px;
    text-align: center;
  }
</style>