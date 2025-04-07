import { ChangeEvent, FC, KeyboardEvent, useState } from 'react'
import { useRouter } from 'next/router'
import { LoginStateI } from './Login'
import styles from './Login.module.scss'

import { ErrorPopup } from '@/components'
import { IconLock, IconPhone, IconUser } from '@/icons'
import { Heading, Field, Button, MaskedField } from '@/ui'

import { useAtom } from 'jotai'
import { userAPI } from '@/api'
import { userAtom } from '@/atoms'
import { refreshUser } from '@/helpers'
import { LoginLayout } from '@/containers'

const initialState: LoginStateI = {
  login: '',
  password: ''
}

const Login: FC = () => {
  const router = useRouter()
  const [error, setError] = useState('')
  const [{ login, password }, setState] = useState<LoginStateI>(initialState)
  const [, setUser] = useAtom(userAtom)

  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      ...prev,
      login: e.target.value
    }))
    setError('')
  }

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      ...prev,
      phone: e.target.value
    }))
    setError('')
  }

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      ...prev,
      password: e.target.value
    }))
    setError('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmitClick()
    }
  }

  const handleSubmitClick = () => {
    userAPI
      .loginUser({
        login,
        password
      })
      .then((res) => {
        refreshUser(res)
        setUser(res)
        router.push('/statistics')
      })
      .catch((error) => {
        const message = error?.response?.data?.message
        if (message) {
          if (message === 'User is not verified.') {
            router.push('/login/verification')
          } else {
            setError(message)
          }
        } else if (error.code === 'ERR_NETWORK') {
          setError('Ошибка сети')
        } else {
          console.error(error)
        }
      })
  }

  return (
    <LoginLayout>
      <Heading size="lg" text="Вход" className={styles.title} />

      <div className={styles.fields}>
        {/*<MaskedField*/}
        {/*  value={phone}*/}
        {/*  onChange={handlePhoneChange}*/}
        {/*  mask="+7 999 999 99 99"*/}
        {/*  maskChar=""*/}
        {/*  icon={<IconPhone width={24} height={24} />}*/}
        {/*  placeholder="+7 999 999 99 99"*/}
        {/*  mod="border"*/}
        {/*/>*/}

        <Field
          value={login}
          onChange={handleLoginChange}
          icon={<IconUser width={24} height={24} />}
          error={!!error}
          placeholder="Логин"
        />

        <Field
          value={password}
          placeholder="Пароль"
          type="password"
          autoComplete="new-password"
          icon={<IconLock width={24} height={24} />}
          onChange={handlePasswordChange}
          onKeyDown={handleKeyDown}
          error={!!error}
        />
      </div>

      <Button
        title="Войти"
        onClick={handleSubmitClick}
        disabled={login.length < 3 || password.length < 3}
      />
      {error && <ErrorPopup text={error} />}
    </LoginLayout>
  )
}
export default Login
