import { ChangeEvent, useState } from 'react'
import { regExpPatterns } from '@/data'
import { OptionItemI } from '@/ui/CustomSelect/CustomSelect'
import { UserModalFieldType, UserModalStateI } from '../UserModal'
import { useAtom } from 'jotai'
import { rolesListAtom } from '@/atoms'

const useClientModalState = (initialState: UserModalStateI, roles?: any) => {
  const [state, setState] = useState<UserModalStateI>(initialState)

  const { fullname = '', email, roleId, phone } = state
  const canSubmit =
    fullname.length > 2 &&
    regExpPatterns.email.test(email) &&
    roleId !== 'default'
    // && phone.length >= 12

    const handleChange = (field: UserModalFieldType, value: string | null | boolean) => {
    setState((prevState) => {
      return {
        ...prevState,
        [field]: value
      }
    })
  }

  const handleNameChange = (evt: ChangeEvent<HTMLInputElement>) => {
    handleChange('fullname', evt.target.value)
  }

  const handlePhoneChange = (evt: ChangeEvent<HTMLInputElement>) => {
    handleChange('phone', `+${evt.target.value.match(/\d/g)?.join('')}`)
  }

  const handleEmailChange = (evt: ChangeEvent<HTMLInputElement>) => {
    handleChange('email', evt.target.value)
  }

  const handleRoleChange = (option: OptionItemI) => {
    handleChange('roleId', option.value)
    handleChange('role', roles.filter((item: any) => item.id === option.value)[0])
  }

  return {
    state,
    canSubmit,
    handleNameChange,
    handleEmailChange,
    handleRoleChange,
    handlePhoneChange
  }
}

export default useClientModalState
