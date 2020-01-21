<template>
  <div>
    {{ this.month + ' ' + this.year }}
    <v-container class="grey lighten-5">
      <v-row no-gutters>
        <v-col cols="3" class="flex-grow-0 flex-shrink-0">
          <v-card class="pa-2" outlined tile>
            Expendable amount
          </v-card>
        </v-col>
        <v-col cols="3" class="flex-grow-0 flex-shrink-0">
          <v-card class="pa-2" outlined tile>
            Expenses in {{ this.month + ' ' + this.year }}
          </v-card>
        </v-col>
        <v-col cols="3" class="flex-grow-0 flex-shrink-0">
          <v-card class="pa-2" outlined tile>
            Savings Amount
          </v-card>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="3" class="flex-grow-0 flex-shrink-0">
          <v-card class="pa-2" outlined tile>
            {{ this.expendableBal }}
          </v-card>
        </v-col>
        <v-col cols="3" class="flex-grow-0 flex-shrink-0">
          <v-card class="pa-2" outlined tile>
            {{ this.sumExpensesForCurrentMonth }}
          </v-card>
        </v-col>
        <v-col cols="3" class="flex-grow-0 flex-shrink-0">
          <v-card class="pa-2" outlined tile>
            {{ this.savingsBal }}
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'MonthExpense',
  props: ['sumExpensesForCurrentMonth'],
  created() {
    // this.fetchBalances(), this.getMonthNames(), this.test()
    const a = this.fetchBalances()
    Promise.all([a]).then(() => {
      this.getMonthNames()
    })
  },

  data: () => ({
    year: null,
    month: null,
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
    getMonthNames() {
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]
      const d = new Date()
      this.year = d.getFullYear()
      this.month = monthNames[d.getMonth()]
    },

    test() {
      // eslint-disable-next-line no-console
      console.log('test' + this.savingsBal)
      // eslint-disable-next-line no-console
      console.log('test' + this.expendableBal)
      // eslint-disable-next-line no-console
      console.log('test' + this.unpaidExp)
    },

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
