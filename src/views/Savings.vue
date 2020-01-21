<template>
  <div align="center">
    <BalanceDisplayer />
    <v-card
      class="mx-auto text-xs-center"
      color="#F27C3D"
      dark
      max-width="1200"
    >
      <v-card-text>
        <v-sheet color="rgba(0, 0, 0, .12)">
          <v-sparkline
            label-size="12px"
            :value="savings.amount"
            color="rgba(255, 255, 255, .7)"
            height="100"
            padding="24"
            stroke-linecap="round"
            smooth
          >
            <template slot="label" slot-scope="item">
              ${{ item.savings.amount }}
            </template>
          </v-sparkline>
        </v-sheet>
      </v-card-text>
      <p>hej{{ savings }}</p>
      <v-card-text>
        <div class="display-1 font-weight-thin">Savings over time</div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="justify-center">
        <v-btn block text>Go to Report</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios'
import BalanceDisplayer from '@/components/BalanceDisplayer'

export default {
  components: {
    BalanceDisplayer
  },

  created() {
    this.fetchSavings()
  },

  data: () => ({
    getSavingsUrl: '/api/balance/getbycategory/SAVINGS',
    savings: []
  }),
  methods: {
    fetchSavings() {
      axios
        .get(this.getSavingsUrl)
        .then(response => {
          this.savings = response.data
        })
        .catch(error => {
          this.log(error)
        })
        .finally(() => (this.loading = false))
    },

    log(obj) {
      let parsedObject = JSON.parse(JSON.stringify(obj))
      // eslint-disable-next-line no-console
      console.log(parsedObject)
    }
  }
}
</script>
