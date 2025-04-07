import { FC, useState } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import styles from '../UserModal.module.scss'
import { Roles, RoleName } from '@/const'
import { rolesListAtom, usersListAtom } from '@/atoms'
import { userAPI } from '@/api'
import { IconPlus } from '@/icons'
import { Dialog } from '@/components'
import { Button, CustomSelect, Field, MaskedField } from '@/ui'
import { AddUserModalStateI, UserModalI } from '../UserModal'
import useUserModalState from './useUserModalState'
import { generatePassword } from '@/hooks/generatePassword'
import { useSnackbar } from 'notistack'

const placeholderOption = { label: 'Выберите роль', value: null }

const initialState: AddUserModalStateI = {
  login: '',
  password: '',
  fullname: '',
  email: '',
  roleId: undefined,
  phone: ''
}

const AddUsersModal: FC<UserModalI> = ({ onClose }) => {
  const {
    state,
    canSubmit,
    handleLoginChange,
    handlePasswordChange,
    handleNameChange,
    handleEmailChange,
    handleRoleChange,
    hanldePhoneChange,
    handleSetGeneratePassword,
    handleContractChange
  } = useUserModalState(initialState)
  const { login, password, fullname = '', email, roleId, phone, contract = '' } = state
  const [roles, setRoles] = useAtom(rolesListAtom)
  const [generatedPassword, setGeneratedPassword] = useState('');

  const options = Object.entries(roles)
  .filter((entry) => entry[0] !== RoleName.Client)
  .map((entry) => ({ label: entry[1].name, value: entry[1].id }))
  .filter((entry) => entry.value !== process.env.ROLE_BOX_ID)
  .map((entry: {
    label: RoleName
    value: string
  }) => ({
    label: Roles[entry.label] || entry.label,
    value: entry.value 
  }))

  const roleOption = roleId
    ? { label:  options.filter((item) => item.value === roleId)[0].label, value: roleId }
    : placeholderOption

  const setUsers = useSetAtom(usersListAtom)
  
  const handleGeneratePassword = () => {
    const password = generatePassword();
    setGeneratedPassword(password);
    handleSetGeneratePassword(password);
  };

  const handlePasswordChanges = (event: any) => {
    handleSetGeneratePassword(event.target.value);
  };
  const {enqueueSnackbar} = useSnackbar()
  const updateUsersList = () => {
    userAPI
      .getUsers({
        relations: {
          role: true,
        },
        limit: 999
      })
      .then((res) => {
        setUsers(res.rows)
      })
      .catch(error => {
        if (error && error.response && error.response.data) {
          const errors = error.response.data.message;
          console.log(errors)
          // errors.forEach((item: string) => {
              enqueueSnackbar(errors, {
                  variant: 'error',
                  autoHideDuration: 3000
              });
          // });
        }
      })
  }


  const handleSubmit = () => {
    const data: any = {
        login, password, fullname, email, roleId, phone
    }

    if(contract.length !== 0) {
        data.contract = contract
    }
    userAPI
      .createUser(data)
      .then(() => {
        updateUsersList()
        onClose()
      })
      .catch(error => {
        if (error && error.response && error.response.data) {
          const errors = error.response.data.message;
          console.log(errors)
          // errors.forEach((item: string) => {
            enqueueSnackbar(errors, {
              variant: 'error',
              autoHideDuration: 3000
            });
          // });
        }
      })
  }

  return (
    <Dialog
      title="Добавить пользователя"
      onClose={onClose}
      closeBtn
      className={styles.el}
    >
      <div className={styles.form}>
        <Field label="Логин" value={login} onChange={handleLoginChange} />
        <Field
          label="Пароль"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <Button 
          onClick={handleGeneratePassword}
          title="Сгенерировать пароль"
          className={styles.generatePassword}
        />
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
          onChange={hanldePhoneChange}
          mask="+7 (999) 999 99 99"
          maskChar=""
        />
        <Field
          label="Номер договора (опционально)"
          value={contract}
          onChange={handleContractChange}
        />
        <CustomSelect
          label="Роль"
          placeholder={placeholderOption}
          options={options}
          selectedOption={roleOption}
          onChange={handleRoleChange}
        />
      </div>
      <Button
        title="Добавить"
        icon={<IconPlus width={22} height={22} />}
        onClick={handleSubmit}
        className={styles.submit}
        disabled={!canSubmit}
      />
    </Dialog>
  )
}

export default AddUsersModal
