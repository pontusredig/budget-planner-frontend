<template>
  <div>
    <h1>Dashboard</h1>

    <!-- <v-btn v-on:click="isHidden = !isHidden">Show Expense Pie Chart</v-btn> -->
    <!-- <div v-if="isHidden" class="chart-container"> -->

    <!-- <div :key="income.id" v-for="income in incomes" ></div> -->
    <div>totalIncomes {{ totalIncomes }}</div>
    <div>totalExpenses {{ totalExpenses }}</div>
    <div>totalFood {{ totalFood }}</div>

    <hr />
    <div :key="expense.id" v-for="expense in expenses">
      {{ expense.expenseCategory }}
    </div>

    <hr />
    <div class="chart-container">
      <expense-pie :innerData="innerData" />
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
export default {
  created() {
    this.getAllExpenses()
    this.getAllIncomes(), this.getExpenseByFood(), this.log(this.expenses)
  },
  computed: {
    totalIncomes: function() {
      // if (!this.incomes) {
      //   return 0
      // }
      // return this.incomes.reduce(function (total, income) {
      //   return total + Number(income.amount)
      // }, 0)
      return this.total(this.incomes)
    },
    totalExpenses: function() {
      return this.total(this.expenses)
    },
    totalFood: function() {
      return this.total(this.expenseByFood)
    }
  },
  components: {
    BarChart,
    ExpensePie
  },
  name: 'DashboardPage',
  data() {
    return {
      incomeUrl: '/api/income/getall',
      expenseUrl: '/api/expense/getall',
      foodUrl: '/api/expense/getbycategory/FOOD',
      errored: false,
      incomes: [],
      expenses: [],
      expenseByFood: [],
      innerData: [],
      outerData: []
      // isHidden: false,
    }
  },
  methods: {
    getAllIncomes() {
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
      // this.log(this.incomes.amount)
    },
    getAllExpenses() {
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
      // this.log(this.expenses)

      // this.test(this.expenseUrl, this.expenses)
    },
    getExpenseByFood() {
      axios
        .get(this.foodUrl)
        .then(response => {
          this.expenseByFood = response.data
        })
        // eslint-disable-next-line no-unused-vars
        .catch(error => {
          this.log(error)
          this.errored = true
        })
        .finally(() => (this.loading = false))
    },

    total: function(item) {
      if (!item) {
        return 0
      }
      return item.reduce(function(total, item) {
        return total + Number(item.amount)
      }, 0)
    },
    log(item) {
      // eslint-disable-next-line no-console
      console.log(item)
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
