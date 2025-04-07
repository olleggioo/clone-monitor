import { sidebarStatus } from "@/atoms"
import { pagesNavList, pagesRolledNavList } from "@/data"
import { useAtom } from "jotai"
import { useRouter } from "next/router"
import styles from "./NavbarResponsive.module.scss"
import NavList from "../NavList"
import { FC } from "react"
import { IconButton } from "@/ui"
import { IconCross, IconLogOut } from "@/icons"
import Link from "next/link"
import Image from "next/image"

const NavbarResponsive: FC<{show?: any, setShow?: any}> = ({show, setShow}) => {
    const roleId = localStorage.getItem(`${process.env.API_URL}_role`)
    const router = useRouter()
    const [sbStatus, setSbstatus] = useAtom(sidebarStatus)
    const handleLogout = () => {
        localStorage.removeItem(`${process.env.API_URL}_accessToken`)
        localStorage.removeItem(`${process.env.API_URL}_refreshToken`)
        router.push('/login')
    }
    // if(roleId === process.env.ROLE_MANAGER_ID) {
    //     delete pagesNavList[0]
    //     delete pagesRolledNavList[0]
    // }
    return <div className={styles.nav}>
        <div className={styles.nav_side} style={show ? {display: 'block'} : {display: 'none'}}>
        {sbStatus 
            ? <div className={styles.inner}>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    {/* <Link href="/" className={styles.logo}>
                    <Image
                        className={styles.logo}
                        src="/promminer-logo.svg"
                        width="199"
                        height="40"
                        alt="Promminer logo"
                        />
                    </Link> */}
                    <IconButton 
                        icon={<IconCross width={20} height={20} />}
                        onClick={() => setShow(false)}
                    />
                </div>
                <NavList pages={pagesNavList} className={styles.nav} />
            </div>
            : <div className={styles.inner}>
                
                <Link href="/" className={styles.logo}>
                <Image
                    className={styles.logo}
                    src="/promminer-logo.svg"
                    width="199"
                    height="40"
                    alt="Promminer logo"
                />
                </Link>
                <NavList pages={pagesRolledNavList} className={styles.nav_small} />
            </div>
            }
        </div>
    </div> 
}

export default NavbarResponsive;