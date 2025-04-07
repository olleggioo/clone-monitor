import { IconPlus, IconUsers } from "@/icons"
import { Button, Heading } from "@/ui"
import { useState } from "react"
import styles from "./UsersHeader.module.scss"
import { Header } from "@/components"
import { AddClientModal } from "@/modals"
import AddArea from "@/modals/Areas/AddArea"
import { useAtom } from "jotai"
import { userAtom } from "@/atoms"
import { useRouter } from "next/router"
import ArrowDown from "@/icons/ArrowDown"
import { Menu, MenuItem } from "@mui/material"
import ProfileUser from "@/components/ProfileUser"

const AreasHeader = () => {
    const [modal, setModal] = useState<any>(null)
    const buttons = (
        // <div className={styles.buttons}>
          <Button
            title="Добавить площадку"
            icon={<IconPlus width={22} height={22} />}
            onClick={() => setModal('add-area')}
          />
        // </div>
    )

    const [userInfo, setUserInfo] = useAtom(userAtom)

    const [isOpenProfile, setIsOpenProfile] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);

    const onToggleClick = (e: any) => {
      setIsOpenProfile((prev) => !prev)
      setAnchorEl(e.currentTarget)
    }

    const router = useRouter()

    return (
        <>
          <ProfileUser title="Площадки" />
          
          {/* {modal === 'add-area' && <AddArea onClose={() => setModal(null)} />} */}
        </>
      )
}

export default AreasHeader