<script>
import { Doughnut } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'
export default {
  extends: Doughnut,
  // props: ['data', 'options'],
  props: ['options'],
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
      this.options,
      ChartDataLabels
    )
  }
}
</script>
