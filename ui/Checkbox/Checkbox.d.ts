import { ChangeEvent } from 'react'

type CheckboxAppearanceType = 'default' | 'small'

export interface CheckboxI {
  className?: string
  isChecked?: boolean
  isDisabled?: boolean
  isInvalid?: boolean
  isRequired?: boolean
  label: string
  name: string
  onChange?: (evt: ChangeEvent<HTMLInputElement>) => void
  type?: string
  value: string
  appearance?: CheckboxAppearanceType
  isReverse?: boolean
}
