import { FC } from 'react'
import { NavListI } from './NavList'
import styles from './NavList.module.scss'
import classNames from 'classnames'
import { IconChart, IconServer, IconUsers, IconChip, IconStatistics } from '@/icons'
import NavItem from '@/components/NavList/Item'
import { PagesType } from '@/interfaces/common'
import { useRouter } from 'next/router'
import IconMap from '@/icons/Map'
import IconArchive from '@/icons/Archive'
import IconArchiveColor from '@/icons/Archive/ArchiveColor'

const getNavItemIcon = (title: PagesType) => {
  switch (title) {
    // case 'home':
    //   return <IconChip width={20} height={20} />
    case 'statistics':
      return <IconChart width={20} height={20} />
    case 'devices':
      return <IconServer width={20} height={20} />
    case 'users':
      return <IconUsers width={20} height={20} />
    case 'areas':
      return <IconMap width={20} height={20} />
    case 'pools':
      return <IconServer width={20} height={20} />
    case 'archive':
      return <IconArchiveColor width={20} height={20} />
    case 'roleAccess':
      return <IconUsers width={20} height={20} />
    case 'models':
      return <IconUsers width={20} height={20} />
    default:
      return <></>
  }
}

const NavList: FC<NavListI> = ({ pages, className }) => {
  const router = useRouter()
  return (
    <ul className={classNames(styles.el, className)}>
      {pages.map(({ name, title }: any) => {
        // const isHome = name === 'home'
        const href = `/${name}`
        return (
          <li className={styles.item} key={name}>
            <NavItem
              title={title}
              href={href}
              icon={getNavItemIcon(name)}
              selected={router.asPath === href}
            />
          </li>
        )
      })}
    </ul>
  )
}

export default NavList
