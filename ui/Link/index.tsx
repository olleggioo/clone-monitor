import { FC } from 'react'
import Link from 'next/link'
import { LinkI } from '@/ui/Link/Link'
import styles from './Link.module.scss'
import classNames from 'classnames'

const LinkComponent: FC<LinkI> = ({
  title,
  href,
  onClick,
  appearance = 'default',
  className
}) => {
  const appearanceClass =
    appearance !== 'default' ? styles[`el_${appearance}`] : null
  const linkClass = classNames(styles.el, appearanceClass, className)

  return !!href ? (
    <Link href={href} className={linkClass} onClick={onClick}>
      {title}
    </Link>
  ) : (
    <button type="button" className={linkClass} onClick={onClick}>
      {title}
    </button>
  )
}

export default LinkComponent
