import { FC, ReactNode } from 'react'
import styles from '@/components/Header/Header.module.scss'
import { HeaderI } from '@/components/Header/Header'
import { IconButton, Status } from '@/ui'
import { useRouter } from 'next/router'
import classNames from 'classnames'
import { deviceAtom } from '@/atoms'
import { useAtom } from 'jotai'

interface HeaderProps extends HeaderI {
  icon?: ReactNode
  setShow?: any
  back?: any
  className?: any
}

const Header: FC<HeaderProps> = ({ back, title, icon, status, controlsBlock, onBackClick, algorithm, setShow, className }) => {
  const router = useRouter()
  const [device] = useAtom(deviceAtom)
  const headerClass = classNames(styles.el, className)

  return (
    <header className={headerClass}>
      <div className={styles.inner}>
        <div className={styles.iconTitle}>
          {icon && <span className={styles.icon} onClick={() => setShow(true)}>{icon}</span>}
            {/* {back && <IconButton 
              className={styles.back}
              icon={<ArrowBackIosIcon />}
              onClick={() => router.back()}
            />} */}
          {title && <h1 className={styles.title}>{title}</h1>}
        </div>
        <div className={styles.statusAlgorithm}>
          {status && <Status {...status} className={styles.statusEl} />}
          <div>{algorithm && <span>Алгоритм <span className={styles.algorithm}>{algorithm}</span></span>}</div>
        </div>
      </div>
        {controlsBlock}
    </header>
  )
}

export default Header
