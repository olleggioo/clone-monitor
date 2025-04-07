import {
  UserI,
  DeviceI,
  DeviceAreaI,
  DeviceStatusI,
  DataPointI,
  ChartPeriodType
} from '@/interfaces'
import { atom } from 'jotai'

export interface StatsDataStateI {
  users: UserI[]
  area: DeviceAreaI[]
  devices: DeviceI[]
  algorithms: DeviceAreaI[],
  uptimeData: {
    uptime: number
    algorithm: string | null
  }
  efficiencyData: {
    efficiency: number,
    algorithm: string | null
  }
  statusStats: DeviceStatusI[]
  count: {
    total: number
  },
  model: DeviceAreaI[]
  status: any[]
  sumEnergy: any[]
  ranges: any[]
}

export interface StatsFilterStateI {
  area: string | null
  client: string | null
  algorithm: string | null
  model: string | null
  status: string | null
  ranges: string | null
}

export interface StatsEnergyStateI {
  value: string
  unit: string
}

export const statsDataInitialState: StatsDataStateI = {
  users: [],
  area: [],
  devices: [],
  algorithms: [],
  uptimeData: {
    uptime: 0,
    algorithm: null,
  },
  efficiencyData: {
    efficiency: 0,
    algorithm: null,
  },
  statusStats: [],
  count: {
    total: 0
  },
  model: [],
  status: [],
  sumEnergy: [],
  ranges: []
}

export const statsFilterInitialState: StatsFilterStateI = {
  area: null,
  client: null,
  algorithm: null,
  model: null,
  status: null,
  ranges: null
}

export const statsEnergyInitialState: StatsEnergyStateI = {
  value: "0",
  unit: "TH/s"
}

// export const statsEnergyDashboard
export const statsDataAtom = atom<StatsDataStateI>(statsDataInitialState)
export const statsFilterAtom = atom<StatsFilterStateI>(statsFilterInitialState)
export const statsEnergyAtom = atom<StatsEnergyStateI>(statsEnergyInitialState)
export const statsEnergyFromCharts = atom<any[]>([
  {
    createdAt: "",
    value: 0
  }
])

export const sumEnergyFromCharts = atom<any[]>([])
export const dateCharts = atom<any>({
  from: null
})
export const zoomLevel = atom<any>(null)
export const atomChartType = atom<ChartPeriodType>("day");
export const atomEnergyWeekMonth = atom<DataPointI[]>([])
export const atomPeriodFromToCharts = atom<[any, any]>([null, null])
export const atomPeriodFromToChartsStats = atom<[any, any]>([null, null])
export const atomDataDevice = atom<DeviceI | null>(null)