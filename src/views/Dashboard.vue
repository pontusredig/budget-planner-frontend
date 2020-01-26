<template>
  <div align="center">
    <v-container class="pb-10">
      <h2 style="display: inline-block">Summary:</h2>
      <BalanceDisplayer />
    </v-container>

    <h2 style="display: inline-block">Expenses per month:</h2>
    <MonthExpenseDisplayer
      :sumExpensesForLastMonth="sumExpensesForLastMonth"
      :sumExpensesForCurrentMonth="sumExpensesForCurrentMonth"
      :sumExpensesForNextMonth="sumExpensesForNextMonth"
    ></MonthExpenseDisplayer>

    <div v-if="isNull" class="chart-container">
      <v-container class="pb-10">
        <expense-pie :innerData="innerData" :outer="outer" />
      </v-container>
    </div>

    <div class="text-right" style="margin:60px">
      <v-btn absolute right small rounded v-on:click="isExpenses = !isExpenses"
        >Expenses/Incomes</v-btn
      >
    </div>

    <div v-if="isExpenses" class="chart-container">
      <!-- <v-container> -->
      <h2 align="left">Expense</h2>
      <!-- </v-container> -->
      <BarChartExpenseCategories :expenseCategory="expenseCategory" />
    </div>
    <div v-else class="chart-container">
      <h2 align="left">Income</h2>
      <BarChartIncomeCategories :incomeCategory="incomeCategory" />
    </div>

    <br />
    <v-container class="pb-10">
      <div v-if="isBarChartNull" class="chart-container">
        <BarChart
          :incomesByMonth="incomesByMonth"
          :expensesByMonth="expensesByMonth"
          :balancesByMonth="balancesByMonth"
        />
      </div>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'
import BarChart from '@/components/charts/BarChart.vue'
import ExpensePie from '@/components/charts/ExpensePie'
import BalanceDisplayer from '@/components/BalanceDisplayer'
import MonthExpenseDisplayer from '@/components/MonthExpenseDisplayer'
import BarChartExpenseCategories from '@/components/charts/BarChartExpenseCategories'
import BarChartIncomeCategories from '@/components/charts/BarChartIncomeCategories'

export default {
  created() {
    const a = this.getAllExpenses() //<---- All Expenses
    const b = this.getAllIncomes()
    const c = this.getExpensesBetweenDates() // <---- Expenses the latest 3 months
    const d = this.getBalanceExpendable()
    Promise.all([a, b, c, d]).then(() => {
      this.getOuterDataByExpenseCategory()
      this.getInnerDataByExpenseCategory()
      this.getExpensesForMonth()
      this.getDataByIncomeCategory()
      this.getDataByExpenseCategory()
      this.getExpensesByMonth()
      this.getIncomesByMonth()
      this.getBalancesByMonth()
    })
  },

  computed: {
    totalIncomes() {
      return this.total(this.incomes)
    },
    totalExpenses() {
      return this.total(this.expenses)
    },
    isNull() {
      if (this.outer != null && this.innerData != null) {
        return true
      } else {
        return false
      }
    },
    isBarChartNull() {
      if (
        this.incomesByMonth != null &&
        this.balancesByMonth != null &&
        this.expensesByMonth != null
      ) {
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
    MonthExpenseDisplayer,
    BarChartExpenseCategories,
    BarChartIncomeCategories
  },
  name: 'DashboardPage',
  data() {
    return {
      months: [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12'
      ],
      incomeUrl: 'api/income/getall',
      expenseUrl: 'api/expense/getall',
      balanceUrl: 'api/balance/getbycategory/EXPENDABLE',
      expenseDatesUrl: null,

      balances: [],
      incomes: [],
      expenses: [],
      expensesDates: [],
      startDate: null,
      endDate: null,
      innerData: null,
      outerData: [],
      outerDataLabels: [],
      outerDataCategories: [],
      outer: null,

      sumExpensesForCurrentMonth: null,
      sumExpensesForNextMonth: null,
      sumExpensesForLastMonth: null,
      // isHidden: false,
      incomeCategory: null,
      expenseCategory: null,
      balancesByMonth: null,
      incomesByMonth: null,
      expensesByMonth: null,
      isExpenses: false
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

    getBalanceExpendable() {
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

    getExpensesBetweenDates() {
      let today = this.getCurrentDate()
      this.endDate = this.dateFormat(today)
      this.startDate = this.dateFormat(this.getDateMonthsBefore(today, 3))
      this.expenseDatesUrl =
        'api/expense/getbetweendates/' + this.startDate + '/' + this.endDate
      return (
        axios
          .get(this.expenseDatesUrl)
          .then(response => {
            this.expensesDates = response.data
          })
          // eslint-disable-next-line no-unused-vars
          .catch(error => {
            this.log(error)
            this.errored = true
          })
          .finally(() => (this.loading = false))
      )
    },
    getBalancesByMonth() {
      this.balancesByMonth = []
      let date = this.dateFormat(this.getCurrentDate())
      let currentYear = date.substring(0, 4)

      this.months.forEach(month => {
        let sum = 0
        this.balances.forEach(bal => {
          let balanceYear = bal.date.substring(0, 4)
          let balanceMonth = bal.date.substring(5, 7)
          let amount = bal.amount
          if (
            month == balanceMonth &&
            Math.max(bal.id) &&
            balanceYear == currentYear
          ) {
            sum = Number(amount)
          }
        })
        this.balancesByMonth.push(sum)
      })
    },
    getExpensesByMonth() {
      this.expensesByMonth = []
      let date = this.dateFormat(this.getCurrentDate())
      let currentYear = date.substring(0, 4)

      this.months.forEach(month => {
        let sum = 0
        this.expenses.forEach(exp => {
          let expenseYear = exp.date.substring(0, 4)
          let backup = exp.date.substring(5, 7)
          let expenseMonth
          if (exp.dueDate == null) {
            expenseMonth = backup
          } else {
            expenseMonth = exp.dueDate.substring(5, 7)
          }
          let amount = exp.amount
          if (month == expenseMonth && expenseYear == currentYear) {
            sum += Number(amount)
          }
        })
        this.expensesByMonth.push(sum)
      })
    },

    getIncomesByMonth() {
      this.incomesByMonth = []
      let date = this.dateFormat(this.getCurrentDate())
      let currentYear = date.substring(0, 4)
      this.months.forEach(month => {
        let sum = 0
        this.incomes.forEach(inc => {
          let incomeYear = inc.date.substring(0, 4)
          let incomeMonth = inc.date.substring(5, 7)
          let amount = inc.amount
          if (month == incomeMonth && incomeYear == currentYear) {
            sum += Number(amount)
          }
        })
        this.incomesByMonth.push(sum)
      })
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
      let now = this.getCurrentDate()
      let date = this.dateFormat(now)
      let currentYear = date.substring(0, 4)
      let currentMonth = date.substring(5, 7)

      let dateLastMonth = this.dateFormat(this.getDateMonthsBefore(now, 1))
      let lastYear = dateLastMonth.substring(0, 4)
      let lastMonth = dateLastMonth.substring(5, 7)

      let dateNextMonth = this.dateFormat(
        new Date(now.getFullYear(), now.getMonth() + 2, now.getDate())
      )
      let nextMonth = dateNextMonth.substring(5, 7)
      let nextYear = dateNextMonth.substring(0, 4)

      let expensesForCurrentMonth = []
      let expensesForNextMonth = []
      let expensesForLastMonth = []

      for (let index = 0; index < this.expenses.length; index++) {
        let expenseYear = this.expenses[index].date.substring(0, 4)
        let expenseMonth = this.expenses[index].date.substring(5, 7)
        // let amount = Number(this.expenses[index].amount)
        if (expenseMonth == currentMonth && expenseYear == currentYear) {
          expensesForCurrentMonth.push(this.expenses[index])
        } else if (expenseMonth == lastMonth && expenseYear == lastYear) {
          expensesForLastMonth.push(this.expenses[index])
        } else if (expenseMonth == nextMonth && expenseYear == nextYear) {
          expensesForNextMonth.push(this.expenses[index])
        }
      }
      this.sumExpensesForCurrentMonth = this.total(expensesForCurrentMonth)
      this.sumExpensesForLastMonth = this.total(expensesForLastMonth)
      this.sumExpensesForNextMonth = this.total(expensesForNextMonth)
    },
    getInnerDataByExpenseCategory() {
      this.innerData = []
      let bills = 0
      let food = 0
      let pet = 0
      let clothes = 0
      for (let index = 0; index < this.expensesDates.length; index++) {
        let cat = this.expensesDates[index].expenseCategory
        let amount = Number(this.expensesDates[index].amount)
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
      for (let index = 0; index < this.expensesDates.length; index++) {
        let cat = this.expensesDates[index].expenseCategory
        let amount = Number(this.expensesDates[index].amount)
        let name = this.expensesDates[index].name
        if (cat == 'BILLS') {
          this.outerData.push(amount)
          this.outerDataLabels.push(name)
          this.outerDataCategories.push(cat)
        }
      }
      for (let index = 0; index < this.expensesDates.length; index++) {
        let cat = this.expensesDates[index].expenseCategory
        let amount = Number(this.expensesDates[index].amount)
        let name = this.expensesDates[index].name
        if (cat == 'FOOD') {
          this.outerData.push(amount)
          this.outerDataLabels.push(name)
          this.outerDataCategories.push(cat)
        }
      }
      for (let index = 0; index < this.expensesDates.length; index++) {
        let cat = this.expensesDates[index].expenseCategory
        let amount = Number(this.expensesDates[index].amount)
        let name = this.expensesDates[index].name
        if (cat == 'PET') {
          this.outerData.push(amount)
          this.outerDataLabels.push(name)
          this.outerDataCategories.push(cat)
        }
      }
      for (let index = 0; index < this.expensesDates.length; index++) {
        let cat = this.expensesDates[index].expenseCategory
        let amount = Number(this.expensesDates[index].amount)
        let name = this.expensesDates[index].name
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
  margin-top: 50px;
  margin-right: 50px;
  margin-left: 50px;
  margin-bottom: 30px;
  padding: 20px;
  /* position: relative; */
  height: 50vh;
  width: 80vw;
}

.button {
  position: absolute;
  /* transition: .5s ease; */
  top: 45%;
  left: 70%;
}
</style>
