import { ReactNode } from 'react'
import { Props as ReactInputMaskProps } from 'react-input-mask'

export interface MaskedFieldI extends ReactInputMaskProps {
  label?: string
  error?: boolean
  icon?: ReactNode
  className?: string
  mod?: string
}
