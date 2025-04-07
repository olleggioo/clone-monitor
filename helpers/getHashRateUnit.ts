import { HashUnitEnum } from '@/interfaces/enums'
import { HashRateUnitType } from '@/interfaces'

const getHashRateUnit = (
  value: number | string,
  from: HashRateUnitType,
  to: HashRateUnitType
) => {
  if (typeof value === 'string') {
    value = Number(value)
  }
  const valueFrom = Number(HashUnitEnum[from])
  const valueTo = Number(HashUnitEnum[to])
  if (valueFrom < valueTo) {
    const dif = valueTo / valueFrom
    return {
      unit: `${to}/s`,
      value: (value / dif).toFixed(2)
    }
  } else {
    const dif = valueFrom / valueTo
    return {
      unit: `${to}/s`,
      value: (value * dif).toFixed(2).toString()
    }
  }
}

export default getHashRateUnit
