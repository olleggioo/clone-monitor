import { HashUnitEnum } from '@/interfaces/enums'
import { HashRateUnitType } from '@/interfaces'
import getHashRateUnit from './getHashRateUnit';

const getHashRate = (value: any, from: HashRateUnitType) => {
    const valueNumber = parseFloat(value);
  let currentValue = valueNumber;
  let currentUnit = from;

  if (currentValue === 0 && currentUnit === 'GH') {
    currentUnit = 'TH';
  } else if (currentValue < 1 && currentUnit === 'GH') {
    while (currentValue < 1 && currentUnit !== 'ZH') {
      currentValue *= 1000;
      currentUnit = Object.keys(HashUnitEnum)[Object.values(HashUnitEnum).indexOf(HashUnitEnum[currentUnit]) + 1] as HashRateUnitType;
    }
  } else {
    while (currentValue >= 1000 && currentUnit !== 'ZH') {
      currentValue /= 1000;
      currentUnit = Object.keys(HashUnitEnum)[Object.values(HashUnitEnum).indexOf(HashUnitEnum[currentUnit]) - 1] as HashRateUnitType;
    }
  }

  return {
    unit: `${currentUnit}/s`,
    value: currentValue.toFixed(2)
  };
};

export default getHashRate