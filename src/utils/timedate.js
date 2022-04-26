
const dateFormat = require('dateformat')
const defaultTime = new Date()
const dateToday = dateFormat(defaultTime, 'yyyy-mm-dd')
const dateTomorrow = dateFormat(new Date(Date.parse(defaultTime) + 1000 * 60 * 60 * 24), 'yyyy-mm-dd')
const dateYesterday = dateFormat(new Date(Date.parse(defaultTime) - 1000 * 60 * 60 * 24), 'yyyy-mm-dd')
const dateThreeday = dateFormat(new Date(Date.parse(defaultTime) - 1000 * 60 * 60 * 24 * 3), 'yyyy-mm-dd')
const dateWeek = dateFormat(new Date(Date.parse(defaultTime) - 1000 * 60 * 60 * 24 * 6), 'yyyy-mm-dd')
const dateOneMonth = dateFormat(new Date(Date.parse(defaultTime) - 3600 * 1000 * 24 * 30 + 1000), 'yyyy-mm-dd')


const dateTodayHMS = dateFormat(defaultTime, 'yyyy-mm-dd HH:mm:ss')
const dateYesterdayHMS = dateFormat(new Date(Date.parse(defaultTime) - 1000 * 60 * 60 * 24), 'yyyy-mm-dd HH:mm:ss')
const dateThreedayHMS = dateFormat(new Date(Date.parse(defaultTime) - 1000 * 60 * 60 * 24 * 3), 'yyyy-mm-dd HH:mm:ss')
const dateWeekHMS = dateFormat(new Date(Date.parse(defaultTime) - 1000 * 60 * 60 * 24 * 7), 'yyyy-mm-dd HH:mm:ss')
const dateOneMonthHMS = dateFormat(new Date(Date.parse(defaultTime) - 3600 * 1000 * 24 * 30 + 1000), 'yyyy-mm-dd HH:mm:ss')

const dateTodayStartHMS = (dateFormat(defaultTime, 'yyyy-mm-dd') + ' 00:00:00');
const dateTodayEndHMS = (dateFormat(defaultTime, 'yyyy-mm-dd') + ' 23:59:59');
const dateTomorrowHMS = (dateFormat(new Date(Date.parse(defaultTime) + 1000 * 60 * 60 * 24), 'yyyy-mm-dd') + ' 00:00:00')

export function getToday() {
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() +1
  let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  return year + '-' + month + '-' + day
}

export default {
  dateToday,
  dateTomorrow,
  dateYesterday,
  dateThreeday,
  dateWeek,
  dateOneMonth,
  dateTodayHMS,
  dateYesterdayHMS,
  dateThreedayHMS,
  dateWeekHMS,
  dateOneMonthHMS,
  getToday,
  dateTodayStartHMS,
  dateTodayEndHMS,
  dateTomorrowHMS
}
