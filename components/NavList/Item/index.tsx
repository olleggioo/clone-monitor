import { FC } from 'react'
import styles from './NavItem.module.scss'
import { NavItemI } from '@/components/NavList/NavList'
import Link from 'next/link'
import classNames from 'classnames'
import { useAtom } from 'jotai'
import { sidebarStatus } from '@/atoms'

const NavItem: FC<NavItemI> = ({ href, title, icon, selected }) => {
  const [sbStatus, setSbstatus] = useAtom(sidebarStatus)
  const renderInner = () => (
    <>
      {icon}
      {title}
    </>
  )

  const elClassName = classNames(sbStatus ? styles.el : styles.el_small, { [styles.selected]: selected })

  return selected ? (
    <span className={elClassName}>{renderInner()}</span>
  ) : (
    <Link href={href} className={elClassName}>
      {renderInner()}
    </Link>
  )
}

export default NavItem
