import { FC } from 'react'
import { BackLinkI } from '@/ui/BackLink/BackLink'
import styles from './BackLink.module.scss'
import { IconBack } from '@/icons'
import Link from 'next/link'

const BackLink: FC<BackLinkI> = ({ title = 'Назад', href, onClick }) => {
  const renderInner = () => (
    <>
      <IconBack width={15} height={15} />
      <span className={styles.text}>{title}</span>
    </>
  )

  return href ? (
    <Link className={styles.el} href={href} onClick={onClick}>
      {renderInner()}
    </Link>
  ) : (
    <button className={styles.el} type="button" onClick={onClick}>
      {renderInner()}
    </button>
  )
}

export default BackLink
