import { FC, ReactNode, memo, useState } from 'react'
import styles from './Layout.module.scss'
import { useScaling } from '@/hooks'
import { Footer, Header } from '@/components'
import Sidebar from '@/components/Sidebar'
import { useAtom } from 'jotai'
import { deviceAtom, sidebarStatus } from '@/atoms/deviceAtom'
import MenuIcon from '@mui/icons-material/Menu';
import NavbarResponsive from '@/components/NavbarResponsive'
import ProfileUser from '@/components/ProfileUser'

const Layout: FC<{
  children?: ReactNode
  header?: ReactNode
  pageTitle?: string
}> = ({ children, header, pageTitle }) => {
  const [device] = useAtom(deviceAtom)
  const [sbStatus, setSbstatus] = useAtom(sidebarStatus)
  const isDesktop = device === 'desktop'

  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  useScaling()

  return (
    <>
      {device === "mobile" ? <div className={styles.container}>
        <NavbarResponsive show={sidebar} setShow={setSidebar} />
        <div className={styles.wrapperBox}>
          {header 
            ? <ProfileUser title={pageTitle || ""} icon={<MenuIcon width={20} height={20} />} setShow={setSidebar} /> 
            : <Header title={pageTitle} icon={<MenuIcon width={20} height={20} />} setShow={setSidebar} />
          }
          <main className={styles.wrapper}>{children}</main>
          <Footer />
        </div>
      </div> : <div className={styles.container} style={sbStatus 
          ? {paddingLeft: "20rem"}
          : {paddingLeft: "7rem"}}>
        <Sidebar />
        <div className={styles.flexBox}>
          {header ? header : <Header title={pageTitle} setShow={setSidebar} />}
          <main className={styles.wrapper}>{children}</main>
          <Footer />
        </div>
      </div>}
      <div id="modal-root" />
    </>
  )
}

export default memo(Layout)
