import { FC, ReactNode } from 'react'
import styles from './Layout.module.scss'
import { useScaling } from '@/hooks'
import { Footer, Header } from '@/components'
import Sidebar from '@/components/Sidebar'
import { useAtom } from 'jotai'
import { deviceAtom, sidebarStatus } from '@/atoms/deviceAtom'
import SidebarClients from '@/components/Sidebar/SidebarClients'

const LayoutClients: FC<{
  children?: ReactNode
  header?: ReactNode
  pageTitle?: string
}> = ({ children, header, pageTitle }) => {
  const [device] = useAtom(deviceAtom)
  const [sbStatus, setSbstatus] = useAtom(sidebarStatus)
  const isDesktop = device === 'desktop'

  useScaling()

  return (
    <>
      <div className={styles.container} style={sbStatus ? {paddingLeft: "340px"}: {paddingLeft: "100px"}}>
        <SidebarClients />
        <div style={{width: "100%"}}>
          {header ? header : <Header title={pageTitle} />}
          <main className={styles.wrapper}>{children}</main>
          <Footer />
        </div>
      </div>
      <div id="modal-root" />
    </>
  )
}

export default LayoutClients
