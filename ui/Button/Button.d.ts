import { ReactNode } from 'react'

type ButtonAppearanceType =
  | 'default'
  | 'outlined'
  | 'inverted'
  | 'text'
  | 'table'
  | 'outlined-dark'
  | 'icon'

type ButtonType = 'button' | 'submit' | 'reset'

export interface ButtonI {
  title?: string
  href?: string
  type?: ButtonType
  appearance?: ButtonAppearanceType
  className?: string
  disabled?: boolean
  onClick?: (e?:any) => void
  children?: ReactNode
  icon?: ReactNode
  iconRight?: ReactNode
  loading?: boolean
}
