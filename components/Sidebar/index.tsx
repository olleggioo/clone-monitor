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
import { hasAccess, hasRootAccess } from '@/helpers/AccessControl'
import { requestsAccessMap } from '@/helpers/componentAccessMap'

const restrictedPages = {
  areas: requestsAccessMap.getDevicesArea,
  users: requestsAccessMap.getUsers,
  devices: requestsAccessMap.getDevices,
  models: requestsAccessMap.getDeviceModel,
};

const Sidebar: FC = () => {
  const roleId = localStorage.getItem(`${process.env.API_URL}_role`)
  const router = useRouter()
  const [sbStatus, setSbstatus] = useAtom(sidebarStatus)
  const handleLogout = () => {
    localStorage.removeItem(`${process.env.API_URL}_accessToken`)
    localStorage.removeItem(`${process.env.API_URL}_refreshToken`)
    router.push('/login')
  }

  const filteredPagesNavList = pagesNavList.filter((page) => {
    console.log("page", page)
    if(page.name === "roleAccess") {
      return hasRootAccess()
    }
    const accessCheck = restrictedPages[page.name as keyof typeof restrictedPages];
    return !accessCheck || hasAccess(accessCheck);
  });
  
  const filteredRolledPagesNavList = pagesRolledNavList.filter((page) => {
    const accessCheck = restrictedPages[page.name as keyof typeof restrictedPages];
    return !accessCheck || hasAccess(accessCheck);
  });
  console.log(filteredPagesNavList)
  // if(roleId === process.env.ROLE_ROOT_ID) {
  //   filteredPagesNavList.push({
  //     name: "roleAccess", 
  //     title: "Роли доступа"
  //   })
  // }

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
        <NavList pages={filteredPagesNavList} className={styles.nav} />
        <div className={styles.back}>
          <IconButton 
            icon={<ArrowBackIosIcon />}
            onClick={() => setSbstatus(false)} 
          />
        </div>
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
          <NavList pages={filteredRolledPagesNavList} className={styles.nav_small} />
          <div className={styles.back}>
            <IconButton 
              icon={<ArrowForwardIcon />}
              onClick={() => setSbstatus(true)} 
            />
          </div>
          {/* <IconButton
            icon={<IconLogOut width={20} height={20} />}
            title=""
            appearance="text"
            onClick={handleLogout}
            className={styles.logout}
          /> */}
        </div>
      </div>
    }
  </>
}

export default Sidebar
