import { ChangeEvent, useState } from 'react'
import { regExpPatterns } from '@/data'
import { AddUserModalStateI, UserModalFieldType } from '../UserModal'
import { OptionItemI } from '@/ui/CustomSelect/CustomSelect'

const useClientModalState = (initialState: AddUserModalStateI) => {
  const [state, setState] = useState<AddUserModalStateI>(initialState)
  const { login, password, fullname = '', email, roleId, phone } = state
  
  const canSubmit =
    login.length > 2 &&
    login.length <= 255 &&
    password.length >= 8 &&
    password.length <= 100 &&
    // password.match(/\d/) &&
    // password.match(
    //   /^([A-Za-zА-Яа-я0-9\s~!?@#$%^&*_+()\[\]{}><\\\/|"'.,:;-]){0,}$/
    // ) &&
    fullname.length > 2 &&
    regExpPatterns.email.test(email) &&
    roleId !== 'default'
    phone.length >= 12

  const handleChange = (field: UserModalFieldType, value: string | null | boolean) => {
    setState((prevState) => {
      return {
        ...prevState,
        [field]: value
      }
    })
  }

  const handleSetGeneratePassword = (str: string) => {
    handleChange('password', str)
  }

  const handleLoginChange = (evt: ChangeEvent<HTMLInputElement>) => {
    handleChange('login', evt.target.value.trim())
  }

  const handlePasswordChange = (evt: ChangeEvent<HTMLInputElement>) => {
    handleChange('password', evt.target.value.trim())
  }

  const handleNameChange = (evt: ChangeEvent<HTMLInputElement>) => {
    handleChange('fullname', evt.target.value)
  }

  const handlePhoneChange = (evt: ChangeEvent<HTMLInputElement>) => {
    handleChange('phone', `+${evt.target.value.match(/\d/g)?.join('')}`)
  }

  const handleEmailChange = (evt: ChangeEvent<HTMLInputElement>) => {
    handleChange('email', evt.target.value.trim())
  }

  const hanldePhoneChange = (evt: ChangeEvent<HTMLInputElement>) => {
    handleChange('phone', `+${evt.target.value.match(/\d/g)?.join('')}`)
  }

  const handleRoleChange = (option: OptionItemI) => {
    handleChange('roleId', option.value)
  }

  return {
    state,
    canSubmit,
    handleLoginChange,
    handlePasswordChange,
    handleNameChange,
    handleEmailChange,
    handleRoleChange,
    hanldePhoneChange,
    handleSetGeneratePassword
  }
}

export default useClientModalState
