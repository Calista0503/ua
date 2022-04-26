<template>
  <div class="LineCharts">
    <div class="lineChart" ref="lineChart" :style="{height:height,width:width}"></div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme
  export default {
    name: 'LineCharts',
    props: {
      width: {
        type: String,
        default: '1200px'
      },
      height: {
        type: String,
        default: '340px'
      },
      listData: {
        type: Array
      },
      timesXaxis: {
        type: Array
      },
      legendArray: {
        type: Array
      },
      title: {
        type: String
      }
    },
    data() {
      return {
        chart: null
      }
    },
    mounted() {
      this.initChart()
    },
    watch: {
      listData: {
        deep: true,
        handler(val) {
          this.setOptions(val)
        }
      }
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$refs.lineChart, 'macarons')
        this.setOptions(this.listData)
      },
      setOptions(listData){
        if(listData){
          this.chart.setOption({
            color: ['#006699', '#4cabce', '#e5323e'],
            title: {
              text: this.title
            },
            xAxis: {
              data: this.timesXaxis,
              type: 'category',
              axisTick: {
                show: false
              }
            },
            legend: {
              data: this.legendArray
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            toolbox: {
              show: true,
              orient: 'vertical',
              left: 'left',
              top: 'center'
            },
            calculable: true,
            yAxis: {
              type: 'value'
            },
            series: this.listData
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
