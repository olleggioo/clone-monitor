import {FC, ReactNode, useState} from "react"
import { DialogI } from "@/components/Dialog/Dialog"
import classNames from "classnames"
import styles from "./Dialog.module.scss"
import { useIsomorphicLayoutEffect, useOnClickOutside } from "@/hooks"
import { Heading } from "@/ui"
import { IconX } from "@/icons"

const DialogArea: FC<{
    title?: string
    wide?: boolean
    closeBtn?: boolean
    className?: string
    onClose?: () => void
    style?: any
    children?: ReactNode
  }> = ({
    title,
    wide,
    closeBtn,
    className,
    onClose,
    style,
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
    onClose && setTimeout(onClose, 300)
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
    // document.body.style.overflow = 'hidden'
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

    return (
    <div className={styles.overlay} style={style}>
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
    )
}

export default DialogArea