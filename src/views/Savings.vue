<template>
  <div align="center">
    <h1 class="pb-10">SAVINGS</h1>
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
            :value="savings"
            color="rgba(255, 255, 255, .7)"
            height="100"
            padding="24"
            stroke-linecap="round"
            smooth
            :auto-draw="!!savings.length"
          >
            >
          </v-sparkline>
        </v-sheet>
      </v-card-text>
      <v-card-text>
        <div class="display-1 font-weight-thin">
          Current savings: {{ currentSavings }}
        </div>
      </v-card-text>

      <v-divider></v-divider>
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
    getSavingsUrl: '/api/balance/getlatestsavings',
    savings: [],
    currentSavings: null,
    myAutoDraw: false
  }),
  methods: {
    fetchSavings() {
      axios
        .get(this.getSavingsUrl)
        .then(response => {
          this.savings = response.data
          this.currentSavings = this.savings[this.savings.length - 1]
        })
        .catch(error => {
          this.log(error)
        })
    },

    log(obj) {
      let parsedObject = JSON.parse(JSON.stringify(obj))
      // eslint-disable-next-line no-console
      console.log(parsedObject)
    }
  }
}
</script>
