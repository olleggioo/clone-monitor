import { ChangeEvent, FC, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import styles from './Verification.module.scss'

import { ErrorPopup } from '@/components'

import { Heading, Button, MaskedField } from '@/ui'
import { userAPI } from '@/api'
import { LoginLayout } from '@/containers'
import { useInterval } from '@/hooks'
import moment from 'moment'
import { refreshUser } from '@/helpers'

const Verification: FC = () => {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [count, setCount] = useState(240)

  useInterval(
    () => {
      setCount(count - 1)
    },
    count ? 1000 : null
  )

  const handleCodeChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setCode(evt.target.value)
  }

  const handleSubmitClick = () => {
    userAPI
      .verifyUser(code)
      .then((res) => {
        // refreshUser(res)
        router.push('/statistics')
      })
      .catch((error) => {
        const message = error?.response?.data?.message
        if (message) {
          setError(message)
        } else if (error.code === 'ERR_NETWORK') {
          setError('Ошибка сети')
        } else {
          console.error(error)
        }
      })
  }

  const handleResentClick = () => {
    setCount(240)
  }

  const countString = useMemo(
    () => moment(count * 1000).format('m:ss'),
    [count]
  )

  return (
    <LoginLayout>
      <div className={styles.head}>
        <Heading size="lg" text="Подтверждение" />
        <p className={styles.text}>
          На ваш номер отправлена смс с кодом. Введите его в поле ниже для
          входа.
        </p>
      </div>

      <div className={styles.field}>
        <MaskedField
          value={code}
          mask="9999999999"
          maskChar=""
          mod="border"
          placeholder="Код из смс"
          onChange={handleCodeChange}
          className={styles.field}
        />
        {count ? (
          <p className={styles.countdown}>
            Повторно отправить код можно через {countString}
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResentClick}
            className={styles.resent_btn}
          >
            Отправить код повторно
          </button>
        )}
      </div>

      <Button
        title="Войти"
        onClick={handleSubmitClick}
        disabled={code.length < 6}
      />
      {error && <ErrorPopup text={error} />}
    </LoginLayout>
  )
}
export default Verification
