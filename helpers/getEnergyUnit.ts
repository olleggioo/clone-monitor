import { EnergyUnitEnum } from '@/interfaces/enums'

const getEnergyUnit = (energy: number) => {
  for (const [unit, value] of Object.entries(EnergyUnitEnum)) {
    if (Number(value) <= energy) {
      return {
        unit,
        value: String(
          (energy / Number(value)).toLocaleString('en-US', {
            maximumFractionDigits: 2
          })
        )
      }
    }
  }
  return {
    unit: 'KW',
    value: String(
      (energy / 1000).toLocaleString('en-US', {
        maximumFractionDigits: 10
      })
    )
  }
}

export default getEnergyUnit
