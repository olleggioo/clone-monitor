import { FC } from 'react'
import { useAtom } from 'jotai'
import styles from '../ClientModal.module.scss'
import type { UserI } from '@/interfaces'
import { usersListAtom } from '@/atoms'
import { userAPI } from '@/api'
import { IconSave } from '@/icons'
import { Button, Field, MaskedField } from '@/ui'
import { Dialog } from '@/components'
import { EditClientModalI } from '../ClientModal'
import useClientModalState from './useClientModalState'

const EditClientModal: FC<EditClientModalI> = ({ initialState, onClose }) => {
  const {
    state,
    canSubmit,
    handleNameChange,
    handleEmailChange,
    handlePhoneChange,
    handleContractChange
  } = useClientModalState(initialState)
  const { fullname, email, phone, contract } = state

  const [users, setUsers] = useAtom(usersListAtom)
  const updateUsersList = () => {
    const currentUserIndex = users.findIndex((item) => item.id === state.id)

    setUsers([
      ...users.slice(0, currentUserIndex),
      state as UserI,
      ...users.slice(currentUserIndex + 1)
    ])
  }

  const handleSubmit = () => {
    const dataUsers: any = {
      email,
      fullname,
      contract
    }
    if(phone !== "") {
      dataUsers.phone = phone
    }
    userAPI
      .updateUser(state.id || '', dataUsers)
      .then(() => {
        updateUsersList()
        onClose()
      })
      .catch(console.error)
  }

  return (
    <Dialog
      title="Редактировать пользователя"
      onClose={onClose}
      closeBtn
      className={styles.el}
    >
      <div className={styles.form}>
        <Field
          label="ФИО"
          value={fullname}
          onChange={handleNameChange}
        />
        <Field label="Email" value={email} onChange={handleEmailChange} />
        <MaskedField
          label="Номер телефона"
          value={phone}
          onChange={handlePhoneChange}
          mask="+7 (999) 999 99 99"
          maskChar=""
        />
        <Field
          label="Номер договора"
          value={contract}
          onChange={handleContractChange}
        />
      </div>
      <Button
        title="Сохранить"
        icon={<IconSave width={22} height={22} />}
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={styles.submit}
      />
    </Dialog>
  )
}

export default EditClientModal
