<template>
  <<<<<<<
    HEAD
    <div
    class="expenses"
    style="width: 90%"
  >
    <h1>EXPENSES</h1>

    =======
    <div align="center">
      <h1 class="pb-10">EXPENSES</h1>
      >>>>>>> f04da8853950fb35f8b1de0b512cba86bf0634c3
      <BalanceDisplayer />
      <ExpenseDataTable />

      <div
        v-if="isNull"
        class="chart-container"
      >
        <HorizontalChart :totalValues="totalValues" />

        <hr />
      </div>
      <v-btn v-on:click="isExpenses = !isExpenses">Expenses/Incomes</v-btn>
      <div
        v-if="isExpenses"
        class="chart-container"
      >
        <BarChartExpenseCategories :expenseCategory="expenseCategory" />
      </div>
      <div
        v-else
        class="chart-container"
      >
        <BarChartIncomeCategories :incomeCategory="incomeCategory" />
      </div>
    </div>
</template>

<script>
import axios from 'axios'
import BalanceDisplayer from '@/components/BalanceDisplayer'
import ExpenseDataTable from '@/components/ExpenseDataTable'
import HorizontalChart from '@/components/charts/HorizontalChart'
import BarChartExpenseCategories from '@/components/charts/BarChartExpenseCategories'
import BarChartIncomeCategories from '@/components/charts/BarChartIncomeCategories'

export default {
  created() {
    // this.fetchExpenses()
    const a = this.getAllExpenses() //<---- All Expenses
    // const a = this.getExpensesMonths() // <---- Expenses the latest 3 months
    const b = this.getAllIncomes()
    const c = this.getAllBalances()
    Promise.all([a, b, c]).then(() => {
      this.getTotal()
      this.getDataByIncomeCategory()
      this.getDataByExpenseCategory()
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
    ExpenseDataTable,
    HorizontalChart,
    BarChartExpenseCategories,
    BarChartIncomeCategories
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
    incomeCategory: null,
    expenseCategory: null,
    isExpenses: false,

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
    getDataByExpenseCategory() {
      this.expenseCategory = []
      let bills = 0
      let food = 0
      let pet = 0
      let clothes = 0
      for (let index = 0; index < this.expenses.length; index++) {
        let cat = this.expenses[index].expenseCategory
        let amount = Number(this.expenses[index].amount)
        if (cat == 'BILLS') {
          bills += amount
        } else if (cat == 'FOOD') {
          food += amount
        } else if (cat == 'PET') {
          pet += amount
        } else if (cat == 'CLOTHES') {
          clothes += amount
        }
      }
      this.expenseCategory.push(bills, food, pet, clothes)
    },
    getDataByIncomeCategory() {
      this.incomeCategory = []
      let salary = 0
      let benefit = 0
      let sale = 0
      let loan = 0
      for (let index = 0; index < this.incomes.length; index++) {
        let cat = this.incomes[index].incomeCategory
        let amount = Number(this.incomes[index].amount)
        if (cat == 'SALARY') {
          salary += amount
        } else if (cat == 'BENEFIT') {
          benefit += amount
        } else if (cat == 'SALE') {
          sale += amount
        } else if (cat == 'LOAN') {
          loan += amount
        }
      }
      this.incomeCategory.push(salary, benefit, sale, loan)
    },
    getTotal() {
      this.totalValues = []
      this.chartValues = []
      let income = 0
      let expense = 0
      let balance = 0

      for (let i in this.incomes) {
        income += Number(this.incomes[i].amount)
      }
      for (let i in this.expenses) {
        expense += Number(this.expenses[i].amount)
      }
      for (let i in this.expenses) {
        balance += Number(this.balances[i].amount)
      }

      this.totalValues.push(balance, income, expense)
    },
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
