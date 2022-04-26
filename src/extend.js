import Vue from 'vue';
import {
  setVcode
} from '@/utils/auth';
import {
  exportExel,
  exportExel_blob
} from '@/api/excel'

const isEnglish = localStorage.getItem('ua-admin-lang') === 'en';

// 安全码输入
const vcode = function () {
  return new Promise((resolve) => {
    this.$prompt(isEnglish ? `Please enter the security code` : `请输入安全码`, isEnglish ? 'safety verification' : '安全码验证', {
      confirmButtonText: this.$t('message.ok'),
      cancelButtonText: this.$t('message.cancel'),
      inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
      inputErrorMessage: isEnglish ? 'Security code is required' : '安全码不能为空',
    }).then(({
      value
    }) => {
      setVcode(value);
      let timeid = setTimeout(() => {
        timeid = null;
        resolve()
      }, 0)
    }).catch(() => {
      this.$message({
        type: 'info',
        message: this.$t('message.cancelled')
      })
    })
  })
}

/**
 * @description q参数过滤
 * @param {Obejct} 查询的q参数
 * @param {Boolean} 是否处理数组为字符串，默认处理
 * @return {Object} 处理后的参数
 */
const qfilter = function (q, isArrayToString = true) {
  const obj = {};
  for (let key in q) {
    // 数组转成字符串
    if (q[key] instanceof Array && isArrayToString) {
      const str = [...q[key]].join(',');
      if(str !== '')  obj[key] = str;
      continue;
    }
    // 过滤掉空字符串
    if (q[key] !== '') {
      obj[key] = q[key];
    }
  }
  return obj;
}


function queryFilter(queryObj){
  let keysP = Object.keys(queryObj)
  keysP.map(key => {
    if(typeof queryObj[key]==="string"){
      queryObj[key]=queryObj[key].trim()
    }
    if(queryObj[key] === ''||queryObj[key]===null){
      delete queryObj[key]
    }
  })
  return queryObj
}


/**
 * @description 报表导出
 * @param {Object}
 *  @prop http required {function} 数据请求 @return {Promise}
 *  @prop error {function} 错误回调
 *  @prop success {function} 成功回调
 *  @prop complete {function} 最终回调
 * @return Null
 */
const exportReport = function ({
  http,
  query,
  error = function () {},
  success = function () {},
  complete = function () {},
}) {
  if (error && (typeof error != 'function')) throw new Error('参数错误，error类型为function');
  if (success && (typeof success != 'function')) throw new Error('参数错误，success类型为function');
  if (complete && (typeof complete != 'function')) throw new Error('参数错误，complete类型为function');
  let v = this;

  if (http && (typeof http === 'function')) {
    http({
      ...v.$qfilter(query),
      export: 1
    }).then(res => {
      if (res.status === 0) {
        exportExelFn(res.data.task_id);
      }
    }).catch(() => {
      complete();
      error();
    })
  } else {
    error();
    complete();
    throw new Error('参数错误，request必传且类型为function');
  }

  function exportExelFn(taskId) {
    exportExel(taskId).then(async exportStatusRes => {
      if (exportStatusRes.status === 0) {
        switch (exportStatusRes.data.status) {
          case 0:
            setTimeout(() => {
              exportExelFn(taskId)
            }, 1500)
            break
          case 2:
            error();
            complete();
            v.$message.info(isEnglish ? 'Export failed' : '导出失败')
            break;
          case 3:
            complete();
            v.$message.info(isEnglish ? 'Export canceled' : '取消导出')
            break;
        }
      } else {
        const ret = await exportExel_blob(taskId);
        const blob = new Blob([ret], {
          'type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        let href = '';
        if (window.URL) href = window.URL.createObjectURL(blob);
        else href = window.webkitURL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = href;
        a.download = '';
        a.click();
        if (window.URL) window.URL.revokeObjectURL(href);
        success();
        complete();
        v.$message.success(isEnglish ? 'Export succeeded' : '导出成功');

        v.$nextTick(() => {
          // 处理内存泄露
          taskId = null;
          a = null;
          http = null;
          exportExelFn = null;
          error = null;
          success = null;
          complete = null;
          v = null;
        })
      }
    }, err => {
      // 准备导出流的时候报错
      error();
      complete();
      v.$nextTick(() => {
        // 处理内存泄露
        taskId = null;
        http = null;
        exportExelFn = null;
        error = null;
        success = null;
        complete = null;
        v = null;
      })
    })
  }
}

// 时间过滤，单个字段过滤成两个字段,data:筛选数据，要替换的range字段，目标start字段和目标end字段
function dateFilter({
                      data,
                      range,
                      start,
                      end
                    }) {
  const q = {
    ...data
  }
  if (q.hasOwnProperty(range) && q[range]) {
    q[start] = q[range][0] || '';
    q[end] = q[range][1] || '';
    delete q[range];
  }
  return q
}

/**
 清除浮点数运算*/

const accMul = (arg1, arg2) => {
  let m = 0,
    s1 = '',
    s2 = '';
  if (arg1 && arg1 != null)
    s1 = arg1.toString();

  if (arg2 && arg2 != null)
    s2 = arg2.toString();

  try {
    m += s1.split('.')[1].length
  } catch (e) {}
  try {
    m += s2.split('.')[1].length
  } catch (e) {}

  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
}

/**
 * 给Number类型增加一个mul方法，调用起来更加方便*/
Number.prototype.mul = function (arg) {
  return accMul(arg, this);
}


/**
 * 下载文件**/
const downloadFile = function(href) {
  if (href && (typeof href === 'string')) {
    let a = document.createElement('a');
    a.download = '';
    a.href = href;
    a.click();
    a = null;
  } else {
    this.$message({
      type: 'danger',
      message: '下载地址required',
    });
  }
};

// 逗号全部过滤成英文逗号
const comma = function (value) {
  value.toString();
  return value.replace(/\，/g, ',')
}

//逗号过滤器
Vue.prototype.$comma = comma;
// 安全码
Vue.prototype.$vcode = vcode;
// q参数过滤
Vue.prototype.$qfilter = qfilter;
// 报表导出
Vue.prototype.$exportReport = exportReport;

Vue.prototype.$queryFilter = queryFilter;

Vue.prototype.$dateFilter = dateFilter;

Vue.prototype.$downloadFile = downloadFile;
