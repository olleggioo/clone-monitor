import { FC } from 'react'
import { useAtom } from 'jotai'
import styles from '../UserModal.module.scss'
import type { UserI } from '@/interfaces'
import { Roles, RoleName } from '@/const'
import { rolesListAtom, usersListAtom } from '@/atoms'
import { userAPI } from '@/api'
import { IconSave } from '@/icons'
import { Button, CustomSelect, Field, MaskedField } from '@/ui'
import { Dialog } from '@/components'
import { EditUserModalI } from '../UserModal'
import useUserModalState from './useUserModalState'

const placeholderOption = { label: 'Выберите роль', value: null }
const options = Object.entries(Roles)
  .filter((entry) => entry[0] !== RoleName.Client)
  .map((entry) => ({ label: entry[1], value: entry[0] }))

const EditUserModal: FC<EditUserModalI> = ({ initialState, onClose }) => {
  const [roles, setRoles] = useAtom(rolesListAtom)
  const {
    state,
    canSubmit,
    handleNameChange,
    handleEmailChange,
    handleRoleChange,
    handlePhoneChange
  } = useUserModalState(initialState, roles)
  const { phone, fullname, email, roleId } = state
  const roleOption = roleId
    ? { label: roles.filter(item => item.id === roleId)[0].name, value: roleId }
    : placeholderOption
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
      roleId
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
          id="user-name"
          label="ФИО"
          value={fullname}
          onChange={handleNameChange}
        />
        <Field
          id="user-email"
          label="Email"
          value={email}
          onChange={handleEmailChange}
        />
        <MaskedField
          label="Номер телефона"
          value={phone}
          onChange={handlePhoneChange}
          mask="+7 (999) 999 99 99"
          maskChar=""
        />
        <CustomSelect
          label="Роль"
          placeholder={placeholderOption}
          options={roles.map((item: any) => {
            return {
              label: item.name,
              value: item.id
            }
          })}
          selectedOption={roleOption}
          onChange={handleRoleChange}
        />
      </div>
      <Button
        title="Сохранить"
        icon={<IconSave width={22} height={22} />}
        onClick={handleSubmit}
        className={styles.submit}
        disabled={!canSubmit}
      />
    </Dialog>
  )
}

export default EditUserModal
