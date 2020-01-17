<template>
  <div class="savings">
    <h1>Information about savings</h1>
    <BalanceDisplayer />
    <IncomeDataTable />
  </div>
</template>

<script>
import BalanceDisplayer from '@/components/BalanceDisplayer'
import IncomeDataTable from '@/components/IncomeDataTable'

export default {
  components: {
    BalanceDisplayer,
    IncomeDataTable
  },

  data() {
    return {}
  }
}
</script>
