import { ChangeEvent, useState } from 'react'
import { regExpPatterns } from '@/data'
import { ClientFieldType, ClientModalStateI } from '../ClientModal'

const useClientModalState = (initialState: ClientModalStateI) => {
  const [state, setState] = useState<ClientModalStateI>(initialState)
  const { fullname = '', phone, email, contract = '' } = state

  const canSubmit =
    fullname.length > 2 &&
    regExpPatterns.email.test(email)
    // contract.length &&
    // phone.length >= 12

  const handleChange = (field: ClientFieldType, value: string) => {
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

  const handleEmailChange = (evt: ChangeEvent<HTMLInputElement>) => {
    handleChange('email', evt.target.value.trim())
  }

  const handlePhoneChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const cleanedValue = evt.target.value.match(/\d/g)
    const formattedValue = cleanedValue ? `+${cleanedValue.join('')}` : '' // Проверяем на null перед использованием join
    handleChange('phone', formattedValue)
  }

  const handleContractChange = (evt: ChangeEvent<HTMLInputElement>) => {
    handleChange('contract', evt.target.value.trim())
  }

  return {
    state,
    canSubmit,
    handleNameChange,
    handleEmailChange,
    handlePhoneChange,
    handleContractChange
  }
}

export default useClientModalState
