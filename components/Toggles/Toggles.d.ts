import { ChartPeriodType } from '@/interfaces'

export interface TogglesI {
  items?: TogglesItemI[]
  onToggleClick: (type: ChartPeriodType) => void
  activeType: ChartPeriodType
  className?: string
}

export interface TogglesItemI {
  title: string
  type: ChartPeriodType
}
