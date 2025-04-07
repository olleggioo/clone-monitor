import { HashRateType, RejectRateType } from '@/interfaces/api'

export interface ChartDataPoints {
  status: string
  points: DataPointI[]
}
export interface DataPointI {
  createdAt: string
  value: number
}
