import { ReactNode } from 'react'

export interface DropdownItemI {
  text: string
  icon: ReactNode
  onClick: (value?: string) => void
  mod?: 'red',
  value?: Boolean,
}

export interface DropdownI {
  id?: string
  items: DropdownItemI[]
  className?: string
}
