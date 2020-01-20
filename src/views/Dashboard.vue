<template>
  <div>
    <h1>Dashboard</h1>

    <!-- <v-btn v-on:click="isHidden = !isHidden">Show Expense Pie Chart</v-btn> -->
    <!-- <div v-if="isHidden" class="chart-container"> -->
    <!-- <div :key="income.id" v-for="income in incomes" ></div> -->

    <BalanceDisplayer />
    <v-divider />
    <MonthExpenseDisplayer :sumExpensesForCurrentMonth="sumExpensesForCurrentMonth"></MonthExpenseDisplayer>
    <!-- 
    <div>totalIncomes {{ totalIncomes }}</div>
    <div>totalExpenses {{ totalExpenses }}</div>
    <div>innerData {{ innerData }}</div>
    <div>outerData {{ outerData }}</div>
    <div>outer {{ outer }}</div> -->

    <div
      v-if="isNull"
      class="chart-container"
    >
      <expense-pie
        :innerData="innerData"
        :outer="outer"
      />
    </div>

    <div class="chart-container">
      <BarChart />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import BarChart from '@/components/charts/BarChart.vue'
import ExpensePie from '@/components/charts/ExpensePie'
import BalanceDisplayer from '@/components/BalanceDisplayer'
import MonthExpenseDisplayer from '@/components/MonthExpenseDisplayer'

export default {
  created() {
    // const a = this.getAllExpenses() <---- All Expenses
    const a = this.getExpensesMonths() // <---- Expenses the latest 3 months
    const b = this.getAllIncomes()
    Promise.all([a, b]).then(() => {
      this.getInnerDataByExpenseCategory()
      this.getOuterDataByExpenseCategory(), this.getExpensesForMonth()
    })
  },

  computed: {
    totalIncomes() {
      return this.total(this.incomes)
    },
    totalExpenses() {
      return this.total(this.expenses)
    },
    totalMonth() {
      return this.total(this.expensesForCurrentMonth)
    },
    isNull() {
      if (this.outer != null && this.innerData != null) {
        return true
      } else {
        return false
      }
    }
  },
  components: {
    BarChart,
    ExpensePie,
    BalanceDisplayer,
    MonthExpenseDisplayer
  },
  name: 'DashboardPage',
  data() {
    return {
      incomeUrl: '/api/income/getall',
      expenseUrl: '/api/expense/getall',
      expenseDatesUrl: null,
      startDate: null,
      endDate: null,
      errored: false,
      incomes: [],
      expenses: [],
      innerData: null,
      outerData: [],
      outerDataLabels: [],
      outerDataCategories: [],
      outer: null,
      expensesForCurrentMonth: null,
      sumExpensesForCurrentMonth: null
      // isHidden: false,
    }
  },
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
            this.errored = true
          })
          .finally(() => (this.loading = false))
      )

      // this.log(this.incomes.amount)
    },
    getAllExpenses() {
      return (
        axios
          .get(this.expenseUrl)
          .then(response => {
            this.expenses = response.data
          })
          // eslint-disable-next-line no-unused-vars
          .catch(error => {
            this.log(error)
            this.errored = true
          })
          .finally(() => (this.loading = false))
      )
    },

    getExpensesMonths() {
      this.setDateUrl()
      return (
        axios
          .get(this.expenseDatesUrl)
          .then(response => {
            this.expenses = response.data
          })
          // eslint-disable-next-line no-unused-vars
          .catch(error => {
            this.log(error)
            this.errored = true
          })
          .finally(() => (this.loading = false))
      )
    },
    setDateUrl() {
      let today = this.getCurrentDate()
      this.endDate = this.dateFormat(today)
      this.startDate = this.dateFormat(this.getDateMonthsBefore(today, 3))
      this.expenseDatesUrl =
        '/api/expense/getbetweendates/' + this.startDate + '/' + this.endDate
    },
    dateFormat(date) {
      let month = date.getMonth() + 1
      if (month < 10) {
        return date.getFullYear() + '-0' + month + '-' + date.getDate()
      } else {
        return date.getFullYear() + '-' + month + '-' + date.getDate()
      }
    },
    getDateMonthsBefore(date, nofMonths) {
      let thisMonth = date.getMonth()
      date.setMonth(thisMonth - nofMonths)
      if (
        thisMonth - nofMonths < 0 &&
        date.getMonth() != thisMonth + nofMonths
      ) {
        // date.setDate(0)
        date.setDate(date.getDate())
      } else if (
        thisMonth - nofMonths >= 0 &&
        date.getMonth() != thisMonth - nofMonths
      ) {
        date.setDate(date.getDate())
        // date.setDate(0)
      }
      return date
    },
    getCurrentDate() {
      return new Date()
    },
    getExpensesForMonth() {
      let date = this.dateFormat(this.getCurrentDate())
      let currentYear = date.substring(0, 4)
      let currentMonth = date.substring(5, 7)

      this.expensesForCurrentMonth = []
      for (let index = 0; index < this.expenses.length; index++) {
        let expenseYear = this.expenses[index].date.substring(0, 4)
        let expenseMonth = this.expenses[index].date.substring(5, 7)
        // let amount = Number(this.expenses[index].amount)
        if (expenseMonth == currentMonth && expenseYear == currentYear) {
          this.expensesForCurrentMonth.push(this.expenses[index])
        }
      }
      // this.log(this.expensesForCurrentMonth)
      this.sumExpensesForCurrentMonth = this.total(this.expensesForCurrentMonth)
    },
    getInnerDataByExpenseCategory() {
      this.innerData = []
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
      this.innerData.push(bills, food, pet, clothes)
    },
    getOuterDataByExpenseCategory() {
      this.outer = []
      for (let index = 0; index < this.expenses.length; index++) {
        let cat = this.expenses[index].expenseCategory
        let amount = Number(this.expenses[index].amount)
        let name = this.expenses[index].name
        if (cat == 'BILLS') {
          this.outerData.push(amount)
          this.outerDataLabels.push(name)
          this.outerDataCategories.push(cat)
        }
      }
      for (let index = 0; index < this.expenses.length; index++) {
        let cat = this.expenses[index].expenseCategory
        let amount = Number(this.expenses[index].amount)
        let name = this.expenses[index].name
        if (cat == 'FOOD') {
          this.outerData.push(amount)
          this.outerDataLabels.push(name)
          this.outerDataCategories.push(cat)
        }
      }
      for (let index = 0; index < this.expenses.length; index++) {
        let cat = this.expenses[index].expenseCategory
        let amount = Number(this.expenses[index].amount)
        let name = this.expenses[index].name
        if (cat == 'PET') {
          this.outerData.push(amount)
          this.outerDataLabels.push(name)
          this.outerDataCategories.push(cat)
        }
      }
      for (let index = 0; index < this.expenses.length; index++) {
        let cat = this.expenses[index].expenseCategory
        let amount = Number(this.expenses[index].amount)
        let name = this.expenses[index].name
        if (cat == 'CLOTHES') {
          this.outerData.push(amount)
          this.outerDataLabels.push(name)
          this.outerDataCategories.push(cat)
        }
      }
      this.outer.push(
        this.outerData,
        this.outerDataLabels,
        this.outerDataCategories
      )
    },

    total: function(item) {
      if (!item) {
        return 0
      }
      return item.reduce(function(total, item) {
        return total + Number(item.amount)
      }, 0)
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
