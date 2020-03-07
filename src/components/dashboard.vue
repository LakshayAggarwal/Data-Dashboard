<template>
  <v-container col>
    <v-layout>
      <v-flex xs5>
        <v-layout class='cardLayout' ma-4 row wrap>
          <v-flex xs6></v-flex>
          <v-flex pr-2 xs6>
            <v-overflow-btn
              @change="deviceChangeEvent($event)"
              :items="deviceNames"
              label="Select Device Name"
              dense
            ></v-overflow-btn>
          </v-flex>
          <v-flex>
            <div class="chart-wrapper">
              <chart :options="chartOptionsBar"></chart>
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs5>
        <v-layout class='cardLayout' ma-4>
          <v-flex>
            <chart :options="chartOptionsLine"></chart>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout pa-4>
      <v-simple-table class='cardLayout' fixed-header dark height="300px">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-center">Area</th>
              <th class="text-center">Device Type</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="device in devices" :key="device.device_display_name">
              <td>{{ device.device_display_name }}</td>
              <td>{{ device.device_type }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-layout>
  </v-container>
</template>

<script>
import {
  getDeviceNames,
  getAverageHourlyTemp,
  hourlyAvgAreaTemp,
  getDevicesWithType,
} from '../services/service';

export default {
  name: 'dashboard',
  props: {
    msg: String,
  },
  data() {
    return {
      deviceNames: [],
      xCoordinates: [],
      yCoordinates: [],
      plotEnabled: false,
      chartOptionsBar: {},
      chartOptionsLine: {},
      devices: {},
    };
  },
  created() {
    this.getData();
    this.getTempAvgPerDevice();
    this.setTableData();
  },
  methods: {
    getData() {
      this.deviceNames = getDeviceNames();
    },
    deviceChangeEvent(device) {
      const temp = getAverageHourlyTemp(device);
      this.chartOptionsBar = {
        xAxis: {
          data: temp.xAxis,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            type: 'bar',
            data: temp.yAxis,
          },
        ],
        color: ['#127ac2'],
      };
    },
    getTempAvgPerDevice() {
      const response = hourlyAvgAreaTemp();
      this.chartOptionsLine = {
        xAxis: {
          data: response.xAxis,
          splitArea: {
            interval: 1,
          },
          axisLabel: {
            formatter: (value) => {
              let str = value.split('-');
              str = str.join('\n');
              return str;
            },
          },
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            type: 'line',
            data: response.yAxis,
          },
        ],
        color: ['#127ac2'],
      };
    },
    setTableData() {
      this.devices = getDevicesWithType();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.cardLayout {
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4);
  transition: 0.3s;
  border-radius: 4px;
}

.chart-wrapper {
  width: 100%;
}

</style>
