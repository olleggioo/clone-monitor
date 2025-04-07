import { DevicesFormFieldsetI } from '@/data/devicesForms'
import { DevicesFormValues } from '@/hooks/useDeviceForm'
import { OptionItemI } from '@/ui/CustomSelect/CustomSelect'

export interface FormFieldsetsI {
  fields: DevicesFormFieldsetI[]
  values: DevicesFormValues
  handleUpdateState: (key: string, value: string | OptionItemI) => void
  handleChangeInput: (e: ChangeEvent<HTMLInputElement>) => void
  handleSearchValue?: any
  style?: any
  required?: boolean
  onBlur?: (e: any) => void
}
