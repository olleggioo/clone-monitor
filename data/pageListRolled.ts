import { PagesEnum, PagesRolledClientsEnum, PagesRolledEnum } from '@/interfaces/enums'
import { PageI, PageRolledI, PagesRolledType, PagesType } from '@/interfaces/common'

const pagesRolledNavList = Object.entries(PagesRolledEnum).map(([key, value]): PageRolledI => {
  return {
    name: key as PagesRolledType,
    title: value
  }
})

export const pagesRolledClientsNavList = Object.entries(PagesRolledClientsEnum).map(([key, value]): PageRolledI => {
  return {
    name: key as PagesRolledType,
    title: value
  }
})

export default pagesRolledNavList
