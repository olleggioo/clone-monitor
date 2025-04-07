import {
  HashUnitEnum,
  MiningStatsEnum,
  PagesEnum,
  PagesRolledEnum,
  StatusEnum
} from '@/interfaces/enums'

export type StatusColorType = 'green' | 'orange' | 'grey' | 'red'
export type KeyValueObjType = {
  [x: string]: any
}

export type HashRateUnitType = keyof typeof HashUnitEnum

export type StatusType = keyof typeof StatusEnum
export type PagesType = keyof typeof PagesEnum | "roleAccess"
export type PagesRolledType = keyof typeof PagesRolledEnum
export type PagesTitlesType = `${PagesEnum}`
export type PagesTitlesRolledType = `${PagesRolledEnum}`
export type MiningStatsItemType = `${MiningStatsEnum}`

export interface StatusItemI {
  state: StatusType
  title: string
  correctTitle?: string
}

export interface PageI {
  name: PagesType | "roleAccess"
  title: PagesTitlesType | "Роли доступа"
}

export interface PageRolledI {
  name: PagesRolledType | "roleAccess"
  title: PagesTitlesRolledType | "Роли доступа"
}

export type ChartType = 'hashrate' | 'temperature' | 'consumption' | 'coolers'
export type ChartPeriodType = 'day' | 'week' | 'month'
