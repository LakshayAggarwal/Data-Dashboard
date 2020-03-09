import dataSet from '../assets/sample_data.json';

let deviceNames = [];

function getDeviceNames() {
  deviceNames = [...new Set(dataSet.data.map((record) => record.device_display_name))];
  return deviceNames;
}

function groupByHours(data) {
  const reducedData = data.reduce((acc, obj) => {
    const key = new Date(obj.time).getHours();
    if (!acc[key]) {
      acc[key] = {
        tempSum: 0,
        length: 0,
      };
    }
    acc[key].tempSum += obj.reading;
    acc[key].length += 1;
    return acc;
  }, {});
  const result = { xAxis: [], yAxis: [] };
  Object.keys(reducedData).forEach((key) => {
    result.xAxis.push(`${key}-${(parseInt(key, 10) + 1)}`);
  });
  Object.values(reducedData).forEach((value) => {
    result.yAxis.push(value.tempSum / value.length);
  });
  return result;
}

function getAverageHourlyTemp(deviceName) {
  const filteredResults = dataSet.data.filter(
    (record) => record.device_display_name === deviceName,
  );
  return groupByHours(filteredResults);
}

function avgTempPerArea(deviceName) {
  const filteredResults = dataSet.data.filter(
    (record) => record.device_display_name === deviceName,
  );
  return (
    filteredResults.reduce((acc, val) => acc + val.reading, 0) / filteredResults.length
  );
}

function hourlyAvgAreaTemp() {
  const result = { xAxis: [], yAxis: [] };
  deviceNames.forEach((device) => {
    result.xAxis.push(device);
    result.yAxis.push(avgTempPerArea(device));
  });
  return result;
}

function getDevicesWithType() {
  const seen = Object.create(null);
  const result = dataSet.data.filter((obj) => {
    const key = ['device_display_name', 'device_type'].map((k) => obj[k]).join('|');
    if (!seen[key]) {
      seen[key] = true;
      return true;
    }
    return false;
  });
  return result;
}

function getSpecificDeviceData(deviceName) {
  const filteredResults = dataSet.data.filter(
    (record) => record.device_display_name === deviceName,
  );
  const result = { xAxis: [], yAxis: [] };
  filteredResults.forEach((element) => {
    const date = new Date(element.time).toLocaleTimeString();
    result.xAxis.push(date);
    result.yAxis.push(element.reading);
  });
  return result;
}

export {
  getDeviceNames,
  getAverageHourlyTemp,
  hourlyAvgAreaTemp,
  getDevicesWithType,
  getSpecificDeviceData,
};
