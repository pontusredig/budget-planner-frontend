<template>
  <div class="expenses">
    <h1>Information about expenses</h1>
    <v-date-picker></v-date-picker>
    <chart :options="chartOptionsBar"></chart>
  </div>
</template>

<script>
export default {
  name: 'chart',
  data: () => ({
    chartOptionsBar: {
      xAxis: {
        data: ['Q1', 'Q2', 'Q3', 'Q4']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          type: 'bar',
          data: [63, 75, 24, 92]
        }
      ]
    }
  })
}
</script>
