<template>
  <div class="incomes" style="width: 90%">
    <h1>INCOMES</h1>
    <BalanceDisplayer />

    <v-card>
      <v-col cols="4" md="3" class="pb-0">
        <p>Add a new income:</p>

        <v-text-field label="Amount" v-model="amount" outlined></v-text-field>

        <v-text-field label="Event" v-model="event" outlined></v-text-field>

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
            <v-text-field
              label="Date"
              outlined
              readonly
              :value="date"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date"
            no-title
            @input="postDateMenu = false"
          ></v-date-picker>
        </v-menu>

        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-select
              :items="categories"
              label="Category"
              v-model="incomeCategory"
              outlined
            ></v-select>
          </template>
        </v-menu>

        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-select
              :items="statuses"
              label="Status"
              v-model="status"
              outlined
            ></v-select>
          </template>
        </v-menu>

        <v-btn color="info" @click="addIncome">ADD INCOME</v-btn>
      </v-col>
    </v-card>

    <v-data-table
      :headers="headers"
      :items="incomes"
      :items-per-page="10"
      dense
      class="elevation-1"
    ></v-data-table>
  </div>
</template>

<script>
import axios from 'axios'
import BalanceDisplayer from '@/components/BalanceDisplayer'

export default {
  name: 'Incomes',

  created() {
    this.fetchIncomes()
  },

  components: {
    BalanceDisplayer
  },

  data() {
    return {
      getUrl: '/api/income/getall',
      postUrl: '/api/income/add',
      postDateMenu: false,
      date: null,
      amount: null,
      event: null,
      incomeCategory: null,
      status: null,
      categories: ['BENEFIT', 'LOAN', 'SALARY', 'SALE'],
      statuses: ['EXPENDABLE', 'SAVINGS'],
      errored: false,

      headers: [
        {
          text: 'Date',
          align: 'left',
          value: 'date'
        },
        { text: 'Category', value: 'incomeCategory' },
        { text: 'Amount', value: 'amount' },
        { text: 'Event', value: 'name' },
        { text: 'Status', value: 'incomeStatus' }
      ],

      incomes: []
    }
  },

  methods: {
    fetchIncomes() {
      axios
        .get(this.getUrl)
        .then(response => {
          this.incomes = response.data
        })
        // eslint-disable-next-line no-unused-vars
        .catch(error => {
          this.errored = true
        })
        .finally(() => (this.loading = false))
    },
    addIncome() {
      axios
        .post(this.postUrl, {
          amount: this.amount,
          incomeCategory: this.incomeCategory,
          name: this.event,
          date: this.date,
          incomeStatus: this.status
        })
        .then(response => {
          this.message = response.data
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.log(error)
          this.errored = true
        })
        .finally(() => this.fetchIncomes())
    }
  }
}
</script>
