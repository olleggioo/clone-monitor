import { UserI } from '@/interfaces/user'
import { DataPointI } from '@/interfaces/chart'

export interface BoardI {
  chipNum: number
  freq: number
  rateIdeal: number
  rateReal: number
  sn: string
  tempChip: number
  tempOutlet: number
}

export interface PoolI {
  id: string
  deviceId: string
  poolId: string
  pool: PoolInnerI
}

interface PoolInnerI {
  id: string
  name: string
  user: string
  url: string
}

export interface FanI {
  pwm: number
  value: number
}

export interface FirmwareStatusI {
  fans: {
    code: number
    text: string
  }
  network: {
    code: number
    text: string
  }
  rate: {
    code: number
    text: string
  }
  temp: {
    code: number
    text: string
  }
}

export interface UptimeI {
  days: number
  elapsed: number
  hours: number
  minutes: number
  seconds: number
}

export interface WorkerI {
  id: string
  name: string
  url: string
}

export interface PoolI {
  id: string
  name: string
  url: string
  user?: string
}

export interface DevicePoolI {
  id: string
  deviceId: string
  poolId: string
  pool?: PoolI
}

export interface DeviceAreaRangeIpsI {
  id: string
  name: string
  rangeips: [
    {
      id: string
      from: string
      to: string
      areaId: string
    }
  ]
}

export interface FirmwareDataI {
  modelId: string
  algorithm: string
  boards: BoardI[]
  fan: FanI[]
  firmware: string
  macaddr?: string
  rateAvg: number
  rateNow: number
  rateRecently: number
  status: FirmwareStatusI
  uptime: UptimeI
  voltage: number
  worker: string
}

interface CommentI {
  id: string
  deviceId: string
  userId: string
  message: string
  createdAt: string
  updatedAt: string
}

export interface DeviceI {
  algorithmId?: string
  replacedDeviceId: string
  algorithm: DeviceModelI
  id: string
  area?: DeviceAreaI
  ownerId: string
  areaId: string
  location?: string
  deviceLogs?: any
  isDisabled?: any
  changePoolStatusVerbose: string
  currentEnergy?: string
  currentRate?: string
  lastSeenNormal?: string
  rack?: string
  shelf?: string
  place?: string
  comment?: string
  modelId?: string
  partNumber?: string
  nominalEnergy: number
  nominalHashrate: number
  ipaddr: string
  rangeipId?: string
  rejectedPollsProcents?: string
  macaddr?: string
  sn?: string
  snbp?: string
  uptime?: number
  status?: DeviceStatusI
  statusId: string
  deviceUsers?: DeviceUserI[]
  isGlued: boolean
  isReserved: boolean
  deviceWorkerId?: string
  deviceWorker?: WorkerI
  devicePools: DevicePoolI[]
  rangeip?: any
  createdAt?: string
  isFlashed?: boolean
  // firmwareData?: FirmwareDataI
  deviceFan: any[]
  deviceBoards?: any[]
  model: DeviceModelI
  userId?: string
  userFullname: string
  userEmail: string
  userLogin: string
  userPhone: string
  userRoleId: string
  userContract: string
  uptimeElapsed: number
  listLog: any
  notOnlinedAt: any
  sumEnergyMonth?: {
    unit: string
    value: string
  }
  uptimeTotal: number
  deviceComments: CommentI[]
  userDevices?: {
    id: string
    deviceId: string
    userId: string
    user: UserI
  }[]
}

export interface DeviceModelI {
  id: string
  name: string
}

export interface DeviceAlgorithmI {
  id: string
  name: string
  devices: number
  consumption: number
  hashrate: number
}

export interface CreateDeviceFieldsI {
  accessToken: string | null
  algorithmId: string
  modelId?: string
  deviceWorkerId?: string
  ipaddr: string
  macaddr?: string
  areaId?: string
  sn?: string
  snbp?: string
  location?: string
  rack?: string
  shelf?: string
  comment?: string
  nominalHashrate?: number
  statusId?: string
  uptime?: number
  userId?: string
  isGlued?: boolean
  replacedDeviceId?: string
}

export interface DeviceResI {
  rows: DeviceI[]
  total: number
}

export interface DeviceAccessI {
  id?: string
  protocol: 'web' | 'ssh'
  login: string
  password: string
  port: number
  deviceId: string
}

export interface DeviceAccessResI extends Pick<DeviceResI, 'total'> {
  rows: DeviceAccessI[]
}

export interface DeviceStatusI {
  id?: string
  name: string
  color?: string
  count?: number
  description: string
}

export interface DeviceStatusResI extends Pick<DeviceResI, 'total'> {
  rows: DeviceStatusI[]
}

export interface DeviceUserI {
  id?: string
  userId: string
  deviceId?: string
  user?: UserI
  device?: DeviceI
}

export interface DeviceUserResI extends Pick<DeviceResI, 'total'> {
  rows: DeviceUserI[]
}

export interface DeviceAreaI {
  id?: string
  name: string
  rangeips: any
}

export interface DeviceModelI {
  id: string
  name: string
  nominalEnergy: any
}

export interface DeviceAreaResI extends Pick<DeviceResI, 'total'> {
  rows: DeviceAreaI[]
}

export interface DeviceModelResI extends Pick<DeviceResI, 'total'> {
  rows: DeviceModelI[]
}

export interface DeviceConsumptionI extends DataPointI {
  id?: string
  deviceId?: string
  unit?: string
}

export interface DeviceConsumptionResI extends Pick<DeviceResI, 'total'> {
  rows: DeviceConsumptionI[]
}

export interface DeviceFanI extends DataPointI {
  id?: string
  deviceId?: string
  unit?: string
}

export interface DeviceFanResI extends Pick<DeviceResI, 'total'> {
  rows: DeviceFanI[]
}

export interface DeviceHashRateI extends DataPointI {
  id?: string
  deviceId?: string
  unit?: string
}

export interface DeviceHasRateResI extends Pick<DeviceResI, 'total'> {
  rows: DeviceHashRateI[]
}

export interface DeviceTemperatureI extends DataPointI {
  id?: string
  deviceId?: string
  unit?: string
}
export interface DeviceTemperatureResI extends Pick<DeviceResI, 'total'> {
  rows: DeviceTemperatureI[]
}

export interface DeviceStatusStatsI {
  [x: string]: number
}

export interface LogHashrateItemI {
  createdAt?: string
  amount?: number
  value?: number
  modelId?: string
  areaId?: string
  nominalHashrate?: number
  nominalEnergy?: number
  algorithm?: string
  deviceWorkerId?: string
  location?: string
  rack?: string
  shelf?: string
  place?: string
  userId?: string
}

export interface LogHashrateI {
  rows: LogHashrateItemI[]
}
