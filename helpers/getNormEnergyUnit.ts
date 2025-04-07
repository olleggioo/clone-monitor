import { EnergyUnitEnum } from '@/interfaces/enums'

export type EnergyUnitType = keyof typeof EnergyUnitEnum;

const getNormEnergyUnit = (
    energy: number | string,
    from: EnergyUnitType,
    to: EnergyUnitType
  ) => {
    if (typeof energy === 'string') {
      energy = Number(energy);
    }
  
    const valueFrom = Number(EnergyUnitEnum[from]);
    const valueTo = Number(EnergyUnitEnum[to]);
  
    if (valueFrom < valueTo) {
      const dif = valueTo / valueFrom;
      return {
        unit: to,
        value: (energy / dif).toLocaleString('en-US', {
          maximumFractionDigits: 2
        })
      };
    } else {
      const dif = valueFrom / valueTo;
      return {
        unit: to,
        value: (energy * dif).toLocaleString('en-US', {
          maximumFractionDigits: 2
        })
      };
    }
  };
  
  export default getNormEnergyUnit;