import { ReactNode } from 'react'
import { PageI, PageRolledI, PagesTitlesRolledType, PagesTitlesType } from '@/interfaces/common'

interface NavItemI {
  title: PagesTitlesType | PagesTitlesRolledType
  href: string
  icon?: ReactNode
  selected?: boolean
}

export interface NavListI {
  pages: PageI[] | PageRolledI[]
  className?: string
}
