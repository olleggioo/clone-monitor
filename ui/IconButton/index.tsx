import { FC } from 'react'
import Link from 'next/link'
import { IconButtonI } from '@/ui/IconButton/IconButton'
import styles from './IconButton.module.scss'
import classNames from 'classnames'

interface AddIconButtonI extends IconButtonI {
  disabled?: any
}

const IconButton: FC<AddIconButtonI> = ({
  href,
  onClick,
  ariaLabel,
  icon,
  title,
  appearance = 'default',
  className,
  disabled
}) => {
  const appearanceClass =
    appearance !== 'default' ? styles[`el_${appearance}`] : null
  const buttonClass = classNames(styles.el, className, appearanceClass)

  return !!href ? (
    <Link
      href={href}
      className={buttonClass}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {icon}
      {title}
    </Link>
  ) : (
    <button
      type="button"
      className={buttonClass}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {icon}
      {title}
    </button>
  )
}

export default IconButton
