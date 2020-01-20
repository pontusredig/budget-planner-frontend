<script>
import { HorizontalBar } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'

export default {
  extends: HorizontalBar,
  // props: ['totalValues'],
  props: ['chartValues', 'totalValues'],
  mounted() {
    this.renderChart(
      {
        labels: ['Balance', 'Income', 'Expense'],
        backgroundColor: ['#3e95cd', '#e8c3b9', '#8e5ea2'],
        datasets: [
          {
            // data: [15000, 30000, 20000],
            data: this.totalValues,
            // data: this.chartValues,
            backgroundColor: ['#3e95cd', '#e8c3b9', '#8e5ea2']
          }
        ]
      },
      {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          labels: {
            fontColor: 'white',
            fontSize: 18
          },
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Budget Summary - Current month',
          fontColor: 'white',
          fontSize: 18
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false
              },
              ticks: {
                fontColor: '#e8c3b9'
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
                fontColor: '#e8c3b9'
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
