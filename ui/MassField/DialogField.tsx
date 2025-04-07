import { FC, useState } from 'react'
import { DialogI } from '@/components/Dialog/Dialog'
import { Portal } from '@/containers'
import styles from './MassField.module.scss'
import classNames from 'classnames'
import { useIsomorphicLayoutEffect, useOnClickOutside } from '@/hooks'
import { IconX } from '@/icons'
import { Heading } from '@/ui'

const CLOSE_TIMEOUT = 300

const DialogField: FC<DialogI> = ({
  title,
  wide,
  closeBtn,
  className,
  onClose,
  children
}) => {
  const [visible, setVisible] = useState(true)
  const blockClass = classNames(
    styles.block,
    { [styles.block_wide]: wide, [styles.visible]: visible },
    className
  )

  const handleDialogClose = () => {
    setVisible(false)
    onClose && setTimeout(onClose, CLOSE_TIMEOUT)
  }

  const blockRef = useOnClickOutside(() => {
    handleDialogClose()
  })

  useIsomorphicLayoutEffect((): (() => void) => {
    const handleKeyUp = (evt: any) => {
      const isEscape = evt.key === 'Escape'
      if (isEscape) {
        handleDialogClose()
        evt.target.blur()
      }
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return (
    <Portal selector="#modal-root">
      <div className={styles.overlay}>
        <div
          className={classNames(blockClass, { [styles.visible]: visible })}
          ref={blockRef}
        >
          {closeBtn && (
            <button
              className={styles.close}
              type="button"
              onClick={handleDialogClose}
            >
              <span className="visually-hidden">закрыть</span>
              <IconX width={32} height={32} />
            </button>
          )}
          {title && <Heading text={title} className={styles.title} />}
          {children}
        </div>
      </div>
    </Portal>
  )
}

export default DialogField
