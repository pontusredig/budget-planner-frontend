<template>
  <div align="center">
    <h1 class="pb-10">EXPENSES</h1>
    <BalanceDisplayer />
    <ExpenseDataTable />
  </div>
</template>

<script>
import BalanceDisplayer from '@/components/BalanceDisplayer'
import ExpenseDataTable from '@/components/ExpenseDataTable'

export default {
  created() {},
  computed: {},
  components: {
    BalanceDisplayer,
    ExpenseDataTable
  }
}
</script>
