import { DevicesFormFieldsetI } from '@/data/devicesForms'
import { DevicesFormValues } from '@/hooks/useDeviceForm'
import { OptionItemI } from '@/ui/CustomSelect/CustomSelect'

export interface FormDeviceUsers {
  fields: DevicesFormFieldsetI
  values: DevicesFormValues
  handleUpdateState: (key: string, value: string | OptionItemI) => void
}
