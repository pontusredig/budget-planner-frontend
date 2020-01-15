<template>
  <div>
    <h1>Dashboard</h1>

    <!-- <v-btn v-on:click="isHidden = !isHidden">Show Expense Pie Chart</v-btn> -->
    <!-- <div v-if="isHidden" class="chart-container"> -->

    <div>
      {{ expense }}
    </div>

    <div :key="expense.id" v-for="expense in expenses">
      {{ expense.amount }}
      <hr />
    </div>

    <div class="chart-container">
      <expense-pie />
      <hr />
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
    this.getAllExpenses(), this.getAllIncomes()
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
      errored: false,
      incomes: [],
      expenses: []
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
        // .catch(error => {
        //   this.errored = true
        // })
        .finally(() => (this.loading = false))
      // console.log(this.incomes)
    },
    getAllExpenses() {
      axios
        .get(this.expenseUrl)
        .then(response => {
          this.expenses = response.data
        })
        // .catch(error => {
        //   this.errored = true
        // })
        .finally(() => (this.loading = false))
      // console.log(this.expenses)
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
