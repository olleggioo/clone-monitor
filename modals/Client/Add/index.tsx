import { FC, useState } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import styles from '../ClientModal.module.scss'
import { RoleName } from '@/const'
import { rolesListAtom, usersListAtom } from '@/atoms'
import { userAPI } from '@/api'
import { IconPlus } from '@/icons'
import { Button, Field, MaskedField } from '@/ui'
import { Dialog } from '@/components'
import { AddClientModalStateI, ClientModalI } from '../ClientModal'
import useClientModalState from './useClientModalState'
import { useSnackbar } from 'notistack'
import { generatePassword } from '@/hooks/generatePassword'

const initialState: AddClientModalStateI = {
  login: '',
  password: '',
  fullname: '',
  email: '',
  phone: '',
  contract: ''
}

const AddClientModal: FC<ClientModalI> = ({ onClose }) => {
  const {
    state,
    canSubmit,
    handleLoginChange,
    handlePasswordChange,
    handleNameChange,
    handleEmailChange,
    handlePhoneChange,
    handleContractChange,
    handleSetGeneratePassword
  } = useClientModalState(initialState)
  const { login, password, fullname = '', email, phone, contract } = state
  const [roles, setRoles] = useAtom(rolesListAtom)
  const [generatedPassword, setGeneratedPassword] = useState('');
  const {enqueueSnackbar} = useSnackbar()
  const setUsers = useSetAtom(usersListAtom)

  const handleGeneratePassword = () => {
    const password = generatePassword();
    setGeneratedPassword(password);
    handleSetGeneratePassword(password);
  };

  const handlePasswordChanges = (event: any) => {
    handleSetGeneratePassword(event.target.value);
  };
  
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
          enqueueSnackbar(errors, {
            variant: 'error',
            autoHideDuration: 3000
          });
        }
      })
  }
  const handleSubmit = () => {
    userAPI
      .createUser({
        login,
        password,
        fullname,
        email,
        phone,
        contract,
        roleId: roles.filter(item => item.name === "Member")[0].id
      })
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
          onChange={handlePasswordChanges}
        />
        <Button 
          onClick={handleGeneratePassword}
          title="Сгенерировать пароль"
          className={styles.generatePassword}
        />
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
        title="Добавить"
        icon={<IconPlus width={22} height={22} />}
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={styles.submit}
      />
    </Dialog>
  )
}

export default AddClientModal
