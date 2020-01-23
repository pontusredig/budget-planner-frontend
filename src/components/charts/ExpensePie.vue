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
      color: null,
      bajs: null
    }
  },
  created() {
    this.setColors()
    // , this.test()
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
        }
      }
      // // eslint-disable-next-line no-console
      // console.log(this.color)
    },
    test() {
      this.bajs = []
      let outer0 = this.outer[0]
      let outer1 = this.outer[1]
      let outer2 = this.outer[2]

      // eslint-disable-next-line no-console
      console.log(outer0)
      // eslint-disable-next-line no-console
      console.log(outer1)
      // eslint-disable-next-line no-console
      console.log(outer2)
      // eslint-disable-next-line no-console
      console.log(this.innerData)

      // eslint-disable-next-line no-console
      console.log(outer2[1] == this.labels[0].toUpperCase())

      if (outer2[1] == this.labels[0]) {
        this.bajs.push(this.backgroundColor[0])
        // eslint-disable-next-line no-console
        console.log(this.bajs)
      }

      // eslint-disable-next-line no-console
      console.log(this.color)
      // eslint-disable-next-line no-console
      console.log(this.labels)
      // eslint-disable-next-line no-console
      console.log(this.backgroundColor)
    }
  },
  mounted() {
    this.renderChart(
      {
        labels: this.labels,
        datasets: [
          // Outer pie data starts
          {
            data: this.outer[0],
            backgroundColor: this.color,
            hoverbackgroundColor: this.color,
            labels: this.outer[1]
          },
          // Outer pie data ends
          // Inner pie data starts
          {
            data: this.innerData,
            labels: this.labels,
            backgroundColor: this.backgroundColor,
            hoverbackgroundColor: this.backgroundColor
          }
          // Inner pie data ends
        ]
      },
      {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
          position: 'bottom',
          labels: {
            fontColor: 'black',
            fontSize: 18
          }
        },
        title: {
          display: true,
          text: 'Summary of all expenses during the last 3 months',
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
              size: '12'
            },
            formatter: function(value, ctx) {
              let sum = 0
              let dataArr = ctx.chart.data.datasets[0].data
              dataArr.map(data => {
                sum += data
              })
              let percentage = ((value * 100) / sum).toFixed(1) + '%'
              return percentage
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
