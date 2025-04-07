import { ChangeEvent, useState } from 'react'
import { regExpPatterns } from '@/data'
import { AddClientModalStateI, ClientFieldType } from '../ClientModal'

const useClientModalState = (initialState: AddClientModalStateI) => {
  const [state, setState] = useState<AddClientModalStateI>(initialState)
  const { login, password, fullname = '', phone, email, contract = '' } = state

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
    contract.length &&
    phone.length >= 12

  const handleChange = (field: ClientFieldType, value: string) => {
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

  const handleEmailChange = (evt: ChangeEvent<HTMLInputElement>) => {
    handleChange('email', evt.target.value.trim())
  }

  const handlePhoneChange = (evt: ChangeEvent<HTMLInputElement>) => {
    handleChange('phone', `+${evt.target.value.match(/\d/g)?.join('')}`)
  }

  const handleContractChange = (evt: ChangeEvent<HTMLInputElement>) => {
    handleChange('contract', evt.target.value.trim())
  }

  return {
    state,
    canSubmit,
    handleLoginChange,
    handlePasswordChange,
    handleNameChange,
    handleEmailChange,
    handlePhoneChange,
    handleContractChange,
    handleSetGeneratePassword
  }
}

export default useClientModalState
