import styles from './NavMenu.module.scss'
import { FC } from 'react'
import { NavList } from '@/components'
import { IconButton } from '@/ui'
import { IconLogOut } from '@/icons'
import { useScrollLock } from '@/hooks'
import { pagesNavList } from '@/data'

const NavMenu: FC = () => {
  useScrollLock()

  return (
    <div className={styles.el}>
      <div className={styles.inner}>
        <NavList className={styles.nav} pages={pagesNavList} />
        <IconButton
          icon={<IconLogOut width={20} height={20} />}
          title="Выйти"
          appearance="text"
          className={styles.logout}
        />
      </div>
    </div>
  )
}

export default NavMenu
