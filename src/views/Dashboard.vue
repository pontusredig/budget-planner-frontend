<template>
  <div>
    <h1>Dashboard</h1>

    <!-- <v-btn v-on:click="isHidden = !isHidden">Show Expense Pie Chart</v-btn> -->
    <!-- <div v-if="isHidden" class="chart-container"> -->

    <!-- <div :key="income.id" v-for="income in incomes" ></div> -->
    <div>totalIncomes {{ totalIncomes }}</div>
    <div>totalExpenses {{ totalExpenses }}</div>
    <div>totalFood {{ totalFood }}</div>
    <div>getCategory {{ getCategory }}</div>

    <hr />
    <div
      :key="expense.id"
      v-for="expense in expenses"
    >
      {{ expense.expenseCategory }}
    </div>
    <div>categories {{ categories }}</div>
    <div>expenses {{ expenses[1] }}</div>
    <div>expenses {{ expenses[1].expenseCategory }}</div>

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
    this.getAllIncomes(), this.getExpenseByFood()
  },
  computed: {
    totalIncomes() {
      return this.total(this.incomes)
    },
    totalExpenses() {
      return this.total(this.expenses)
    },
    totalFood() {
      return this.total(this.expenseByFood)
    },
    getAmountByExpenseCategory() {
      const test = []
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
          this.log('food' + food)
        } else if (cat == 'PET') {
          pet += amount
        } else if (cat == 'CLOTHES') {
          clothes += amount
        }
        this.log('food ' + food)
      }
      test.push(bills, food, pet, clothes)
      this.log('test' + test)
      // this.innerData = test
      return test
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
      innerData: this.getAmountByExpenseCategory(),
      outerData: [],
      categories: []
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
      // this.test(this.foodUrl, this.expenseByFood)
    },
    // test(url, item) {
    //   item
    //   axios
    //     .get(url)
    //     .then(response => {
    //       item = response.data
    //     })
    //     // eslint-disable-next-line no-unused-vars
    //     .catch(error => {
    //       this.log(error)
    //       this.errored = true
    //     })
    //     .finally(() => (this.loading = false))
    // },

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
