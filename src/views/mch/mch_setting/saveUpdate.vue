<template>
  <div class="saveUpdate">
    <el-dialog destroy-on-close :close-on-click-modal="false" :title="id?'编辑商户':'新增商户'" :visible.sync="showDialog"
      @close="close" width="800px">
      <el-form inline :model="form" ref="form" label-width="130px" size="mini">
        <el-form-item label="商户名称" prop="name" :rules="[{ required: true, message: '商户名称不能为空'}]">
          <el-input :disabled="!!id" placeholder="请输入" type="text" v-model="form.name" />
        </el-form-item>
        <el-form-item label="币别" prop="currency_type" :rules="[{ required: true, message: '币别类型不能为空'}]">
          <el-select v-model="form.currency_type" placeholder="请选择" @change="changeCurrencyType" :disabled="!!id">
            <el-option :label="value" :value="value"
              v-for="(value, key) in (isVietnam ? $store.state.ua.vnCurrencyType : $store.state.ua.currencyType)"
              :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商户类型" prop="mch_type_ids" :rules="[{ required: true, message: '商户类型不能为空'}]">
          <el-select multiple v-model="form.mch_type_ids" placeholder="请选择" :disabled="hasCurrencyTpye">
            <el-option :label="value.name" :value="value.id" v-for="(value, key) in mch_type_list" :key="key">
            </el-option>
          </el-select>
        </el-form-item>
        <div>
          <el-form-item label="下分类型" prop="mch_withdraw_types" :rules="[{ required: true, message: '下分类型不能为空'}]">
            <el-select v-if="isVietnam" multiple v-model="form.mch_withdraw_types" placeholder="请选择">
              <el-option :label="value" :value="key" v-for="(value,key) in $store.state.ua.vnWithdrawType" :key="key">
              </el-option>
            </el-select>

            <el-select v-else multiple v-model="form.mch_withdraw_types" placeholder="请选择">
              <el-option :label="value" :value="key" v-for="(value,key) in $store.state.ua.withdrawType" :key="key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商户代码" prop="merchant_code">
            <el-input :disabled="!!id" type="text" v-model="form.merchant_code" />
          </el-form-item>
        </div>

        <div v-if="isShowBank" class="content-block">
          <el-form-item label="银行卡费率" prop="bank_rate" placeholder="请输入0-100区间的整数"
            :rules="[{ required: true, message: '银行卡费率不能为空'},{validator: validate_bank_rate, trigger: 'blur'}]">
            <el-input type="text" v-model="form.bank_rate">
              <i slot="suffix">%</i>
            </el-input>
          </el-form-item>
          <el-form-item label="银行卡金额" prop="bank_amount" :rules="[{ validator: validate_bank, trigger: 'blur' }]">
            <el-input style="width:100px" type="text" v-model="form.bank_min_amount" />-
            <el-input style="width:100px" type="text" v-model="form.bank_max_amount" />
          </el-form-item>
        </div>
        <div v-if="isShowAlipay" class="content-block">
          <el-form-item label="支付宝费率" placeholder="请输入0-100区间的整数" prop="alipay_rate"
            :rules="[{ required: true, message: '支付宝费率不能为空'},{validator: validate_alipay_rate, trigger: 'blur'}]">
            <el-input type="text" v-model="form.alipay_rate">
              <i slot="suffix">%</i>
            </el-input>
          </el-form-item>
          <el-form-item label="支付宝金额" prop="alipay_amount" :rules="[{ validator: validate_alipay, trigger: 'blur' }]">
            <el-input style="width:100px" type="number" v-model="form.alipay_min_amount" />-
            <el-input style="width:100px" type="number" v-model="form.alipay_max_amount" />
          </el-form-item>
        </div>

        <div v-if="isShowMoMo" class="content-block">
          <el-form-item label="MoMo费率" placeholder="请输入0-100区间的整数" prop="alipay_rate"
            :rules="[{ required: true, message: '支付宝费率不能为空'},{validator: validate_alipay_rate, trigger: 'blur'}]">
            <el-input type="text" v-model="form.alipay_rate">
              <i slot="suffix">%</i>
            </el-input>
          </el-form-item>
          <el-form-item label="MoMo金额" prop="alipay_amount" :rules="[{ validator: validate_alipay, trigger: 'blur' }]">
            <el-input style="width:100px" type="number" v-model="form.alipay_min_amount" />-
            <el-input style="width:100px" type="number" v-model="form.alipay_max_amount" />
          </el-form-item>
        </div>

        <el-form-item label="订单回调地址" prop="callback_url" :rules="[{ required: true, message: '订单地址不能为空'}]">
          <el-input type="textarea" :rows="2" placeholder="请输入" v-model="form.callback_url" />
        </el-form-item>

        <el-form-item label="下单IP" prop="order_white_ips">
          <el-input type="textarea" :rows="2" placeholder="多个ip以,分隔" v-model="form.order_white_ips" />
        </el-form-item>

        <el-form-item label="商户后台账号" prop="console_user_name" :rules="[{ required: true, message: '商户后台账号不能为空'}]">
          <el-input :disabled="!!id" type="text" placeholder="请输入" v-model="form.console_user_name" />
        </el-form-item>

        <el-form-item label="登陆IP" prop="white_ips">
          <el-input type="textarea" :rows="2" placeholder="多个ip以,分隔" v-model="form.white_ips" />
        </el-form-item>

        <el-form-item label="当前状态">
          <el-switch v-model="form.enable" @change="switchChange"></el-switch>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="2" placeholder="请输入" v-model="form.remark" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false;" size="small">取 消</el-button>
        <el-button type="primary" @click="submit" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    mchApi
  } from "@/api/mch";
  import {
    getIsVietnam
  } from '@/utils/config'
  export default {
    components: {},
    data() {
      // 银行卡金额验证
      const validate_bank = (rule, value, callback) => {
        const min_amount = this.form.bank_min_amount;
        const max_amount = this.form.bank_max_amount;
        if (!min_amount || !max_amount) {
          callback(new Error("请输入银行卡下限和上限金额"));
        } else {
          callback();
        }
      };

      // 支付宝金额验证
      const validate_alipay = (rule, value, callback) => {
        const min_amount = this.form.alipay_min_amount;
        const max_amount = this.form.alipay_max_amount;
        if (!min_amount || !max_amount) {
          callback(new Error("请输入支付宝下限和上限金额"));
        } else {
          callback();
        }
      };

      // 支付宝费率验证
      const validate_alipay_rate = (rule, value, callback) => {
        if (
          // typeof value !== "number" ||
          value < 0 ||
          value > 100
        ) {
          callback(new Error("请输入0-100区间的数"));
        } else {
          callback();
        }
      };

      // 银行卡费率验证
      const validate_bank_rate = (rule, value, callback) => {
        if (
          // typeof value !== "number" ||
          value < 0 ||
          value > 100
        ) {
          callback(new Error("请输入0-100区间的数"));
        } else {
          callback();
        }
      };

      return {
        // 验证
        validate_bank,
        validate_alipay,
        validate_alipay_rate,
        validate_bank_rate,

        id: null,
        showDialog: false,
        updateList: false, // 关闭弹窗时是否更新列表
        isVietnam: getIsVietnam(),
        mch_type_list: [],
        hasCurrencyTpye: true,
        q: {
          currency_type: null
        },
        form: {
          name: "",
          mch_type_ids: [],
          merchant_code: "",
          callback_url: "",
          console_user_name: "",
          alipay_enabel: true,
          bank_enabel: true,
          mch_withdraw_types: [],
          remark: "",
          white_ips: "",
          order_white_ips: "",
          enable: true,
          currency_type: "",
          form: {
            name: "",
            mch_type_ids: [],
            merchant_code: "",
            callback_url: "",
            console_user_name: "",
            currency_type: "",
            alipay_enabel: true,
            bank_enabel: true,
            mch_withdraw_types: [],
            remark: "",
            white_ips: "",
            order_white_ips: "",
            enable: true,
            bank_rate: 0,
            alipay_rate: 0,
            alipay_min_amount: 1,
            alipay_max_amount: 50000,
            bank_min_amount: 1,
            bank_max_amount: 50000
          },
          bank_rate: 0,
          alipay_rate: 0,
          alipay_min_amount: 1,
          alipay_max_amount: 50000,
          bank_min_amount: 1,
          bank_max_amount: 50000
        }
      };
    },
    computed: {
      // 是否展示银行卡部分
      isShowBank() {
        if (!this.form.mch_withdraw_types) return false;
        return this.form.mch_withdraw_types.includes(
          this.$store.state.ua.withdrawType_byString["银行卡"]
        );
      },
      // 是否展示支付宝部分
      isShowAlipay() {
        if (!this.form.mch_withdraw_types) return false;
        return this.form.mch_withdraw_types.includes(
          this.$store.state.ua.withdrawType_byString["支付宝"]
        );
      },
      isShowMoMo() {
        if (!this.form.mch_withdraw_types) return false;
        return this.form.mch_withdraw_types.includes(
          this.$store.state.ua.withdrawType_byString["越南MoMo"]
        );
      }
    },
    methods: {
      //選擇幣別後獲取商戶類型
      changeCurrencyType(val) {
        this.mch_type_list = [];
        this.form.mch_type_ids = [];
        this.q.currency_type = val;
        mchApi.mchTypeGet(this.q).then(res => {
          if (res.status === 0) {
            if (res.status === 0) {
              console.log(res.data);
              this.mch_type_list = res.data;
            }
          }
          this.hasCurrencyTpye = false;
        });
      },
      // 编辑回显数据
      getDetail(id) {
        mchApi.getById(id).then(res => {
          if (res.status === 0) {
            let {
              callback_url,
              merchant_code,
              console_user_name,
              enable,
              mch_types,
              name,
              remark,
              white_ips,
              order_white_ips,
              withdraw_types,
              currency_type,
            } = res.data;

            this.changeCurrencyType(currency_type);
            const mch_withdraw_types = [];

            const obj = {
              bank_rate: 0,
              alipay_rate: 0,
              alipay_min_amount: 100,
              alipay_max_amount: 50000,
              bank_min_amount: 100,
              bank_max_amount: 50000
            };

            // 下分类型处理
            if (withdraw_types && withdraw_types instanceof Array) {
              for (let item of withdraw_types) {
                if (
                  item.withdraw_type ==
                  this.$store.state.ua.withdrawType_byString["银行卡"]
                ) {
                  obj.bank_rate = item.rate * 100;
                  obj.bank_min_amount = Number(item.min_amount) / 100;
                  obj.bank_max_amount = Number(item.max_amount) / 100;
                }
                if (
                  item.withdraw_type ==
                  this.$store.state.ua.withdrawType_byString["支付宝"]
                ) {
                  obj.alipay_rate = item.rate * 100;
                  obj.alipay_min_amount = Number(item.min_amount) / 100;
                  obj.alipay_max_amount = Number(item.max_amount) / 100;
                }

                if (
                  item.withdraw_type ==
                  this.$store.state.ua.withdrawType_byString["越南MoMo"]
                ) {
                  obj.alipay_rate = item.rate * 100;
                  obj.alipay_min_amount = Number(item.min_amount) / 100;
                  obj.alipay_max_amount = Number(item.max_amount) / 100;
                }


                // 服务端返回的下分类型，存在且enable有效才让其显示。
                if (item.enable) {
                  mch_withdraw_types.push(item.withdraw_type);
                }
              }
            }

            // 白名单处理
            if (white_ips && white_ips instanceof Array) {
              white_ips = white_ips.join(",");
            } else {
              white_ips = "";
            }

            // 下单ip白名单处理
            if (order_white_ips && order_white_ips instanceof Array) {
              order_white_ips = order_white_ips.join(",");
            } else {
              order_white_ips = "";
            }

            // 商户类型回显
            const mch_type_ids = mch_types ? mch_types.map(item => item.id) : [];

            this.form = {
              callback_url,
              merchant_code,
              console_user_name,
              enable,
              mch_type_ids,
              name,
              remark,
              white_ips,
              order_white_ips,
              mch_withdraw_types,
              currency_type,
              ...obj
            };
          }
        });
      },
      switchChange(val) {
        this.$confirm(
            `确定${val ? "启用" : "禁用"}商户【${this.form.name}】吗`,
            "提示", {
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
      open(id) {
        if (id) {
          this.id = id;
          this.getDetail(id);
        }
        this.showDialog = true;
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
        this.hasCurrencyTpye = true;
        this.form = {
          name: "",
          mch_type_ids: [],
          callback_url: "",
          console_user_name: "",
          alipay_enabel: true,
          bank_enabel: true,
          mch_withdraw_types: [],
          remark: "",
          white_ips: "",
          order_white_ips: "",
          enable: true,
          currency_type: null,
          bank_rate: 0,
          alipay_rate: 0,
          alipay_min_amount: 100,
          alipay_max_amount: 50000,
          bank_min_amount: 100,
          bank_max_amount: 50000
        };
      },
      submit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            // 新增
            if (!this.id) {
              this.$vcode().then(() => {
                mchApi.post(this.getParams()).then(res => {
                  if (res.status === 0) {
                    this.$message({
                      type: "success",
                      message: `商户【${this.form.name}】创建成功，后台账号为：${this.form.console_user_name}，后台密码为：${res.data.console_password}`,
                      duration: 10000
                    });
                    this.showDialog = false;
                    this.updateList = true;
                    this.hasCurrencyTpye = true;
                  }
                });
              });
            } else {
              this.$vcode().then(() => {
                mchApi.put({
                  id: this.id,
                  data: this.getParams()
                }).then(res => {
                  if (res.status === 0) {
                    this.$message({
                      type: "success",
                      message: `商户【${this.form.name}】编辑成功`
                    });
                    this.showDialog = false;
                    this.updateList = true;
                    this.hasCurrencyTpye = true;
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
          mch_type_ids,
          merchant_code,
          callback_url,
          console_user_name,
          remark,
          white_ips,
          order_white_ips,
          currency_type,
          enable
        } = this.form;

        white_ips = white_ips.split(",");
        order_white_ips = order_white_ips.split(",");
        const mch_withdraw_types = [];

        // 两种下分类型不管有没有选中都要传，没有被选中的enable就取false即可

        // 下分类型银行卡
        const bank_method = {
          withdraw_type: this.$store.state.ua.withdrawType_byString["银行卡"],
          min_amount: Number(this.form.bank_min_amount) * 100,
          max_amount: Number(this.form.bank_max_amount) * 100,
          rate: Number(this.form.bank_rate) / 100,
          enable: false
        };
        if (this.isShowBank) {
          bank_method.enable = true;
        }
        mch_withdraw_types.push(bank_method);

        // 下分类型支付宝
        const alipay_method = {
          withdraw_type: this.$store.state.ua.withdrawType_byString["支付宝"],
          min_amount: Number(this.form.alipay_min_amount) * 100,
          max_amount: Number(this.form.alipay_max_amount) * 100,
          rate: Number(this.form.alipay_rate) / 100,
          enable: false
        };
        if (this.isShowAlipay) {
          alipay_method.enable = true;
        }
        mch_withdraw_types.push(alipay_method);

        // 下分类型MoMo
        const momo_method = {
          withdraw_type: this.$store.state.ua.withdrawType_byString["越南MoMo"],
          min_amount: Number(this.form.alipay_min_amount) * 100,
          max_amount: Number(this.form.alipay_max_amount) * 100,
          rate: Number(this.form.alipay_rate) / 100,
          enable: false
        };
        if (this.isShowMoMo) {
          momo_method.enable = true;
        }
        mch_withdraw_types.push(momo_method);

        return {
          name,
          mch_type_ids,
          merchant_code,
          callback_url,
          console_user_name,
          currency_type,
          remark,
          white_ips,
          order_white_ips,
          mch_withdraw_types,
          enable
        };
      }
    }
  };

</script>

<style lang="scss" scoped>
  .content-block {
    background: #f3fbf5;
    margin: 5px 0;
    border: 1px dotted #ccc;
    padding-top: 10px;
  }

</style>
