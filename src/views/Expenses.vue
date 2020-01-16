<template>
  <div class="expenses" style="width: 90%">
    <h1>EXPENSES</h1>

    <v-card>
      <v-col cols="4" md="3" class="pb-0">
        <p>Add a new expense:</p>
      </v-col>
      <v-col cols="4" md="3" class="py-0">
        <v-text-field label="Amount" v-model="amount" outlined></v-text-field>
      </v-col>

      <v-col cols="4" md="3" class="py-0">
        <v-text-field label="Event" v-model="event" outlined></v-text-field>
      </v-col>

      <v-menu
        v-model="postDateMenu"
        :close-on-content-click="false"
        :nudge-right="50"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-col cols="4" md="3" class="py-0">
            <v-text-field
              label="Date"
              outlined
              readonly
              :value="date"
              v-on="on"
            ></v-text-field>
          </v-col>
        </template>
        <v-date-picker
          v-model="date"
          no-title
          @input="postDateMenu = false"
        ></v-date-picker>
      </v-menu>

      <v-menu
        v-model="postDueDateMenu"
        :close-on-content-click="false"
        :nudge-right="50"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-col cols="4" md="3" class="py-0">
            <v-text-field
              label="Due Date"
              outlined
              readonly
              :value="dueDate"
              v-on="on"
            ></v-text-field>
          </v-col>
        </template>
        <v-date-picker
          v-model="dueDate"
          no-title
          @input="postDueDateMenu = false"
        ></v-date-picker>
      </v-menu>

      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-col cols="4" md="3" class="py-0">
            <v-select
              :items="categories"
              label="Category"
              v-model="expenseCategory"
              outlined
            ></v-select>
          </v-col>
        </template>
      </v-menu>

      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-col cols="4" md="3" class="py-0">
            <v-select
              :items="statuses"
              label="Status"
              v-model="status"
              outlined
            ></v-select>
          </v-col>
        </template>
      </v-menu>
      <v-col cols="4" sm="2" md="3" class="py-0">
        <v-btn color="info" @click="addExpense">ADD EXPENSE</v-btn>
      </v-col>
    </v-card>

    <v-data-table
      :headers="headers"
      :items="expenses"
      :items-per-page="10"
      class="elevation-1"
    ></v-data-table>

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
import axios from 'axios'
import HorizontalChart from '@/components/charts/HorizontalChart'
import BarChartExpenseCategories from '@/components/charts/BarChartExpenseCategories'
import BarChartIncomeCategories from '@/components/charts/BarChartIncomeCategories'

export default {
  created() {
    this.fetchExpenses()
  },

  components: {
    HorizontalChart,
    BarChartExpenseCategories,
    BarChartIncomeCategories
  },
  data: () => ({
    getUrl: '/api/expense/getall',
    postUrl: '/api/expense/add',
    postDateMenu: false,
    postDueDateMenu: false,
    date: null,
    dueDate: null,
    amount: null,
    event: null,
    expenseCategory: null,
    status: null,
    categories: ['BILLS', 'CLOTHES', 'FOOD', 'PET'],
    statuses: ['PAID', 'UNPAID'],
    errored: false,

    headers: [
      {
        text: 'Date',
        align: 'left',
        value: 'date'
      },
      { text: 'Category', value: 'expenseCategory' },
      { text: 'Amount', value: 'amount' },
      { text: 'Event', value: 'name' },
      { text: 'Status', value: 'expenseStatus' },
      { text: 'Due Date', value: 'dueDate' }
    ],

    expenses: [],

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
  }),

  methods: {
    fetchExpenses() {
      axios
        .get(this.getUrl)
        .then(response => {
          this.expenses = response.data
        })
        // eslint-disable-next-line no-unused-vars
        .catch(error => {
          this.errored = true
        })
        .finally(() => (this.loading = false))
    },
    addExpense() {
      axios
        .post(this.postUrl, {
          amount: this.amount,
          expenseCategory: this.expenseCategory,
          name: this.event,
          date: this.date,
          dueDate: this.dueDate,
          expenseStatus: this.status
        })
        .then(response => {
          this.message = response.data
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.log(error)
          this.errored = true
        })
        .finally(() => this.fetchExpenses())
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
