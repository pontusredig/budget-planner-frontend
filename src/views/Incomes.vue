<template>
  <div align="center">
    <h1 class="pb-10">INCOMES</h1>
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
