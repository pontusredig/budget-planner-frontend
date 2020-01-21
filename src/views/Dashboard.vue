<template>
  <div align="center">
    <h1 class="pb-10">Dashboard</h1>

    <!-- <v-btn v-on:click="isHidden = !isHidden">Show Expense Pie Chart</v-btn> -->
    <!-- <div v-if="isHidden" class="chart-container"> -->
    <!-- <div :key="income.id" v-for="income in incomes" ></div> -->

    <BalanceDisplayer />
    <v-divider />
    <MonthExpenseDisplayer
      :sumExpensesForCurrentMonth="sumExpensesForCurrentMonth"
    ></MonthExpenseDisplayer>
    <!-- 
    <div>totalIncomes {{ totalIncomes }}</div>
    <div>totalExpenses {{ totalExpenses }}</div>
    <div>innerData {{ innerData }}</div>
    <div>outerData {{ outerData }}</div>
    <div>outer {{ outer }}</div> -->

    <div v-if="isNull" class="chart-container">
      <expense-pie :innerData="innerData" :outer="outer" />
      <hr />
    </div>

    <v-btn v-on:click="isExpenses = !isExpenses">Expenses/Incomes</v-btn>
    <div v-if="isExpenses" class="chart-container">
      <h2 align="left">Expense</h2>
      <BarChartExpenseCategories :expenseCategory="expenseCategory" />
    </div>
    <div v-else class="chart-container">
      <h2 align="left">Income</h2>
      <BarChartIncomeCategories :incomeCategory="incomeCategory" />
    </div>

    <div class="chart-container">
      <BarChart
        :incomesByMonth="incomesByMonth"
        :expenseByMonth="expensesByMonth"
      />
    </div>
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
    // const a = this.getAllExpenses() <---- All Expenses
    const a = this.getExpensesBetweenDates() // <---- Expenses the latest 3 months
    const b = this.getAllIncomes()
    Promise.all([a, b]).then(() => {
      this.getInnerDataByExpenseCategory()
      this.getOuterDataByExpenseCategory()
      this.getExpensesForMonth()
      this.getDataByIncomeCategory()
      this.getDataByExpenseCategory()
      this.getExpensesByMonth()
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
      incomeUrl: '/api/income/getall',
      expenseUrl: '/api/expense/getall',
      expenseDatesUrl: null,
      startDate: null,
      endDate: null,
      incomes: [],
      expenses: [],
      innerData: null,
      outerData: [],
      outerDataLabels: [],
      outerDataCategories: [],
      outer: null,
      expensesForCurrentMonth: null,
      sumExpensesForCurrentMonth: null,
      // isHidden: false,
      incomeCategory: null,
      expenseCategory: null,
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

      // this.log(this.incomes.amount)
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

    getExpensesBetweenDates() {
      let today = this.getCurrentDate()
      this.endDate = this.dateFormat(today)
      this.startDate = this.dateFormat(this.getDateMonthsBefore(today, 3))
      this.expenseDatesUrl =
        '/api/expense/getbetweendates/' + this.startDate + '/' + this.endDate
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
    getExpensesByMonth() {
      let months = ['01','02','03','04','05','06','07','08','09','10','11','12']
      for (let j = 0; j < months.length; j++) {
        let sum = 0
        for (let index = 0; index < this.expenses.length; index++) {
          let backup = this.expenses[index].date.substring(5, 7)
          let expenseMonth
          if (this.expenses[index].dueDate == null) {
            expenseMonth = backup
          } else {
            expenseMonth = this.expenses[index].dueDate.substring(5, 7)
          }
          let amount = this.expenses[index].amount
          if (months[j] == expenseMonth) {
            sum += Number(amount)
          }
        }
        this.expensesByMonth.push(sum)
        this.log('expenses ' + this.expensesByMonth)
      }
    },
    getIncomesByMonth() {
      let months = [
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
      ]
      for (let j = 0; j < months.length; j++) {
        let sum = 0
        for (let index = 0; index < this.incomes.length; index++) {
          let incomeMonth = this.incomes[index].date.substring(5, 7)
          let amount = this.incomes[index].amount
          if (months[j] == incomeMonth) {
            sum += Number(amount)
          }
        }
        this.incomesByMonth.push(sum)
        this.log('incomes' + this.incomesByMonth)
      }
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
  position: relative;
  height: 40vh;
  width: 80vw;
}
</style>
