import { PagesEnum, PagesEnumClients } from '@/interfaces/enums'
import { PageI, PagesType } from '@/interfaces/common'

const pagesNavList = Object.entries(PagesEnum).map(([key, value]): PageI => {
  return {
    name: key as PagesType,
    title: value
  }
})

export const pageNavListClients = Object.entries(PagesEnumClients).map(([key, value]): PageI => {
  return {
    name: key as PagesType,
    title: value
  }
})

export default pagesNavList
