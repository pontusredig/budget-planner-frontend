<template>
  <div class="expenses" style="width: 90%">
    <h1>EXPENSES</h1>

    <BalanceDisplayer />
    <ExpenseDataTable />

    <div class="chart-container">
      <HorizontalChart />
      <hr />
    </div>
    <v-btn v-on:click="isExpenses = !isExpenses">Expenses/Incomes</v-btn>
    <div v-if="isExpenses" class="chart-container">
      <BarChartExpenseCategories />
    </div>
    <div v-else class="chart-container">
      <BarChartIncomeCategories />
    </div>
  </div>
</template>

<script>
import BalanceDisplayer from '@/components/BalanceDisplayer'
import ExpenseDataTable from '@/components/ExpenseDataTable'
import HorizontalChart from '@/components/charts/HorizontalChart'
import BarChartExpenseCategories from '@/components/charts/BarChartExpenseCategories'
import BarChartIncomeCategories from '@/components/charts/BarChartIncomeCategories'

export default {
  created() {
    this.fetchExpenses()
  },

  components: {
    BalanceDisplayer,
    ExpenseDataTable,
    HorizontalChart,
    BarChartExpenseCategories,
    BarChartIncomeCategories
  },

  data: () => ({
    isHidden: false,
    isExpenses: true,
    // isIncomes: false,
    input: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: [0, 10, 5, 2, 20, 30, 45]
        }
      ]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        labels: {
          fontColor: 'white',
          fontSize: 18
        },
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Expense Summary',
        fontColor: 'white',
        fontSize: 18
      },
      plugins: {
        datalabels: {
          color: '#fff',
          anchor: 'end',
          align: 'start',
          offset: -10,
          borderWidth: 2,
          borderColor: '#fff',
          borderRadius: 25,
          backgroundColor: context => {
            return context.dataset.backgroundColor
          },
          font: {
            // weight: 'bold',
            size: '12'
          },
          formatter: function(value, ctx) {
            let sum = 0
            let dataArr = ctx.chart.data.datasets[0].data
            dataArr.map(data => {
              sum += data
            })
            let percentage = ((value * 100) / sum).toFixed(2) + '%'
            return percentage
          },
          innerLabels: {
            value: {},
            title: {
              // color: 'blue'
            }
          }
        }
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            var dataset = data.datasets[tooltipItem.datasetIndex]
            var index = tooltipItem.index
            return dataset.labels[index] + ': ' + dataset.data[index]
          }
        }
      }
    }
  })
}
</script>

<style>
.chart-container {
  position: relative;
  height: 40vh;
  width: 80vw;
}
</style>
