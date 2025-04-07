import { atom } from 'jotai'
import {
  DeviceAccessI,
  DeviceAreaI,
  DeviceResI,
  DeviceStatusI,
  DeviceUserI,
  UserI
} from '@/interfaces'
import { ModelReqI } from '@/containers/Models'

export interface DevicesDataStateI {
  devices: DeviceResI
  statuses?: DeviceStatusI[]
  users?: UserI[]
  access?: DeviceAccessI[]
  area?: DeviceAreaI[]
  algorithms?: string[]
  models?: string[]
  names?: string[]
}

export interface RoleDataStateI {
  rows: RoleRowsDataStateI[]
  total: number
}

export interface RoleRowsDataStateI {
  id: string
  name: string
  roleAccesses: RoleAccessesStateI[]
}

export interface RoleAccessesStateI {
  accessId: string
  id: string
  roleId: string
  access: AccessStateI
}

export interface AccessStateI {
  id: string
  name: string
  description: string
}

export interface DevicesExportStateI {
  client: any | null
  table: any | null
  datesHidden: boolean
  notNecessaryHidden: boolean
  generatePrice: boolean
  byUser: boolean
}

export interface DevicesFilterStateI {
  client: any[] | null | any
  owner: any[] | null | any
  area: any[] | null
  algorithm: any[] | null
  status: any[] | null
  model: any[] | null
  ip: string | any
  partNumber: string | any
  sn: string | any
  mac: string | any
  pool: string
  worker: string
  page: number
  from: string
  to: string
  name: any[] | null
  isFlashed: boolean | null
  isGlued: boolean | null
  isDisabled: boolean | null,
  comment: string
  place: string
}

export interface DeviceRangeIp {
  area: string | null
  from: string
  to: string
  name: string
}

export interface DevicesUserIdFilterStateI {
  id: string
  flag: boolean
}

export const devicesDataInitialState: DevicesDataStateI = {
  devices: {
    rows: [],
    total: 0
  },
  statuses: [],
  users: [],
  access: [],
  area: [],
  algorithms: [],
  models: [],
  names: []
}

export const devicesArchiveDataInitialState: DevicesDataStateI = {
  devices: {
    rows: [],
    total: 0
  },
  statuses: [],
  users: [],
  access: [],
  area: [],
  algorithms: [],
  models: [],
  names: []
}

export const devicesExportInitialState: any = {
  client: null,
  table: null,
  datesHidden: false,
  notNecessaryHidden: false,
  generatePrice: false,
  byUser: false,
}

export const devicesFilterInitialState: DevicesFilterStateI = {
  client: [],
  owner: [],
  area: [],
  algorithm: [],
  status: [],
  model: [],
  ip: '',
  sn: '',
  mac: '',
  pool: '',
  partNumber: '',
  worker: '',
  page: 1,
  from: '',
  to: '',
  name: [],
  isFlashed: null,
  isGlued: null,
  isDisabled: null,
  comment: '',
  place: '',
}

export const userFilterInitialState: {name: string, phone: string, contract: string} = {
  name: '',
  phone: '',
  contract: ''
}

export const devicesDataAtom = atom<DevicesDataStateI>(devicesDataInitialState)
export const devicesArchiveDataAtom = atom<DevicesDataStateI>(devicesArchiveDataInitialState)
export const devicesFilterAtom = atom<DevicesFilterStateI>(
  devicesFilterInitialState
)

export const devicesArchiveFilterAtom = atom<DevicesFilterStateI>(
  devicesFilterInitialState
)
export const usersFilterAtom = atom<{name: string, phone: string, contract: string}>(
  userFilterInitialState
)
export const devicesUserIdFilterAtom = atom<DevicesUserIdFilterStateI[]>([])
export const devicesUserIdMiningFilterAtom = atom<any[]>([])
export const deviceUserCheckedFilterAtom = atom<any>(false)
export const deviceTabsControlsAtom = atom<{id: string | null, value: string}>({id: null, value: "Все"})
export const deviceUpdateManyPool = atom<any>(false)
export const deviceUpdateRanges = atom<any>(false)
export const deviceUpdateAreasName = atom<any>(false)
export const areaRangesIp = atom<string>("")
export const accessIdAtom = atom<string>("")
export const poolMockAtom = atom<any>([])
export const areasAtom = atom<any>([])
export const filteredNamesAtom = atom<[]>([])
export const sortFilterAtom = atom<any>({})
export const sortUserFilterAtom = atom<any>({})
export const filteredNameContainer = atom<any>([])
export const areaFiltersTable = atom<any>([])
export const devicesUpdatesMany = atom<any>(false)
export const modalInfoAtom = atom<any>({
  open: false,
  action: '',
  status: '',
  textInAction: ''
})
export const statusInfoAtom = atom<any[]>([])
export const selectedItemSelectAtom = atom<any>([])
export const selectedInputAtom = atom<any>(false)
export const modalUpdateUserManyAtom = atom<any>(false)
export const modalUpdateOwnerManyAtom = atom<any>(false)
export const modalUpdateDisperseManyAtom = atom<any>(false)
export const modalMinStateAtom = atom<any>(false)
export const modalMinStateActionAtom = atom<any>(false)
export const sortConfigOptionsAtom = atom<{ key: string; direction: string } | null>(null)
export const changeManyMiningStateInUsers = atom<any>(false)
export const modalReserveDevice = atom<any>(false)
export const modelInfoAtom = atom<ModelReqI | null>(null)
export const checkedAtom = atom<any>([])
export const isReservedAtom = atom<{id: string, flag: boolean} | null>(null)