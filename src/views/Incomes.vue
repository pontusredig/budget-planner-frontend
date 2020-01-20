<template>
  <div class="incomes" style="width: 90%">
    <h1>INCOMES</h1>
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
  }
}
</script>
