<template>
  <div class="chart-wrapper">
    {{xCoordinates}}
    {{yCoordinates}}
    <chart :options="chartOptionsBar"></chart>
  </div>
</template>

<script>
export default {
  name: 'bar-chart',
  props: {
    xCoordinates: {
      type: Array,
    },
    yCoordinates: {
      type: Array,
    },
  },
  data: () => ({
    chartOptionsBar: {},
  }),
  created() {
    this.plotChart();
  },
  updated() {
    // this.plotChart();
  },
  methods: {
    plotChart() {
      this.chartOptionsBar = {
        xAxis: {
          data: this.xCoordinates,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            type: 'bar',
            data: this.yCoordinates,
          },
        ],
      };
    },
  },
};
</script>

<style>

.chart-wrapper {
  width: 100%;
  height: 700px;
}
</style>
