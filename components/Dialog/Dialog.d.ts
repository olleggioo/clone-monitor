import { ReactNode } from 'react'

export interface DialogI {
  title?: string
  wide?: boolean
  closeBtn?: boolean
  className?: string
  onClose?: () => void
  children?: ReactNode
}
