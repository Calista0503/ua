<template>
  <div class="saveUpdate">
    <el-dialog destroy-on-close :close-on-click-modal="false"
      :title="id?(isEnglish?'Edit channel':'编辑提现通道'):(isEnglish?'Add channel':'新增提现通道')" :visible.sync="showDialog"
      @close="close" :width="isEnglish?'900px':'800px'">
      <el-form inline :model="form" ref="form" :label-width="isEnglish?'200px':'130px'" size="mini">
        <el-form-item :label="$t('message.channel_name')" prop="name"
          :rules="[{ required: true, message: $t('message.required',[$t('message.channel_name')])}]">
          <el-input placeholder="请输入" type="text" v-model="form.name" />
        </el-form-item>
        <ChannelMch ref="channelMch" 
          v-model="form.channel_provider_id" 
          :disabled="!!id"
          :title="$t('message.channel_mch_parent')" 
          prop="channel_provider_id"
          :rules="[{ required: true, message: $t('message.required',[$t('message.channel_mch_parent')])}]"
          @changeCallBack="getCurrencyType">
        </ChannelMch>
        <el-form-item :label="$t('message.withdraw_method1')" prop="withdraw_type"
          :rules="[{ required: true, message: $t('message.required',[$t('message.withdraw_method1')])}]">
          <el-select v-if="isVietnam" v-model="form.withdraw_type" :disabled="!!id"
            :placeholder="$t('message.please_select')">
            <el-option :label="value" :value="key" v-for="(value,key) in $store.state.ua.vnWithdrawType" :key="key">
            </el-option>
          </el-select>

          <el-select v-else v-model="form.withdraw_type" :disabled="!!id" :placeholder="$t('message.please_select')">
            <el-option :label="value" :value="key" v-for="(value,key) in $store.state.ua.withdrawType" :key="key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="form.withdraw_type==='bankcard'" :label="$t('message.support_bank')" prop="bank_codes">
          <el-select collapse-tags multiple v-model="form.bank_codes"
            :placeholder="isEnglish?'Default all when not selected':'不选则默认全部'" :disabled="!isGetCurrencyType">
            <el-checkbox style="margin-left: 20px; width:100%; height: 26px" v-model="checkedBanks"
              @change="selectBankAll(checkedBanks)">全选/取消</el-checkbox>
            <el-option :label="item.name" :value="item.code" v-for="(item,key) in bankCodeOption" :key="key"></el-option>
          </el-select>
        </el-form-item>

        <div class="channel-setting-radio">
          <el-radio v-model="form.match_type" label="mch_id" class="radio1" @change="radioChange"
            :disabled="!isGetCurrencyType">
            <el-form-item :label="$t('message.support_merchants')" prop="match_mch_ids">
              <el-select v-model="form.match_mch_ids" :disabled="!(form.match_type === 'mch_id' && isGetCurrencyType)"
                :placeholder="isEnglish?'Default all when not selected':'不选则默认全部'" multiple>
                <el-option :label="item.name" :value="item.id" v-for="(item) in mchList" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-radio>
          <el-radio v-model="form.match_type" label="mch_type" class="radio2" @change="radioChange"
            :disabled="!isGetCurrencyType">
            <el-form-item :label="$t('message.support_merchant_types')" prop="match_mch_types">
              <el-select v-model="form.match_mch_types" :disabled="!(form.match_type === 'mch_type')"
                :placeholder="isEnglish?'Default all when not selected':'不选则默认全部'" multiple>
                <el-option :label="item.name" :value="item.id" v-for="item in mchTypes" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-radio>
        </div>

        <el-form-item :label="$t('message.rate',[$t('message.channel')])" prop="rate" placeholder="请输入0-100区间的数"
          :rules="[{ required: true, message: $t('message.required',[$t('message.rate',[$t('message.channel')])])},{validator: validate_rate, trigger: 'blur'}]">
          <el-input type="text" v-model="form.rate">
            <i slot="suffix">%</i>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('message.upper_limit',[$t('message.daily')])" prop="daily_amount_limit"
          :rules="[{ required: true, message: $t('message.required',[$t('message.upper_limit',[$t('message.daily')])])},{validator: validate_amount, trigger: 'blur'}]">
          <el-input placeholder="请输入" type="text" v-model.number="form.daily_amount_limit" />
        </el-form-item>
        <div>
          <el-form-item :label="$t('message.lower_limit',[$t('message.single_order')])" prop="single_min_amount" :rules="!isVietnam 
            ? [{validator: validate_amount, trigger: 'blur'}] 
            : [{required: true, message: '单笔下限不能为空'}, {validator: validate_amount, trigger: 'blur'}]">
            <el-input placeholder="请输入" type="text" v-model.number="form.single_min_amount" />
          </el-form-item>
          <el-form-item :label="$t('message.upper_limit',[$t('message.single_order')])" prop="single_max_amount" :rules="!isVietnam 
            ? [{validator: validate_amount, trigger: 'blur'}] 
            : [{required: true, message: '单笔上限不能为空'}, {validator: validate_amount, trigger: 'blur'}]">
            <el-input placeholder="请输入" type="text" v-model.number="form.single_max_amount" />
          </el-form-item>
        </div>
        <!-- 越南版不出現定额 -->
        <div v-if="!isVietnam">
          <el-form-item :label="$t('message.quota_amount')" prop="quota_amount"
            :rules="[{ validator: validate_quota_amount, trigger: 'blur' }]">
            <el-input placeholder="多个请用逗号分割" type="text" v-model="form.quota_amount" />
          </el-form-item>
        </div>
        <el-form-item :label="$t('message.opening_time')" prop="start_hour"
          :rules="[{ required: true, message: '开启时间不能为空'}]">
          <el-time-select placeholder="起始时间" v-model="form.start_hour" value-format="H" :picker-options="{
              start: '00:00',
              step: '01:00',
              end: '24:00'
            }"></el-time-select>
        </el-form-item>
        <el-form-item :label="$t('message.closing_time')" prop="end_hour"
          :rules="[{ required: true, message: '关闭时间不能为空'}]">
          <el-time-select placeholder="关闭时间" v-model="form.end_hour" value-format="H" :picker-options="{
              start: '00:00',
              step: '01:00',
              end: '24:00',
              minTime: form.start_hour
            }"></el-time-select>
        </el-form-item>
        <el-form-item :label="$t('message.minute_frequency_limit')" prop="weight">
          <el-input type="text" v-model.number="form.minute_frequency_limit">
            <i slot="suffix">分钟/次</i>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('message.initial_weight')" prop="weight"
          :rules="[{ required: true, message: '通道权重不能为空'}]">
          <el-input type="text" placeholder="请输入0-100区间的整数" v-model.number="form.weight" />
        </el-form-item>
        <el-form-item :label="$t('message.remark')" prop="remark">
          <el-input type="textarea" :rows="2" :placeholder="$t('message.please_input')" v-model="form.remark" />
        </el-form-item>
        <el-form-item :label="$t('message.current_status')">
          <el-switch v-model="form.enable" @change="switchChange"></el-switch>
        </el-form-item>
        <el-form-item :label="$t('message.support_decimal')">
          <el-switch v-model="form.support_decimal"></el-switch>
        </el-form-item>
        <el-form-item :label="$t('message.support_other_banks')">
          <el-switch v-model="form.support_other_banks"></el-switch>
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
  import {
    channelApi,
    channelMchApi
  } from "@/api/channel";
  import ChannelMch from "@/components/Select/ChannelMch";
  import {
    isInteger
  } from "@/utils/validate";
  import {
    mchApi
  } from "@/api/mch";
  import {
    getIsVietnam
  } from '@/utils/config'
  export default {
    components: {
      ChannelMch
    },
    data() {
      // 费率验证
      const validate_rate = (rule, value, callback) => {
        if (value < 0 || value > 100) {
          callback(
            new Error(
              this.isEnglish ?
              "Please enter a number greater than 0 and less than 100" :
              "请输入0-100区间的数字"
            )
          );
        } else {
          callback();
        }
      };

      // 金额验证
      const validate_amount = (rule, value, callback) => {
        // 包網版未输入就不验证
        if (value === "" && !this.isVietnam) {
          callback();
        }

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

      // 定额额度验证
      const validate_quota_amount = (rule, value, callback) => {
        // 未输入就不验证
        if (value === "") {
          callback();
        }

        const num = this.$comma(value).split(",");

        let pass = true;
        for (let item of num) {
          if (Number(item) <= 0) {
            pass = false;
            break;
          }
        }
        if (pass) {
          callback();
        } else {
          callback(new Error("定额额度必须大于0"));
        }
      };

      return {
        // 验证
        validate_rate,
        validate_amount,
        validate_quota_amount,
        currentCurrencyType: null,
        id: null,
        showDialog: false,
        updateList: false, // 关闭弹窗时是否更新列表
        isVietnam: getIsVietnam(),
        mchList: [],
        mchTypes: [],
        checkedBanks: false,
        isGetCurrencyType: false,
        channelType: {
          channel_type: null,
        },
        currencyType: {
          currency_type: null,
        },
        form: {
          name: "",
          channel_type: "",
          channel_provider_id: "",
          withdraw_type: "",
          bank_codes: [],
          callback_url: "",
          rate: 0,
          daily_amount_limit: 1000000,
          single_min_amount: 10,
          single_max_amount: 50000,
          start_hour: "00:00",
          end_hour: "24:00",
          weight: 100,
          remark: "",
          enable: true,
          support_decimal: true,
          support_other_banks: true,
          match_type: "mch_id", // mch_id 指定商户，mch_type 指定商户类型
          match_mch_ids: [],
          match_mch_types: [],
          quota_amount: "",
        }
      };
    },
    computed: {
      isEnglish() {
        return this.$store.state.ua.isEnglish;
      },
      bankCodeOption() {
        let bankCodeList = this.currentCurrencyType ? this.$store.getters.bankCodeTypeByCurrency[this.currentCurrencyType] : [];
        return bankCodeList ;
      },
    },
    methods: {
      getCurrencyType(item) {
        this.currentCurrencyType = null;
        this.mchList = [];
        this.mchTypes = [];
        this.form.bank_codes = [];
        this.form.match_mch_ids = [];
        this.form.match_mch_types = [];
  
        channelMchApi.get({
          channel_type: item.channel_type,
        }).then(res => {
          if (res.status === 0) {
            this.currencyType.currency_type = res.data.items[0].currency_type;
            this.currentCurrencyType = this.currencyType.currency_type;
            this.getMchList(this.currencyType);
            this.getMchType(this.currencyType);
            this.isGetCurrencyType = true;
          }
        });
      },
    // 获取商户列表
    getMchList(val) {
      mchApi
        .get(val)
        .then(res => {
          if (res.status === 0) {
            this.mchList = res.data.items.map(item => ({
              id: item.id,
              name: item.name
            }));
          }
        });
    },
    // 获取商户类型
    getMchType() {
      mchApi
        .mchTypeGet(this.currencyType)
        .then(res => {
          if (res.status === 0) {
            this.mchTypes = res.data.map(item => ({
              id: item.id,
              name: item.name
            }));
          }
        });
    },
      // 銀行全选
      selectBankAll(checked) {
        let arr = []
        let bankList = this.bankCodeOption;
        if (checked) {
          arr = bankList.map(item => Object.values(item)[1])
        }
        this.$set(this.form, 'bank_codes', arr)
      },
      // 支持商户和支持商户类型切换
      radioChange(val) {
        if (val === "mch_id") {
          this.form.match_mch_types = [];
        }
        if (val === "mch_type") {
          this.form.match_mch_ids = [];
        }
      },
      // 小时补全
      timeFormat(h) {
        h = Number(h);
        return `${h < 10 ? "0" + h : h}:00`;
      },
      // 编辑回显数据
      getDetail(id) {
        channelApi.getById(id).then(res => {
          if (res.status === 0) {
            let {
              name,
              channel_type,
              channel_provider_id,
              withdraw_type,
              bank_codes,
              rate,
              daily_amount_limit,
              single_min_amount,
              single_max_amount,
              end_hour,
              start_hour,
              weight,
              remark,
              enable,
              support_decimal,
              support_other_banks,
              match_type,
              match_mch_ids,
              match_mch_types,
              minute_frequency_limit,
              quota_amount,
              currency_type,
            } = res.data;
            this.currencyType.currency_type = currency_type;
            channelMchApi.get().then(res => {
              if (res.status === 0) {
                this.getMchList(this.currencyType);
                this.getMchType(this.currencyType);
              }
            });
            daily_amount_limit = Number(daily_amount_limit) / 100;
            // 非定额檢查
            single_min_amount !== null ?
              single_min_amount = Number(single_min_amount) / 100 :
              single_min_amount = "";
            single_max_amount !== null ?
              single_max_amount = Number(single_max_amount) / 100 :
              single_max_amount = "";

            quota_amount = quota_amount ?
              quota_amount.map(item => item / 100).join(",") :
              "";
            weight = Number(weight);
            rate = rate.mul(100);
            start_hour = this.timeFormat(start_hour);
            end_hour = this.timeFormat(end_hour);

            match_mch_ids = match_mch_ids || [];
            match_mch_types = match_mch_types || [];
            bank_codes = bank_codes || [];
            minute_frequency_limit = minute_frequency_limit ? minute_frequency_limit : null
            this.form = {
              name,
              channel_type,
              channel_provider_id,
              withdraw_type,
              bank_codes,
              rate,
              daily_amount_limit,
              single_min_amount,
              single_max_amount,
              end_hour,
              start_hour,
              weight,
              remark,
              enable,
              support_decimal,
              support_other_banks,
              match_type,
              match_mch_ids,
              match_mch_types,
              minute_frequency_limit,
              quota_amount,
            };
          }
        });
      },
      switchChange(val) {
        this.$confirm(
            this.isEnglish ?
            `Are you sure to ${val ? "enable" : "disable"} the channel【${
              this.form.name
            }】` :
            `确定${val ? "开启" : "禁用"}通道【${this.form.name}】吗`,
            this.$t("message.hint"), {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
          .then(() => {})
          .catch(() => {
            this.form.enable = !val;
          });
      },
      // 打开弹窗，外部调用，有id时是编辑
      open(id, currency_type) {
        if (id) {
          this.isGetCurrencyType = true;
          this.id = id;
          this.getDetail(id);
        }
        this.showDialog = true;
        this.$nextTick(() => {
          this.$refs.channelMch.getOptions();
        });
        if(currency_type) {
        this.currentCurrencyType = currency_type;
        this.getMchList();
        this.getMchType();
      }
      },
      close() {
        this.$emit("onclose", {
          update: this.updateList
        });
        this.reload();
      },
      reload() {
        this.id = null;
        this.showDialog = false;
        this.updateList = false;
        this.isGetCurrencyType = false;
        this.form = {
          name: "",
          channel_provider_id: "",
          withdraw_type: "",
          bank_codes: [],
          callback_url: "",
          rate: 0,
          daily_amount_limit: 1000000,
          single_min_amount: 10,
          single_max_amount: 50000,
          start_hour: "00:00",
          end_hour: "24:00",
          weight: 100,
          remark: "",
          enable: true,
          support_decimal: true,
          support_other_banks: true,
          match_type: "mch_id",
          match_mch_ids: [],
          match_mch_types: [],
          quota_amount: "",
        };
      },
      submit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            // 新增
            if (!this.id) {
              this.$vcode().then(() => {
                channelApi.post(this.getParams()).then(res => {
                  if (res.status === 0) {
                    this.$message({
                      type: "success",
                      message: this.isEnglish ?
                        `channel【${this.form.name}】 created successfully` :
                        `通道【${this.form.name}】创建成功`
                    });
                    this.showDialog = false;
                    this.updateList = true;
                  }
                });
              });
            } else {
              this.$vcode().then(() => {
                channelApi
                  .put({
                    id: this.id,
                    data: this.getParams()
                  })
                  .then(res => {
                    if (res.status === 0) {
                      this.$message({
                        type: "success",
                        message: this.isEnglish ?
                          `channel【${this.form.name}】 edited successfully` :
                          `通道【${this.form.name}】编辑成功`,
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
        let {
          name,
          channel_provider_id,
          withdraw_type,
          bank_codes,
          rate,
          daily_amount_limit,
          single_min_amount,
          single_max_amount,
          end_hour,
          start_hour,
          weight,
          remark,
          enable,
          support_decimal,
          support_other_banks,
          match_mch_ids,
          match_mch_types,
          match_type,
          minute_frequency_limit,
          quota_amount
        } = this.form;

        channel_provider_id = Number(channel_provider_id);
        daily_amount_limit = Number(daily_amount_limit) * 100;
        weight = Number(weight);

        rate = Number(rate) / 100;
        start_hour = parseInt(start_hour.split(":")[0]);
        end_hour = parseInt(end_hour.split(":")[0]);

        if (match_mch_ids.length === 0) match_mch_ids = null;
        if (match_mch_types.length === 0) match_mch_types = null;
        if (bank_codes.length === 0) bank_codes = null
        minute_frequency_limit = minute_frequency_limit ? minute_frequency_limit : null

        // 包網且有輸入定額數值才回傳quota_amount
        if (quota_amount !== "" && !this.isVietnam) {
          quota_amount = this.$comma(quota_amount)
            .split(",")
            .map(item => Number(item) * 100);

        } else {
          quota_amount = null;
        }

        // 非定额檢查
        single_min_amount !== "" ?
          single_min_amount = Number(single_min_amount) * 100 :
          single_min_amount = null;
        single_max_amount !== "" ?
          single_max_amount = Number(single_max_amount) * 100 :
          single_max_amount = null;

        return {
          name,
          channel_provider_id,
          withdraw_type,
          bank_codes,
          rate,
          daily_amount_limit,
          single_min_amount,
          single_max_amount,
          end_hour,
          start_hour,
          weight,
          remark,
          enable,
          support_decimal,
          support_other_banks,
          match_mch_ids,
          match_mch_types,
          match_type,
          minute_frequency_limit,
          quota_amount
        };
      }
    }
  };

</script>

<style lang="scss">
  .channel-setting-radio {
    .radio1 {
      .el-radio__input {
        left: 40px;
      }
    }

    .radio2 {
      .el-radio__input {
        left: 10px;
      }
    }

    .el-radio__input {
      position: absolute;
      top: 7px;
    }

    .el-radio__label {
      padding-left: 0px;
    }

    .el-form-item__label {
      font-weight: normal;
    }
  }

</style>
