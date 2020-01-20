<template>
  <v-card style="width: 20%">
    <p>Unpaid expenses: {{ unpaidExp }}</p>
    <p>Balance: {{ expendableBal }}</p>
    <p>Savings: {{ savingsBal }}</p>
  </v-card>
</template>

<script>
import axios from 'axios'
import { eventBus } from '../main.js'

export default {
  name: 'BalanceDisplayer',

  created() {
    this.fetchBalances()

    eventBus.$on('updateBalances', () => {
      this.fetchBalances()
    })
  },

  data: () => ({
    getSavingsBalUrl: '/api/balance/getcurrent/SAVINGS',
    getExpendableBalUrl: '/api/balance/getcurrent/EXPENDABLE',
    getUnpaidExpensesUrl: '/api/expense/gettotalbystatus/UNPAID',

    savingsBal: null,
    expendableBal: null,
    unpaidExp: null,

    loading: null,
    errored: null
  }),

  methods: {
    fetchBalances() {
      axios
        .all([
          axios.get(this.getSavingsBalUrl),
          axios.get(this.getExpendableBalUrl),
          axios.get(this.getUnpaidExpensesUrl)
        ])
        .then(
          axios.spread((savingsBalRes, expendableBalRes, unpaidExpensesRes) => {
            this.savingsBal = savingsBalRes.data
            this.expendableBal = expendableBalRes.data
            this.unpaidExp = unpaidExpensesRes.data
          })
        )
        .catch(error => {
          // eslint-disable-next-line no-console
          console.log(error)
          this.errored = true
        })
        .finally(() => (this.loading = false))
    }
  }
}
</script>
