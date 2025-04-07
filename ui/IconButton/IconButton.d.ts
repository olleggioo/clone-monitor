import { ReactNode } from 'react'
export interface IconButtonI {
  ariaLabel?: string
  href?: string
  onClick?: () => void
  icon?: ReactNode
  title?: string
  appearance?: string
  className?: string
}
