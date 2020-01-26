<template>
  <v-container style="width: 50%">
    <v-row no-gutters>
      <v-col>
        <v-card class="pa-2" outlined tile>
          Expendable amount
        </v-card>
      </v-col>
      <v-col>
        <v-card class="pa-2" outlined tile>
          Unpaid expenses
        </v-card>
      </v-col>
      <v-col>
        <v-card class="pa-2" outlined tile>
          Savings
        </v-card>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <v-card class="pa-2" outlined tile>
          {{ expendableBal }}
        </v-card>
      </v-col>
      <v-col>
        <v-card class="pa-2" outlined tile>
          {{ unpaidExp }}
        </v-card>
      </v-col>
      <v-col>
        <v-card class="pa-2" outlined tile>
          {{ savingsBal }}
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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
    getSavingsBalUrl: 'api/balance/getcurrent/SAVINGS',
    getExpendableBalUrl: 'api/balance/getcurrent/EXPENDABLE',
    getUnpaidExpensesUrl: 'api/expense/gettotalbystatus/UNPAID',

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
    }
  }
}
</script>
