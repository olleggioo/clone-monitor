import styles from './Sidebar.module.scss'
import { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { NavList } from '@/components'
import { IconLogOut, IconPromminer } from '@/icons'
import { Button, IconButton } from '@/ui'
import { pagesNavList, pagesRolledNavList } from '@/data'
import { useRouter } from 'next/router'
import { useAtom } from 'jotai'
import { sidebarStatus } from '@/atoms'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import { pageNavListClients } from '@/data/pagesList'
import { pagesRolledClientsNavList } from '@/data/pageListRolled'

const SidebarClients: FC = () => {
  const router = useRouter()
  const [sbStatus, setSbstatus] = useAtom(sidebarStatus)
  const handleLogout = () => {
    localStorage.removeItem(`${process.env.API_URL}_accessToken`)
    localStorage.removeItem(`${process.env.API_URL}_refreshToken`)
    router.push('/login')
  }

  return <>
    {sbStatus 
      ? <div className={styles.el}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <Image
            className={styles.logo}
            src="/promminer-logo.svg"
            width="199"
            height="40"
            alt="Promminer logo"
          />
        </Link>
        <NavList pages={pageNavListClients} className={styles.nav} />
        <IconButton 
          icon={<ArrowBackIosIcon />}
          onClick={() => setSbstatus(false)} 
        />
        <IconButton
          icon={<IconLogOut width={20} height={20} />}
          title="Выйти"
          appearance="text"
          onClick={handleLogout}
          className={styles.logout}
        />
      </div>
    </div>
      : <div className={styles.elRolled}>
        <div className={styles.inner_small}>
        <IconButton
          href="/"
          className={styles.logo_small}
          icon={<IconPromminer width={40} height={40} />}
          appearance="text"
          title=""
        />
          <NavList pages={pagesRolledClientsNavList} className={styles.nav_small} />
          <IconButton 
            icon={<ArrowForwardIcon />}
            onClick={() => setSbstatus(true)} 
          />
          <IconButton
            icon={<IconLogOut width={20} height={20} />}
            title=""
            appearance="text"
            onClick={handleLogout}
            className={styles.logout}
          />
        </div>
      </div>
    }
  </>
}

export default SidebarClients
