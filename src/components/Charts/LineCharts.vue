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
      },
      yAxis: {}
    },
    data() {
      return {
        chart: null
      }
    },
    mounted() {
      this.initChart()
      // this.listData.map(item => {
      //   this.legendArray.push(item.name)
      // })
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
        this.setOptions(this.timesXaxis)
      },
      setOptions(listData){
        if(listData){
          this.chart.setOption({
            title: {
              text: this.title
            },
            legend: {
              data: this.legendArray
            },
            xAxis: {
              data: this.timesXaxis,
              boundaryGap: false,
              axisTick: {
                show: false
              }
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross'
              }
            },
            yAxis: this.yAxis,
            series: this.listData
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
