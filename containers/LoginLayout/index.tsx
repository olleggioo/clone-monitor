import { FC, ReactNode } from 'react'
import Image from 'next/image'
import styles from './LoginLayout.module.scss'
import { useAtom } from 'jotai'
import { deviceAtom } from '@/atoms'
import { useScaling } from '@/hooks'

const LoginLayout: FC<{ children?: ReactNode }> = ({ children }) => {
  const [device] = useAtom(deviceAtom)
  const isDesktop = device === 'desktop'

  useScaling()

  return (
    <>
      <div className={styles.el}>
        <div className={styles.logo}>
          <Image
            src="/promminer-logo-white.svg"
            width="199"
            height="40"
            alt="Promminer logo"
          />
        </div>

        <div className={styles.form}>{children}</div>
      </div>
      <div id="modal-root" />
    </>
  )
}

export default LoginLayout
