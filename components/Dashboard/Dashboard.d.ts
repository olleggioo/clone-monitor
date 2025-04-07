import { ReactNode } from 'react'
import { HeadingTagNameType } from '@/ui/Heading/Heading'

export interface DashboardI {
  title?: string
  titleTagName?: HeadingTagNameType
  linkText?: string
  linkHref?: string
  children?: ReactNode
  style?: any
  className?: string
  description?: string | any
  sideComp?: any
  headerTable?: any
}
