import { DataPoint } from '@/interfaces/chart'
import { ChartPeriodType } from '@/interfaces'

export type ChartDataType =
  | 'hashrate'
  | 'temperature'
  | 'consumption'
  | 'fans'
  | 'uptime'

export interface ChartI {
  className?: string
  chartData: DataPoint[]
  dataType?: ChartDataType
  period?: ChartPeriodType
  algorithm?: string
  title?: string
  loading?: boolean
  filterParams?: any
  chartRef?: any
  date?: any
  setDate?: any
}
