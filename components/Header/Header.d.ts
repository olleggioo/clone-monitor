import { ReactNode } from 'react'
import { StatusI } from '@/ui/Status/Status'

export interface HeaderI {
  title?: string
  // status?: StatusI
  status?: any
  controlsBlock?: ReactNode
  onBackClick?: () => void
  actions?: ReactNode
  algorithm?: string
}
