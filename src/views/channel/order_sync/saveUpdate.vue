<template>
  <el-dialog
    destroy-on-close
    :close-on-click-modal="false"
    :title="this.id?'编辑同步配置':'新增同步配置'"
    :visible.sync="dialogVisible"
    width="350px"
    @close="close"
  >
    <el-form :model="form" ref="form" label-width="120px" size="mini">
      <el-form-item :label="$t('message.related_mch')" prop="mch_id" :rules="[{ required: true, message: '关联商户不能为空'}]">
        <el-select :disabled="!!id" v-model="form.mch_id" placeholder="请选择" style="width: 100%">
          <el-option v-for="item in mchMap" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('message.channel_mch_parent')" prop="channel_provider_id" :rules="[{ required: true, message: '所属通道商不能为空'}]">
        <el-select :disabled="!!id" v-model="form.channel_provider_id" placeholder="请选择" style="width: 100%">
          <el-option v-for="item in channelMch" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('message.connect_software')" prop="bot_type" :rules="[{ required: true, message: '对接群类型不能为空'}]">
        <el-select v-model="form.bot_type" placeholder="请选择" style="width: 100%">
          <el-option label="Telegram" value="telegram" :key="0"></el-option>
          <el-option label="Potato" value="potato" :key="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('message.software_id')" prop="group_id">
        <el-input v-model="form.group_id" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item :label="$t('message.delay_time')" prop="delay_time">
        <el-input v-model="form.delay_time" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item align="right">
        <el-button type @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { orderSyncApi } from "@/api/channel";
import { mchApi } from "@/api/mch";
import {getIsVietnam} from '@/utils/config'
export default {
  props: ["channelMch"],
  data() {
    return {
      isVietnam: getIsVietnam(),
      dialogVisible: false,
      updateList: false, // 弹窗关闭时是否更新列表
      id: null,
      form: {},
      mchMap: [],
    };
  },
  created() {
    mchApi.get({ page_size: 1000, page_no: 1 }).then(res => {
      if (res.status === 0) {
        this.mchMap = res.data.items.map(item => ({
          id: item.id,
          name: item.name
        }));
      }
    });
  },
  methods: {
    // 编辑回显
    getDetailById(id) {
      orderSyncApi.getById(id).then(res => {
        if (res.status === 0) {
          this.form = res.data;
        }
      });
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.id) {
            // 编辑
            this.$vcode().then(() => {
              orderSyncApi.put({ id: this.id, data: this.form }).then(res => {
                if (res.status === 0) {
                  this.$message.success(`同步配置【${this.form.name}】编辑成功`);
                  this.updateList = true;
                  this.dialogVisible = false;
                }
              });
            });
          } else {
            // 新增
            orderSyncApi.post(this.form).then(res => {
              if (res.status === 0) {
                this.$message.success(`同步配置【${this.form.name}】新增成功`);
                this.updateList = true;
                this.dialogVisible = false;
              }
            });
          }
        }
      });
    },
    cancel() {
      this.dialogVisible = false;
    },
    open(id) {
      if (id) {
        this.id = id;
        this.getDetailById(id);
      }
      this.dialogVisible = true;
    },
    close() {
      this.$emit("onclose", { update: this.updateList });
      this.form = {};
      this.id = null;
      this.updateList = false;
      this.$refs['form'].resetFields();
    },
  }
};
</script>
