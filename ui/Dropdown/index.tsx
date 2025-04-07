import { FC, useState } from 'react'
import { DropdownI, DropdownItemI } from './Dropdown'
import styles from './Dropdown.module.scss'
import classNames from 'classnames'
import { useOnClickOutside } from '@/hooks'
import { IconMoreVertical } from '@/icons'

const Dropdown: FC<DropdownI> = ({ id, items, className }) => {
  const [isOpen, setIsOpen] = useState(false)
  const onToggleClick = () => {
    setIsOpen((prev) => !prev)
  }

  const blockRef = useOnClickOutside(() => {
    setIsOpen(false)
  })

  return (
    <div
      className={classNames(styles.el, className, {
        [styles.el_open]: isOpen
      })}
      data-dropdown-id={id}
      ref={blockRef}
    >
      <button
        type="button"
        aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
        onClick={onToggleClick}
        className={styles.toggle}
      >
        <IconMoreVertical width={20} height={20} />
      </button>

      {isOpen && (
        <div className={styles.menu}>
          {items.map((item) => {
            const handleClick = () => {
              item.onClick(id)
              setIsOpen(false)
            }
            return (
              <button
                onClick={handleClick}
                key={item.text}
                className={classNames(styles.item, {
                  [styles.item_red]: item.mod === 'red'
                })}
              >
                {item.icon}
                <span>{item.text}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Dropdown
