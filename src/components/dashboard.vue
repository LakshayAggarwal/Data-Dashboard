<template>
  <v-container col>
    <v-layout py-4>
      <v-flex xs6>
        <v-layout fill-height class='cardLayout' pa-3 mx-4 row wrap>
          <v-flex class="text-left graph-headers" ml-4 xs6>
            Hourly Average Temperature
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
        <v-layout fill-height row wrap class='cardLayout' pa-2 mx-4>
          <v-flex ml-4 class="text-left graph-headers" align-self-center xs12>
            Temperature Average
          </v-flex>
          <v-flex class="line-chart-wrapper">
            <chart :options="chartOptionsLine"></chart>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout pa-4>
      <v-flex xs6>
        <v-layout fill-height row wrap class='cardLayout' ml-0 mr-4 pa-2>
          <v-flex ml-4 class="text-left graph-headers" align-self-center xs6>
            Device Data
          </v-flex>
          <v-flex xs12>
            <v-simple-table class="ml-1" fixed-header height="400px">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-center">Area</th>
                    <th class="text-center">Device Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="device in devices"
                  :key="device.device_display_name+device.device_type">
                    <td>{{ device.device_display_name }}</td>
                    <td>{{ device.device_type }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs6>
        <v-layout row wrap class='cardLayout' ml-4 mr-0 pa-2>
          <v-flex ml-4 class="text-left graph-headers" align-self-center xs6>
            Live Temperature
          </v-flex>
          <v-flex pr-2 offset-xs6>
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
      liveVariable: null,
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
        tooltip: {
          formatter: (params) => `${params.marker}${params.name}<br>${params.data.toFixed(2)} &degC`,
        },
        xAxis: {
          name: 'Hours',
          data: temp.xAxis,
        },
        yAxis: {
          name: 'Average Temp.',
          type: 'value',
        },
        series: [
          {
            type: 'bar',
            data: temp.yAxis,
            barWidth: '50%',
          },
        ],
        color: ['#127ac2'],
      };
    },
    getTempAvgPerDevice() {
      const response = hourlyAvgAreaTemp();
      this.chartOptionsLine = {
        tooltip: {
          trigger: 'axis',
          formatter: (params) => `${params[0].name}<br>${params[0].marker}${params[0].data.toFixed(2)} &degC`,
        },
        xAxis: {
          name: 'Area',
          data: response.xAxis,
          boundaryGap: true,
          splitArea: {
            interval: 1,
          },
          axisLabel: {
            rotate: 90,
            margin: 5,
            formatter: (value) => {
              const str = value.split('-');
              return str.join('\n');
            },
            fontSize: 7,
          },
        },
        yAxis: {
          name: 'Average Temp.',
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
    clearLiveList() {
      clearInterval(this.liveVariable);
    },
    deviceChangeLiveEvent(device) {
      if (this.liveVariable) {
        this.clearLiveList();
      }
      const response = getSpecificDeviceData(device);
      this.chartOptionsLive = {
        tooltip: {
          trigger: 'axis',
          formatter: (params) => `${params[0].name}<br>${params[0].marker}${params[0].data.toFixed(2)} &degC`,
        },
        xAxis: {
          name: 'Time',
          data: [],
          splitLine: {
            show: false,
          },
          splitArea: {
            interval: 1,
          },
        },
        yAxis: {
          name: 'Temperature',
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
      this.liveVariable = setInterval(() => {
        for (let i = 0; i < 10; i += 1) {
          if (this.chartOptionsLive.xAxis.data.length === 10) {
            this.chartOptionsLive.xAxis.data.shift();
            this.chartOptionsLive.series[0].data.shift();
          }
          if (currentIndex >= 0) {
            this.chartOptionsLive.xAxis.data.push(response.xAxis[currentIndex]);
            this.chartOptionsLive.series[0].data.push(response.yAxis[currentIndex]);
          } else {
            this.clearLiveList();
          }
          currentIndex -= 1;
        }
      }, 1000);
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

.graph-headers{
  font-size: 18px;
  font-weight: bold;
}

</style>
