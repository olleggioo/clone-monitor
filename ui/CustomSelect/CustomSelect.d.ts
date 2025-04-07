export interface OptionItemI {
  value: string | null | boolean
  label: string
}

export interface SelectI {
  type?: any
  label?: string
  options: any
  selectedOption?: any
  placeholder?: any
  disabled?: boolean
  description?: string | null
  onChange?: any
  className?: string
  required?: boolean
  handleSearchValue?: any
  innerRef?: any
  disabled?: any
}
