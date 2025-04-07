import { FC } from 'react'
import { WarningI } from './Warning'
import styles from './Warning.module.scss'
import { IconAlertTriangle } from '@/icons'

const Warning: FC<WarningI> = ({ text }) => {
  return (
    <div className={styles.el}>
      <IconAlertTriangle width={24} height={24} />
      <span className={styles.text}>{text}</span>
    </div>
  )
}

export default Warning
