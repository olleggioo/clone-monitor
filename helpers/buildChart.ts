import moment from "moment";
import getEnergyUnit from "./getEnergyUnit";
import getHashRateUnit from "./getHashRateUnit";
import getNormEnergyUnit from "./getNormEnergyUnit";
import getHashRate from "./getHashrate";

const algorithmUnits: any = {
    sha256: 'TH',
    eaglesong: 'TH',
    equihash: 'KH',
    scrypt: 'GH',
    ethash: 'GH',
    'Antminer Z15': 'KH',
    default: 'TH',
};
  
const filterAlgorithmUnits: any = {
    // '57ca3b7e-861f-11ee-932b-300505de684f': 'PH',
    '57ca3cca-861f-11ee-932b-300505de684f': 'GH',
    '5f90ee86-861f-11ee-932b-300505de684f': 'TH',
    '5f90ee86-861f-11ee-932b-300505de685f': 'TH',
    '9b073f01-ce18-4bb5-bc18-6cbe5923c4af': 'TH',
    '830768b4-0dea-4f7d-8519-6d93973cf26a': 'KH',
    '364cda56-ff5f-463f-bf29-5df357ff2bc5': 'KH'
};

const getUnit = (algorithm: any, filterParams: any, dataType: string, period: string, chartData: any) => {
    if (dataType === 'hashrate') {
      return filterParams !== "" 
      ? algorithmUnits[filterParams.algorithm] || algorithmUnits.default 
        : algorithmUnits[algorithm] || algorithmUnits.default;
    } else if (dataType === 'consumption') {
      return period === "week" || period === "month"
        ? getEnergyUnit(chartData[0]?.value / 4).unit
        : getEnergyUnit(Math.max(...chartData.map((item: any) => item.value))).unit;
    }
    return '';
};
  
const getDataValues = (chartData: any, dataType: string, algorithm: any, filterParams: any, period: string) => {
  const datasetData = [];
  const gapDuration = 5 * 60 * 1000;
  const stepInterval = 5 * 60 * 1000;

  let unitValue;
  for (let i = 0; i < chartData.length; i++) {

    const value = chartData[i].value;
    if(value !== null) {
      if (dataType === 'hashrate') {
        unitValue = getHashRate(value, "GH").unit;
        const processedValue = filterParams !== ""
          ? period === 'month' 
            ? getHashRateUnit(value / 288, 'GH', getUnit(algorithm, filterParams, dataType, period, chartData)).value
            : period === "week"
              ? getHashRateUnit(value / 96, 'GH', getUnit(algorithm, filterParams, dataType, period, chartData)).value
              : getHashRateUnit(value, 'GH', getUnit(algorithm, filterParams, dataType, period, chartData)).value
          : period === 'month'
            ? getHashRateUnit(value / 288, 'GH', getUnit(algorithm, filterParams, dataType, period, chartData)).value
            : period === "week"
              ? getHashRateUnit(value / 96, 'GH', getUnit(algorithm, filterParams, dataType, period, chartData)).value
              : getHashRateUnit(value, 'GH', getUnit(algorithm, filterParams, dataType, period, chartData)).value
        datasetData.push(processedValue);
  
      } else if (dataType === 'consumption') {
        unitValue = getNormEnergyUnit(value, 'W', getUnit(algorithm, filterParams, dataType, period, chartData)).unit
        const processedValue = period === 'week'
          ? getEnergyUnit(value / 96).value
          : period === "month"
            ? getEnergyUnit(value / 288).value
            : getNormEnergyUnit(value, 'W', getUnit(algorithm, filterParams, dataType, period, chartData)).value;
        datasetData.push(processedValue);
  
      } else {
        datasetData.push(value.toFixed(2));
      }
    } else {
      datasetData.push(value)
    }
  }

  return {
    datasetData,
    unitValue
  };
};

export {
    getUnit,
    getDataValues
}