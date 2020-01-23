<script>
import { Bar } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'

export default {
  extends: Bar,
  props: ['expenseCategory'],
  mounted() {
    // Overwriting base render method with actual data.
    this.renderChart(
      {
        labels: ['Bills', 'Food', 'Pet', 'Clothes'],
        datasets: [
          {
            // data: [15000, 30000, 20000, 1000],
            data: this.expenseCategory,
            backgroundColor: ['#3e95cd', '#e8c3b9', '#8e5ea2', '#941e75']
          }
        ]
      },
      {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
          labels: {
            fontColor: 'white',
            fontSize: 18
          },
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Expense Summary',
          fontColor: 'black',
          fontSize: 18
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false
              },
              ticks: {
                // fontColor: '#e8c3b9'
                fontColor: 'black'
              }
            }
          ],
          yAxes: [
            {
              display: true,
              gridLines: {
                display: true
              },
              ticks: {
                fontColor: 'black'
                // fontColor: '#e8c3b9'
              }
            }
          ]
        },
        plugins: {
          datalabels: {
            color: '#fff',
            anchor: 'end',
            align: 'start',
            offset: -10,
            borderWidth: 2,
            borderColor: '#fff',
            borderRadius: 25,
            backgroundColor: context => {
              return context.dataset.backgroundColor
            },
            font: {
              // weight: 'bold',
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
