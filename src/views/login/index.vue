<template>
  <div class="login-container">
    <div class="layer bg" id="login"></div>
    <div class="layer flex-center">
      <div class="form-group">
        <el-card>
          <h3 class="title">{{PROJECTNAME}}</h3>
          <el-form
            v-show="showLogin"
            autocomplete="on"
            :model="loginForm"
            :rules="loginRules"
            ref="loginForm"
            label-position="left"
            label-width="0px"
            size="mini"
            class="card-box login-form"
          >
            <el-form-item prop="name" :rules="[{ required: true, message: '必填'}]">
              <el-input
                name="name"
                v-model.trim="loginForm.name"
                autocomplete="on"
                placeholder="请输入账户"
              >
                <template slot="prepend">
                  <i class="icon iconfont icon-mine_fill"></i>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password" :rules="[{ required: true, message: '必填'}]">
              <el-input
                name="password"
                :type="pwdType"
                @keyup.enter.native="handleLogin"
                v-model.trim="loginForm.password"
                autocomplete="on"
                placeholder="请输入密码"
              >
                <template slot="prepend">
                  <i class="icon iconfont icon-lock_fill"></i>
                </template>
                <template slot="suffix">
                  <span
                    :class="['show-pwd icon iconfont', close?'icon-browse':'icon-Close']"
                    @click="showPwd"
                  ></span>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="vcode" :rules="[{ required: true, message: '必填'}]">
              <el-input
                name="vcode"
                v-model.trim="loginForm.vcode"
                autocomplete="on"
                placeholder="请输入安全码"
              >
                <template slot="prepend">
                  <i class="icon iconfont icon-mine_fill"></i>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="success"
                class="loginbtn"
                style="width:100%;"
                :loading="loading"
                @click.native="handleLogin"
              >登&nbsp;&nbsp;&nbsp;录</el-button>
            </el-form-item>
          </el-form>
          <el-form
            v-show="showReg"
            autocomplete="on"
            :model="RegForm"
            :rules="RegRules"
            ref="RegForm"
            label-position="left"
            label-width="0px"
            size="mini"
            class="card-box login-form"
          >
            <el-form-item prop="name">
              <el-input name="name" v-model="RegForm.name" autocomplete="on" placeholder="请输入用户名">
                <template slot="prepend">
                  <i class="icon iconfont icon-mine"></i>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item
              prop="password"
              :rules="[{min: 6, max: 12, message: '由大小写字母和数字组成，长度至少6位'}]"
            >
              <el-input
                name="password"
                :type="pwdType"
                @keyup.enter.native="handleLogin"
                v-model="RegForm.password"
                autocomplete="on"
                placeholder="由大小写字母和数字组成，长度至少6位"
              >
                <template slot="prepend">
                  <i class="icon iconfont icon-lock"></i>
                </template>
                <template slot="suffix">
                  <span class="show-pwd icon iconfont icon-browse_fill" @click="showPwd"></span>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="repassword">
              <el-input
                name="password"
                :type="pwdType"
                @keyup.enter.native="handleLogin"
                v-model="RegForm.repassword"
                autocomplete="on"
                placeholder="重新键入密码"
              >
                <template slot="prepend">
                  <i class="icon iconfont icon-lock"></i>
                </template>
                <template slot="suffix">
                  <span class="show-pwd icon iconfont icon-browse_fill" @click="showPwd"></span>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                style="width: 100%"
                class="loginbtn"
                :loading="loading"
                @click.native="handleReg"
              >注 册</el-button>
            </el-form-item>
            <div class="tips">
              <el-button type="success" style="float: right;" @click.native="toLogin">登录</el-button>
            </div>
          </el-form>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
// require('particles.js')
// import config from './config/default'
import { isvalidUsername } from "@/utils/validate";
import { setVcode } from "../../utils/auth";
import { PROJECTNAME } from "@/utils/config";

export default {
  name: "login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error("*请输入用户名"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value) {
        if (value.length < 5) {
          callback(new Error("*密码不能小于5位"));
        } else {
          callback();
        }
      }
    };
    const validaterePass = (rule, value, callback) => {
      if (value === this.RegForm.password) {
        callback();
      } else {
        callback(new Error("*两次密码不一致"));
      }
    };
    const validateNickname = (rule, value, callback) => {
      if (value) {
        if (value.length <= 0) {
          callback(new Error("*请输入正确的昵称"));
        } else {
          callback();
        }
      }
    };
    const validateVcode = (rule, value, callback) => {
      if (value) {
        if (value.length <= 0) {
          callback(new Error("*请输入安全码"));
        } else {
          callback();
        }
      }
    };
    return {
      PROJECTNAME: PROJECTNAME,
      loginForm: {
        name: "",
        password: ""
      },
      close: false,
      RegForm: {},
      loginRules: {
        name: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePass }
        ],
        vcode: [{ required: true, trigger: "blur", validator: validateVcode }]
      },
      RegRules: {
        // nickname: [{ required: true, trigger: 'blur', validator: validateNickname }],
        name: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePass }
        ],
        repassword: [
          { required: true, trigger: "blur", validator: validaterePass }
        ]
      },
      loading: false,
      pwdType: "password",
      showLogin: true,
      showReg: false
    };
  },
  methods: {
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
      this.close = !this.close;
    },
    toReg() {
      this.showLogin = false;
      this.showReg = true;
      this.RegForm = {};
    },
    toLogin() {
      this.showLogin = true;
      this.showReg = false;
      this.loginForm = {};
    },
    handleLogin() {
      // this.$router.push({ path: '/' })
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          setVcode(this.loginForm.vcode);
          this.loading = true;
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.loading = false;
              this.$router.push({ path: "/" });
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    handleReg() {
      this.$refs.RegForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("Register", this.RegForm)
            .then(res => {
              if (res.status === 0) {
                this.loading = false;
                this.$alert("注册成功", "注册成功", {
                  confirmButtonText: "确定",
                  callback: () => {
                    this.toLogin();
                  }
                });
              }
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #f1f1f1;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background: $bg;
  background: url('../../assets/bg.jpg') no-repeat;
  background-size: cover;
  .el-input-group__prepend {
    padding: 0 0;
  }
  .layer {
    position: absolute;
    height: 100%;
    width: 100%;
  }
  .form-group {
    margin: 190px auto 0 auto;
    width: 300px;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 24px;
    font-weight: 400;
    text-align: center;
    font-weight: bold;
    color: #fff;
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .iconfont {
    font-size: 23px;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
</style>
