import { FC, useState } from 'react'
import { ButtonI } from './Button'
import styles from './Button.module.scss'
import classNames from 'classnames'
import Link from 'next/link'

const Button: FC<ButtonI> = ({
  title,
  href,
  appearance = 'default',
  type = 'button',
  disabled,
  className,
  onClick,
  children,
  icon,
  iconRight,
  loading = false
}) => {
  const appearanceClass =
    appearance !== 'default' ? styles[`el_${appearance}`] : null
  const buttonClass = classNames(styles.el, appearanceClass, className)

  return href ? (
    <Link href={href} className={buttonClass} onClick={onClick}>
      {loading && <span className={styles.loader}>😅</span>}
      {icon && <span className={styles.icon}>{icon}</span>}
      {title}
    </Link>
  ) : (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading ? true : false}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {loading && <span className={styles.loader}></span>}
      {title}
      {iconRight && <span className={styles.iconRight}>{iconRight}</span>}
      {children}
    </button>
  )
}

export default Button
