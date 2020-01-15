<template>
  <div class="incomes" style="width: 90%">
    <h1>Incomes</h1>
    <p>Submit a new income:</p>
    <v-col cols="10" sm="4" md="3">
      <v-text-field label="Amount" outlined></v-text-field>
    </v-col>

    <v-col cols="10" sm="4" md="3">
      <v-text-field label="Event" outlined></v-text-field>
    </v-col>

    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">
          Dropdown
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-for="(ctg, index) in incomeCategories" :key="index">
          <v-list-item-title>{{ ctg.ctg }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-data-table
      :headers="headers"
      :items="incomes"
      :items-per-page="5"
      class="elevation-1"
    ></v-data-table>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Incomes',

  created() {
    this.fetchData()
  },

  data() {
    return {
      url: '/api/income/getall',
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
      incomeCategories: [{ ctg: 'SALARY' }, { ctg: 'SALE' }, { ctg: 'LOAN' }],
      incomes: []
    }
  },

  methods: {
    fetchData() {
      axios
        .get(this.url)
        .then(response => {
          this.incomes = response.data
        })
        // eslint-disable-next-line no-unused-vars
        .catch(error => {
          this.errored = true
        })
        .finally(() => (this.loading = false))
      // eslint-disable-next-line no-console
      console.log(this.incomes)
    }
  }
}
</script>
