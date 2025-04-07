import { FC } from 'react'
import { IncDecButtonI } from './IncDecButton'
import styles from './IncDecButton.module.scss'
import ChevronDown from '@/icons/ChevronDown'
import classNames from 'classnames'

const IncDecButton: FC<IncDecButtonI> = ({
  onIncClick,
  onDecClick,
  className
}) => {
  return (
    <div className={classNames(styles.el, className)}>
      <button
        type="button"
        onClick={onIncClick}
        aria-label="Уменьшить"
        className={classNames(styles.button, styles.inc)}
      >
        <ChevronDown width={20} height={20} />
      </button>
      <button
        type="button"
        onClick={onDecClick}
        aria-label="Увеличить"
        className={classNames(styles.button, styles.dec)}
      >
        <ChevronDown width={20} height={20} />
      </button>
    </div>
  )
}

export default IncDecButton
