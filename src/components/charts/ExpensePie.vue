<script>
import { Pie } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'
export default {
  extends: Pie,
  // props: ['data', 'options'],
  // props: ['options'],
  mounted() {
    // this.renderChart(this.data, this.options, ChartDataLabels)
    this.renderChart(
      {
        labels: ['Bills', 'Food', 'Pet', 'Clotheslala'],
        backgroundColor: ['#1e9478', '#943d1e', '#1e7594', '#941e75'],
        datasets: [
          // Outer pie data starts
          {
            data: [7500, 500, 1500, 500, 1000, 500, 1000],
            backgroundColor: [
              '#1e9478',
              '#1e9478',
              '#943d1e',
              '#943d1e',
              '#1e7594',
              '#1e7594',
              '#941e75'
            ],
            hoverbackgroundColor: [
              '#1e9478',
              '#1e9478',
              '#943d1e',
              '#943d1e',
              '#1e7594',
              '#1e7594',
              '#941e75'
            ],
            // label: 'Expenses',
            labels: [
              'Rent',
              'Comviq',
              'Ica',
              'Willys',
              'Cat Food',
              'Pet Insurance',
              'H&M'
            ],
            datalabels: {
              // color: 'yellow'
            }
          },
          // Outer pie data ends
          // Inner pie data starts
          {
            data: [8000, 2000, 1500, 1000],
            // label: 'Expense Categories',
            labels: ['Bills', 'Food', 'Pet', 'Clothes'],
            backgroundColor: ['#1e9478', '#943d1e', '#1e7594', '#941e75'],
            hoverbackgroundColor: ['#1e9478', '#943d1e', '#1e7594', '#941e75'],

            datalabels: {
              innerLabels: {
                // title: {
                // color: 'green'
                // }
              }
            }
          }
          // Inner pie data ends
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
          text: 'Expense Summary',
          fontColor: 'white',
          fontSize: 18
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
            },
            formatter: function(value, ctx) {
              let sum = 0
              let dataArr = ctx.chart.data.datasets[0].data
              dataArr.map(data => {
                sum += data
              })
              let percentage = ((value * 100) / sum).toFixed(2) + '%'
              return percentage
            },
            innerLabels: {
              value: {},
              title: {
                // color: 'blue'
              }
            }
          }
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              var dataset = data.datasets[tooltipItem.datasetIndex]
              var index = tooltipItem.index
              return dataset.labels[index] + ': ' + dataset.data[index]
            }
          }
        }
      },
      ChartDataLabels
    )
  }
}
</script>
