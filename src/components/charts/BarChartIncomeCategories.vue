<script>
import { Bar } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'

export default {
  extends: Bar,
  props: ['incomeCategory'],
  mounted() {
    // Overwriting base render method with actual data.
    this.renderChart(
      {
        labels: ['Salary', 'Benefit', 'Sale', 'Loan'],
        datasets: [
          {
            data: this.incomeCategory,
            // data: [15000, 30000, 20000, 1000],
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
            fontColor: 'black',
            fontSize: 18
          },
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Income Summary',
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
                fontColor: 'black'
                // fontColor: '#e8c3b9'
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
