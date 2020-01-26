<template>
  <v-container style="width: 50%">
    <v-row no-gutters>
      <v-col>
        <v-card class="pa-2" outlined tile>{{
          this.lastMonth + ' ' + this.lastYear
        }}</v-card>
      </v-col>
      <v-col>
        <v-card class="pa-2" outlined tile>{{
          this.month + ' ' + this.year
        }}</v-card>
      </v-col>
      <v-col>
        <v-card class="pa-2" outlined tile>{{
          this.nextMonth + ' ' + this.nextYear
        }}</v-card>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <v-card class="pa-2" outlined tile>{{
          this.sumExpensesForLastMonth
        }}</v-card>
      </v-col>
      <v-col>
        <v-card class="pa-2" outlined tile>{{
          this.sumExpensesForCurrentMonth
        }}</v-card>
      </v-col>
      <v-col>
        <v-card class="pa-2" outlined tile>{{
          this.sumExpensesForNextMonth
        }}</v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  name: 'MonthExpense',
  props: [
    'sumExpensesForCurrentMonth',
    'sumExpensesForLastMonth',
    'sumExpensesForNextMonth'
  ],
  created() {
    // this.fetchBalances(), this.getMonthNames(), this.test()
    // const a = this.fetchBalances()
    // Promise.all([a]).then(() => {
    this.getMonthNames()
    // })
  },

  data: () => ({
    year: null,
    month: null,
    lastYear: null,
    lastMonth: null,
    nextYear: null,
    nextMonth: null,

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
      let dateNextMonth = new Date(
        d.getFullYear(),
        d.getMonth() + 1,
        d.getDate()
      )
      let dateLastMonth = new Date(
        d.getFullYear(),
        d.getMonth() - 1,
        d.getDate()
      )
      this.nextMonth = monthNames[dateNextMonth.getMonth()]
      this.nextYear = dateNextMonth.getFullYear()

      this.lastMonth = monthNames[dateLastMonth.getMonth()]
      this.lastYear = dateLastMonth.getFullYear()
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
    }
  }
}
</script>
