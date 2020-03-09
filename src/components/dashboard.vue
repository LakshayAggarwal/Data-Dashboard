<template>
  <v-container col>
    <v-layout>
      <v-flex xs6>
        <v-layout fill-height class='cardLayout' pa-3 mx-4 row wrap>
          <v-flex xs6>
            Temperature average
          </v-flex>
          <v-flex pr-2 offset-xs6>
            <v-overflow-btn
              v-model="defaultDevice"
              @change="deviceChangeEvent($event)"
              :items="deviceNames"
              label="Select Device Name"
              dense
              flat
              class="custom-dropdown"
              :menu-props="{ maxHeight: 130, overflowY: true }"
            ></v-overflow-btn>
          </v-flex>
          <v-flex class='bar-chart-wrapper'>
            <chart :options="chartOptionsBar"></chart>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs6>
        <v-layout fill-height class='cardLayout' pa-2 mx-4>
          <v-flex class="line-chart-wrapper">
            <chart :options="chartOptionsLine"></chart>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout pa-4>
      <v-flex shrink>
        <v-simple-table class='cardLayout' fixed-header dark height="300px">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-center">Area</th>
                <th class="text-center">Device Type</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="device in devices" :key="device.device_display_name + device.device_type">
                <td>{{ device.device_display_name }}</td>
                <td>{{ device.device_type }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-flex>
      <v-flex grow>
        <v-layout row wrap class='cardLayout' ma-4>
          <v-flex clas="" align-self-center xs6>
            Live Temperature
          </v-flex>
          <v-flex pr-2 xs6>
            <v-overflow-btn
              v-model="defaultLiveDevice"
              @change="deviceChangeLiveEvent($event)"
              :items="deviceNames"
              label="Select Device Name"
              dense
              class="custom-dropdown"
              :menu-props="{ maxHeight: 130, overflowY: true }"
            ></v-overflow-btn>
          </v-flex>
          <v-flex xs12 class="live-chart-wrapper">
            <chart :options="chartOptionsLive"></chart>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import {
  getDeviceNames,
  getAverageHourlyTemp,
  hourlyAvgAreaTemp,
  getDevicesWithType,
  getSpecificDeviceData,
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
      chartOptionsLive: {},
      devices: {},
      defaultDevice: 'Reception',
      defaultLiveDevice: 'Reception',
    };
  },
  created() {
    this.getData();
    this.getTempAvgPerDevice();
    this.setTableData();
    this.deviceChangeEvent(this.defaultDevice);
    this.deviceChangeLiveEvent(this.defaultLiveDevice);
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
          boundaryGap: true,
          splitArea: {
            interval: 1,
          },
          axisLabel: {
            rotate: 90,
            margin: 5,
            formatter: (value) => `{value|${value}}`,
            rich: {
              value: {
                width: 10,
                color: 'red',
              },
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
    deviceChangeLiveEvent(device) {
      let idVar;
      const response = getSpecificDeviceData(device);
      this.chartOptionsLive = {
        xAxis: {
          data: [],
          splitLine: {
            show: false,
          },
          splitArea: {
            interval: 1,
          },
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            type: 'line',
            data: [],
          },
        ],
        color: ['#127ac2'],
      };
      let currentIndex = response.xAxis.length - 1;
      function myStopFunction() {
        clearInterval(idVar);
      }
      idVar = setInterval(() => {
        for (let i = 0; i < 10; i += 1) {
          if (this.chartOptionsLive.xAxis.data.length === 10) {
            this.chartOptionsLive.xAxis.data.shift();
            this.chartOptionsLive.series[0].data.shift();
          }
          if (currentIndex >= 0) {
            this.chartOptionsLive.xAxis.data.push(response.xAxis[currentIndex]);
            this.chartOptionsLive.series[0].data.push(response.yAxis[currentIndex]);
          } else {
            myStopFunction();
          }
          currentIndex -= 1;
        }
      }, 1000);
      console.log(response);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.cardLayout {
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4);
  transition: 0.3s;
  border-radius: 4px;
}

.bar-chart-wrapper {
  height: 350px;
}

.bar-chart-wrapper > .echarts {
  height: 100%;
}

.line-chart-wrapper {
  height: 400px;
}

.line-chart-wrapper > .echarts {
  height: 100%;
  width: 100%;
}

.live-chart-wrapper {
  height: 350px;
  width: 100%;
}

.live-chart-wrapper > .echarts {
  height: 100%;
  max-width: inherit;
}

.custom-dropdown.v-overflow-btn.v-input--is-focused .v-input__slot {
  border: 1px solid #959595 !important;
  border-color: #959595 !important;
  box-shadow: none !important;
  border-radius: 0;
}

.custom-dropdown.v-overflow-btn .v-input__slot {
  border: 1px solid #959595;
  border-color: #959595 !important;
}


</style>
