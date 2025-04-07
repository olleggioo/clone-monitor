import { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react'

export type FieldType = 'text' | 'email' | 'password' | 'number' | 'editable' | 'file'

export interface FieldI extends InputHTMLAttributes<T> {
  label?: string
  error?: boolean
  type?: FieldType
  disabled?: boolean
  icon?: ReactNode
  onChange?: (evt: ChangeEvent<HTMLInputElement>) => void
  className?: string
  wrapClassname?: string
  closeIcon?: ReactNode
  closeIconButton?: any
}

export interface FieldFileI extends InputHTMLAttributes<T> {
  label?: string
  error?: boolean
  type?: FieldType
  disabled?: boolean
  icon?: ReactNode
  onChange?: any
  className?: string
  wrapClassname?: string
  closeIcon?: ReactNode
  closeIconButton?: any
}
