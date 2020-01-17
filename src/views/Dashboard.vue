<template>
  <div>
    <h1>Dashboard</h1>

    <!-- <v-btn v-on:click="isHidden = !isHidden">Show Expense Pie Chart</v-btn> -->
    <!-- <div v-if="isHidden" class="chart-container"> -->

    <!-- <div :key="income.id" v-for="income in incomes" ></div> -->
    <div>totalIncomes {{ totalIncomes }}</div>
    <div>totalExpenses {{ totalExpenses }}</div>
    <div>totalFood {{ totalFood }}</div>
    <!-- <div>getAmountByExpenseCategory {{ getAmountByExpenseCategory }}</div> -->
    <div>innerData {{ innerData }}</div>
    <div>outerData {{ outerData }}</div>
    <div>outer {{ outer }}</div>

    <hr />
    <div :key="expense.id" v-for="expense in expenses">
      {{ expense.expenseCategory }}
    </div>

    <hr />
    <div v-if="isNull" class="chart-container">
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
export default {
  created() {
    const a = this.getAllExpenses()
    const b = this.getAllIncomes()
    Promise.all([a, b]).then(() => {
      this.getInnerDataByExpenseCategory()
      this.getOuterDataByExpenseCategory()
    })
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
    isNull(){
      if (this.outer != null && this.innerData != null) {
        return true
    }
    else{
      return false
    }}
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
      innerData: null,
      outerData: [],
      outerDataLabels: [],
      outerDataCategories: [],
      outer: null
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

    // getExpenseByFood() {
    //   return
    //     axios.get(this.foodUrl)
    //       .then(response => {
    //         this.expenseByFood = response.data
    //       })
    //       // eslint-disable-next-line no-unused-vars
    //       .catch(error => {
    //         this.log(error)
    //         this.errored = true
    //       })
    //       .finally(() => (this.loading = false))

    //   // this.test(this.foodUrl, this.expenseByFood)
    // },
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
