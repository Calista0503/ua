import Vue from 'vue'

// 金额过滤器，保留两位小数
Vue.filter('rmb', function (value) {
  if (value) {
    return (Number(value) / 100).toFixed(2);
  } else {
    return Number(0)
  }
})

