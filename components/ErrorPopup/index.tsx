import { FC, useState } from 'react'
import styles from './ErrorPopup.module.scss'
import classNames from 'classnames'
import { Heading } from '@/ui'
import { ErrorPopupI } from '@/components/ErrorPopup/ErrorPopup'
import { Portal } from '@/containers'
import { IconClose } from '@/icons'
import { useIsomorphicLayoutEffect } from '@/hooks'

const ErrorPopup: FC<ErrorPopupI> = ({
  text,
  className,
  onClose,
  isSuccess = false
}) => {
  const [visible, setVisible] = useState(true)
  const errorPopupClassname = classNames(
    styles.el,
    className,
    {
      [styles.visible]: visible
    },
    {
      [styles.isSuccess]: isSuccess
    }
  )

  useIsomorphicLayoutEffect((): (() => void) => {
    const handleKeyUp = (evt: any) => {
      const isEscape = evt.key === 'Escape'
      if (isEscape) {
        handlePopupClose()
      }
    }
    window.addEventListener('keyup', handleKeyUp)
    const timer = setTimeout(() => {
      handlePopupClose()
    }, 6000)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])
  const handlePopupClose = () => {
    setVisible(false)
    onClose && setTimeout(onClose, 300)
  }

  return (
    <Portal selector="#modal-root">
      <div className={errorPopupClassname}>
        <button
          className={styles.close}
          type="button"
          onClick={handlePopupClose}
          aria-label="закрыть"
        >
          <IconClose width={24} height={24} />
        </button>
        <Heading
          text={isSuccess ? 'Успех' : 'Ошибка'}
          tagName="h3"
          className={classNames(styles.title, {
            [styles.visuallyHidden]: isSuccess
          })}
        />
        <p className={styles.text}>{text}</p>
      </div>
    </Portal>
  )
}

export default ErrorPopup
