<script>
import { Bar } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'

export default {
  extends: Bar,
  props: ['incomesByMonth', 'expensesByMonth', 'balancesByMonth'],
  mounted() {
    // Overwriting base render method with actual data.
    this.renderChart(
      {
        labels: [
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
        ],
        datasets: [
          {
            label: 'Balance',
            backgroundColor: '#3e95cd',
            // data: [15000, 13000, 12, 39, 40, 40, 39, 80, 40, 20, 12, 11]
            data: this.balancesByMonth
          },
          {
            label: 'Income',
            backgroundColor: '#e8c3b9',
            // data: [30000, 30000, 12, 39, 40, 40, 39, 80, 40, 20, 12, 11]
            data: this.incomesByMonth
          },
          {
            label: 'Expense',
            backgroundColor: '#8e5ea2',
            // data: [15000, 17000, 12, 39, 40, 40, 39, 80, 40, 20, 12, 11]
            data: this.expensesByMonth
          }
        ]
      },
      {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          labels: {
            fontColor: 'black',
            fontSize: 18
          },
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Monthly incomes,expenses and balances',
          fontColor: 'black',
          fontSize: 18
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ],
          yAxes: [
            {
              display: true,
              gridLines: {
                display: true
              }
            }
          ]
        },
        plugins: {
          datalabels: {
            color: '#fff',
            anchor: 'end',
            align: 'start',
            offset: -20,
            borderWidth: 2,
            borderColor: '#fff',
            borderRadius: 25,
            backgroundColor: context => {
              return context.dataset.backgroundColor
            },
            font: {
              color: 'black',
              size: '12'
            }
          }
        }
      },
      ChartDataLabels
    )
  }
}
</script>
