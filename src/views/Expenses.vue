<template>
  <div class="expenses" style="width: 90%">
    <h1>EXPENSES</h1>
    <div align="center">
      <h1 class="pb-10">EXPENSES</h1>
      <BalanceDisplayer />
      <ExpenseDataTable />

      <!-- <div
        v-if="isNull"
        class="chart-container"
      >
        <HorizontalChart :totalValues="totalValues" />

        <hr />
      </div>-->
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import BalanceDisplayer from '@/components/BalanceDisplayer'
import ExpenseDataTable from '@/components/ExpenseDataTable'
// import HorizontalChart from '@/components/charts/HorizontalChart'

export default {
  created() {
    // this.fetchExpenses()
    const a = this.getAllExpenses() //<---- All Expenses
    // const a = this.getExpensesMonths() // <---- Expenses the latest 3 months
    const b = this.getAllIncomes()
    const c = this.getAllBalances()
    Promise.all([a, b, c]).then(() => {
      // this.getTotal()
      // this.getDataByIncomeCategory()
      // this.getDataByExpenseCategory()
    })
  },
  computed: {
    isNull() {
      if (this.totalValues != null) {
        return true
      } else {
        return false
      }
    }
  },

  components: {
    BalanceDisplayer,
    ExpenseDataTable
    // HorizontalChart,
  },

  data: () => ({
    incomeUrl: '/api/income/getall',
    expenseUrl: '/api/expense/getall',
    // balanceUrl: '/api/balance/getcurrent/EXPENDABLE',
    balanceUrl: '/api/balance/getall',
    incomes: [],
    expenses: [],
    balances: [],
    totalValues: null,

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
  }),
  methods: {
    getAllIncomes() {
      return (
        axios
          .get(this.incomeUrl)
          .then(response => {
            this.incomes = response.data
          })
          // eslint-disable-next-line no-unused-vars
          .catch(error => {
            this.log(error)
          })
          .finally(() => (this.loading = false))
      )
    },
    getAllExpenses() {
      return axios
        .get(this.expenseUrl)
        .then(response => {
          this.expenses = response.data
        })
        .catch(error => {
          this.log(error)
        })
        .finally(() => (this.loading = false))
    },
    getAllBalances() {
      return axios
        .get(this.balanceUrl)
        .then(response => {
          this.balances = response.data
        })
        .catch(error => {
          this.log(error)
        })
        .finally(() => (this.loading = false))
    },

    // getTotal() {
    //   this.totalValues = []
    //   this.chartValues = []
    //   let income = 0
    //   let expense = 0
    //   let balance = 0

    //   for (let i in this.incomes) {
    //     income += Number(this.incomes[i].amount)
    //   }
    //   for (let i in this.expenses) {
    //     expense += Number(this.expenses[i].amount)
    //   }
    //   for (let i in this.expenses) {
    //     balance += Number(this.balances[i].amount)
    //   }

    //   this.totalValues.push(balance, income, expense)
    // },
    log(obj) {
      var parsedobj = JSON.parse(JSON.stringify(obj))
      // eslint-disable-next-line no-console
      console.log(parsedobj)
      // console.log(obj)
    }
  }
}
</script>

<style>
.chart-container {
  position: relative;
  height: 40vh;
  width: 80vw;
}
</style>
