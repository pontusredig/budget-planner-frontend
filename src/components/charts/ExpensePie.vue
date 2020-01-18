<script>
import { Pie } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'
export default {
  extends: Pie,
  props: ['outer', 'innerData'],
  data() {
    return {
      labels: ['Bills', 'Food', 'Pet', 'Clothes'],
      backgroundColor: ['#1e9478', '#943d1e', '#1e7594', '#941e75'],
      color: null
    }
  },
  created() {
     this.setColors()
  },
  methods: {
    setColors() {
      this.color = []
      for (let i = 0; i < this.outer[0].length; i++) {
        if (this.outer[2][i] == this.labels[0].toUpperCase()) {
          this.color.push(this.backgroundColor[0])
        } else if (this.outer[2][i] == this.labels[1].toUpperCase()) {
          this.color.push(this.backgroundColor[1])
        } else if (this.outer[2][i] == this.labels[2].toUpperCase()) {
          this.color.push(this.backgroundColor[2])
        } else if (this.outer[2][i] == this.labels[3].toUpperCase()) {
          this.color.push(this.backgroundColor[3])
      } }
                // eslint-disable-next-line no-console
      console.log(this.color)
    }
  },
  mounted() {
    // this.renderChart(this.data, this.options, ChartDataLabels)
  
    this.renderChart(
      {
        labels: this.labels,
        // backgroundColor: this.backgroundColor,
        datasets: [
          // Outer pie data starts
          {
            data: this.outer[0],
            backgroundColor: this.color,
            hoverbackgroundColor: this.color,
            // label: 'Outer pie',
            labels: this.outer[1],
            // labels: ['ÄTA','BAJSA','KISSA'],
            // datalabels: {
            //   // color: 'yellow'
            // }
          },
          // Outer pie data ends
          // Inner pie data starts
          {
            // data: [8000, 2000, 1500, 1000],
            data: this.innerData,
            // label: 'Inner pie',
            labels: this.labels,
            backgroundColor: this.backgroundColor,
            hoverbackgroundColor:  this.backgroundColor,

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
            fontColor: 'black',
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
