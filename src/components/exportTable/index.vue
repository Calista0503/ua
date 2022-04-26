<template>
  <div id="record">
    <el-dialog :close-on-click-modal="false" title="异步导出记录" :visible.sync="showDialog" @close="$emit('update:showDialog', false)"
                width="760px">

      <el-row type="flex" class="table-btns" justify="end">
        <el-button
          size="mini"
          @click="getRecordData(reportType)"
          :loading="downloading"
          type="primary"
        >刷 新</el-button>
      </el-row>
      <el-table border :data="recordData" style="width: 100%" size="mini">
        <el-table-column property="created_at" label="导出时间" min-width="150"></el-table-column>
        <el-table-column property="file_name" label="文件名称" show-overflow-tooltip min-width="300"></el-table-column>
        <el-table-column property="status" label="状态" min-width="120">
          <template slot-scope="scope">
            <div>{{$store.state.ua.reportStatus[scope.row.status]}}</div>
          </template>
        </el-table-column>
        <el-table-column property="status" label="操作" min-width="110">
          <template slot-scope="scope">
            <div>
              <el-button v-if="scope.row.status==='done'" type="warning" @click="download(scope.row)" size="small">下载</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false;" size="small">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {downloadApi} from '@/api/excel';
  export default {
    name: 'record',
    components: {},

    data() {
      return {
        showDialog: false,
        downloading: false,
        recordData: [],
        reportType: '',
      }
    },

    methods: {
      open(type){
        if (type){
          this.getRecordData(type)
          this.reportType = type
        }
        this.showDialog = true;
      },

      //获取异步导出记录
      getRecordData(type){
        this.downloading = true
        downloadApi.get({report_type: type}).then(res => {
          if (res.status===0) {
            this.recordData = res.data.items;
            this.downloading = false
          }
        }).catch(()=> {
          this.downloading = false
        })
      },
      download(row){
        downloadApi.download(row.id).then(res => {
          if (res.status===0){
             this.$downloadFile(res.data.url)
          }
        })
      }
    }
  }
</script>
<style lang="scss">

</style>
