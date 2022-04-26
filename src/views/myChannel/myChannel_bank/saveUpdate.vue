<template>
  <div class="saveUpdate edit-bank">
    <el-dialog
      destroy-on-close
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="showDialog"
      @close="close"
      width="800px"
    >
      <el-form inline :model="form" ref="form" :label-width="isEnglish?'180px':'130px'" size="mini">
        <el-form-item
          :label="$t('message.card_number1')"
          prop="name"
          :rules="[{ required: true, message:$t('message.required',[$t('message.card_number1')])}]"
        >
          <el-input
            :disabled="!!id"
            :placeholder="$t('message.please_input')"
            type="text"
            v-model="form.name"
          />
        </el-form-item>
        <el-form-item
          :label="$t('message.designated_merchant')"
          prop="user_mch_id"
          :rules="[{ required: true, message: $t('message.required',[$t('message.designated_merchant')])}]"
        >
          <el-select
            :disabled="!!id"
            v-model="form.user_mch_id"
            :placeholder="$t('message.please_select')"
            @change="changUserMchId"
          >
            <el-option
              :label="value.name"
              :value="value.id"
              v-for="(value,key) in options"
              :key="key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="幣別"
        >
          <el-input
            disabled
            type="text"
            :value="currentCurrencyType"
          />
        </el-form-item>
        
        <el-form-item
          :label="$t('message.bank_card_number')"
          prop="card_number"
          :rules="[{ required: true, message:$t('message.required',[$t('message.bank_card_number')])},{validator: validate_bank, trigger: 'blur'}]"
        >
          <el-input
            :disabled="!!id"
            :placeholder="$t('message.please_input')"
            type="text"
            v-model.trim="form.card_number"
          />
        </el-form-item>
        <el-form-item
          :label="$t('message.account_holder')"
          prop="card_user"
          :rules="[{ required: true, message:$t('message.required',[$t('message.account_holder')])}]"
        >
          <el-input
            :disabled="!!id"
            :placeholder="$t('message.please_input')"
            type="text"
            v-model.trim="form.card_user"
          />
        </el-form-item>
        <el-form-item
          :label="$t('message.bank_name')"
          prop="bank_name"
          :rules="[{ required: true, message:$t('message.required',[$t('message.bank_name')])}]"
        >
          <el-select
            :disabled="!!id || currentCurrencyType === null"
            v-model="form.bank_name"
            :placeholder="currentCurrencyType ? $t('message.please_select') : $t('message.plase_designated_merchant')"
          >
            <el-option
              :label="item.name"
              :value="item.code"
              v-for="(item,key) in $store.state.ua.bankCodeType[currentCurrencyType]"
              :key="key"
            ></el-option>
          </el-select>

        </el-form-item>
        <el-form-item
          :label="$t('message.expire_date')"
          prop="stale_dated_at"
          :rules="[{ required: true, message:$t('message.required',[$t('message.expire_date')])}]"
        >
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="form.stale_dated_at"
            type="datetime"
            placeholder="选择日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>

        <el-form-item
          :label="$t('message.daily_limit')"
          prop="daily_limit"
          :rules="[{ required: true, message: '每日限额不能为空'},{validator: validate_amount, trigger: 'blur'}]"
        >
          <el-input
            :placeholder="$t('message.please_input')"
            type="text"
            v-model.number="form.daily_limit"
          />
        </el-form-item>
        <el-form-item
          :label="$t('message.cumulative_limit')"
          prop="total_limit"
          :rules="[{ required: true, message: '累计限额不能为空'},{validator: validate_amount, trigger: 'blur'}]"
        >
          <el-input
            :placeholder="$t('message.please_input')"
            type="text"
            v-model.number="form.total_limit"
          />
        </el-form-item>
        <el-form-item :label="$t('message.current_status')">
          <el-switch v-model="form.enable" @change="switchChange"></el-switch>
        </el-form-item>
        <el-form-item :label="$t('message.remark')" prop="remark">
          <el-input
            type="textarea"
            :rows="2"
            :placeholder="$t('message.please_input')"
            v-model="form.remark"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false;" size="small">{{$t('message.cancel')}}</el-button>
        <el-button type="primary" @click="submit" size="small">{{$t('message.ok')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mchApi } from "@/api/mch";
import { bankApi } from "@/api/myChannel";
import { isInteger } from "@/utils/validate";
import {getIsVietnam} from '@/utils/config'
export default {
  data() {
    // 金额验证
    const validate_amount = (rule, value, callback) => {
      if (typeof value !== "number" || !isInteger(value)) {
        callback(
          new Error(
            this.isEnglish ? "Please enter an integer" : "请正确输入的整数金额"
          )
        );
      } else {
        callback();
      }
    };

    // 银行卡纯数字验证
    const validate_bank = (rule, value, callback) => {
      if (!/^[0-9]+$/.test(value)) {
        callback(
          new Error(
            this.isEnglish
              ? "Bank card number can only be numbers"
              : "银行卡号只能是数字"
          )
        );
      } else {
        callback();
      }
    };

    return {
      // 验证
      validate_amount,
      validate_bank,

      id: null,
      showDialog: false,
      updateList: false, // 关闭弹窗时是否更新列表
      isVietnam: getIsVietnam(),
      options: null,
      currentCurrencyType: null,
      form: {
        name: "",
        mch_level: "1",
        user_level: "1",
        card_number: "",
        card_user: "",
        bank_name: "",
        stale_dated_at: "",
        daily_limit: 1000000,
        total_limit: 1000000,
        remark: "",
        enable: true
      },

      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now(); //只能选择今天之后的时间
        }
      }
    };
  },
  computed: {
    isEnglish() {
      return this.$store.state.ua.isEnglish;
    },
    title() {
      if (this.id) {
        return this.isEnglish ? "Edit bank card" : "编辑银行卡";
      } else {
        return this.isEnglish ? "Add bank card" : "新增银行卡";
      }
    }
  },
  created() {
    this.testMerchant();
  },
  methods: {
    testMerchant() {
      mchApi.get({ page_size: 1000, page_no: 1 }).then(res => {
        if (res.status === 0) {
          this.options = res.data.items.map(item => ({
            id: item.id,
            name: item.name,
            currency_type: item.currency_type,
          }));
        }
      });
    },
    // 小时补全
    timeFormat(h) {
      h = Number(h);
      return `${h < 10 ? "0" + h : h}:00`;
    },
    // 编辑回显数据
    getDetail(id) {
      bankApi.getById(id).then(res => {
        if (res.status === 0) {
          let { mch_level, user_level, daily_limit, total_limit } = res.data;

          mch_level = String(mch_level);
          user_level = String(user_level);
          daily_limit = Number(daily_limit) / 100;
          total_limit = Number(total_limit) / 100;

          this.form = {
            ...res.data,
            mch_level,
            user_level,
            daily_limit,
            total_limit
          };
        }
      });
    },
    switchChange(val) {
      this.$confirm(
        this.isEnglish
          ? `Are you sure you want to ${
              val ? this.$t("message.enable") : this.$t("message.disable")
            } bank card?`
          : `确定${val ? "启用" : "禁用"}银行卡【${this.form.card_number}】吗`,
        this.$t("message.hint"),
        {
          confirmButtonText: this.$t("message.ok"),
          cancelButtonText: this.$t("message.cancel"),
          type: "warning"
        }
      )
        .then(() => {})
        .catch(() => {
          this.form.enable = !val;
        });
    },
    changUserMchId(val) {
      let mchList = this.options;
      let currentMch = mchList.find(item => item.id === val);
      if(currentMch) {
        this.currentCurrencyType = currentMch.currency_type;
      }
    },
    // 打开弹窗，外部调用，有id时是编辑
    open(id, currency_type) {

      if(currency_type) {
        this.currentCurrencyType = currency_type;
      }

      if (id) {
        this.id = id;
        this.getDetail(id);
      }
      this.showDialog = true;
    },
    close() {
      this.$emit("onclose", { update: this.updateList });
      this.reload();
    },
    reload() {
      this.id = null;
      this.showDialog = false;
      this.updateList = false;
      this.currentCurrencyType = null;
      this.form = {
        name: "",
        mch_level: "1",
        user_level: "1",
        card_number: "",
        card_user: "",
        bank_name: "",
        stale_dated_at: "",
        daily_limit: 1000000,
        total_limit: 1000000,
        remark: "",
        enable: true
      };
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 新增
          if (!this.id) {
            bankApi.post(this.getParams()).then(res => {
              if (res.status === 0) {
                this.$message({
                  type: "success",
                  message: this.isEnglish
                    ? `Bank card【${this.form.card_number}】 created successfully`
                    : `银行卡【${this.form.card_number}】创建成功`
                });
                this.showDialog = false;
                this.updateList = true;
              }
            });
          } else {
            this.$vcode().then(() => {
              bankApi.put({ id: this.id, data: this.getParams() }).then(res => {
                if (res.status === 0) {
                  this.$message({
                    type: "success",
                    message: this.isEnglish
                      ? `Bank card【${this.form.card_number}】 edited successfully`
                      : `银行卡【${this.form.card_number}】编辑成功`,
                    duration: 10000
                  });
                  this.showDialog = false;
                  this.updateList = true;
                }
              });
            });
          }
        } else {
          return false;
        }
      });
    },
    // 获得上传参数
    getParams() {
      let { mch_level, user_level, daily_limit, total_limit } = this.form;

      mch_level = Number(mch_level);
      user_level = Number(user_level);
      daily_limit = Number(daily_limit) * 100;
      total_limit = Number(total_limit) * 100;

      return {
        ...this.form,
        mch_level,
        user_level,
        daily_limit,
        total_limit
      };
    }
  }
};
</script>

<style>
.edit-bank .el-form .el-date-editor.el-input {
  width: 185px;
}
</style>


