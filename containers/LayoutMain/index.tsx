import { FC, ReactNode } from 'react'
import styles from './LayoutMain.module.scss'
import { useScaling } from '@/hooks'
import { Footer, Header } from '@/components'
import Sidebar from '@/components/Sidebar'
import { useAtom } from 'jotai'
import { deviceAtom, sidebarStatus } from '@/atoms/deviceAtom'

const LayoutMain: FC<{
  children?: ReactNode
  header?: ReactNode
  pageTitle?: string
}> = ({ children, header, pageTitle }) => {
  const [device] = useAtom(deviceAtom)
  const isDesktop = device === 'desktop'
  const [sbStatus, setSbstatus] = useAtom(sidebarStatus)
  useScaling()

  return isDesktop ? (
    <>
      <div className={styles.container} style={sbStatus ? {paddingLeft: "340px"}: {paddingLeft: "100px"}}>
      <Sidebar />
        <div style={{width: "100%"}}>
          {header ? header : <Header title={pageTitle} />}
          <main className={styles.wrapper}>{children}</main>
          <Footer />
        </div>
      </div>
      <div id="modal-root" />
    </>
  ) : (
    <></>
  )
}

export default LayoutMain
