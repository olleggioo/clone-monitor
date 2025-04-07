import { userAtom } from "@/atoms";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import Header from "../Header";
import { IconLock, IconLogOut, IconUsers } from "@/icons";
import { Heading } from "@/ui";
import ArrowDown from "@/icons/ArrowDown";
import { Menu, MenuItem } from "@mui/material";
import styles from "./ProfileUser.module.scss"
import ChangePassword from "@/modals/User/ChangePassword";
import Link from "next/link";
import { userAPI } from "@/api";

interface ProfileProps {
    title: string
    back?: any
    addedControlsBlock?: any
    status?: any
    algorithm?: any
    icon?: any
    setShow?: any
}

const ProfileUser: FC<ProfileProps> = ({
    title,
    back,
    addedControlsBlock,
    status,
    algorithm,
    icon,
    setShow
}) => {
    const [userInfo, setUserInfo] = useAtom(userAtom)

    const [isOpenProfile, setIsOpenProfile] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false)

    const onToggleClick = (e: any) => {
        setIsOpenProfile((prev) => !prev)
        setAnchorEl(e.currentTarget)
    }

    const router = useRouter()

    const handleLogout = () => {
      const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
      const refreshToken = localStorage.getItem(`${process.env.API_URL}_refreshToken`)
      if(accessToken && refreshToken) {
        userAPI.logoutUser({ accessToken, refreshToken })
          .then(res => {
            localStorage.removeItem(`${process.env.API_URL}_accessToken`)
            localStorage.removeItem(`${process.env.API_URL}_refreshToken`)
            router.push('/login')
          })
          .catch(err => console.error(err))
      }
    }

  return <Header 
    status={status}
    algorithm={algorithm}
    title={title}
    icon={icon}
    setShow={setShow}
    className={styles.newEl}
    controlsBlock={
      <div className={styles.flexItems}>
        {addedControlsBlock}
        <div onClick={onToggleClick} 
          style={{
            display:"flex", 
            alignItems: "center", 
            gap: "15px", 
            cursor: "pointer",
          }}>
          <IconUsers 
          color="#582DEC" 
          width={20} height={20}  />
          <Heading
            text={userInfo?.login || "Юзер"}
          />
          <ArrowDown width={15} height={10} style={{transition: "transform 0.3s", transform: isOpenProfile ? "rotate(180deg)" : "rotate(0)"}} />
        </div>
        <Menu
          open={isOpenProfile}
          anchorEl={anchorEl}
          onClose={() => setIsOpenProfile(false)}
          slotProps={{
            paper: {
              style: {
                maxHeight: 250,
                width: "200px",
                marginTop: "20px",
                borderRadius: "9px"
              },
            }
          }}
        >
          
          <MenuItem
            onClick={() => {
              setIsOpenProfile(false);
              setOpen(true);
            }}
            className={styles.svgIconChangePass}
          >
            <IconLock width={24} height={24} />
            <span>Сменить пароль</span>
          </MenuItem>
          <MenuItem
            onClick={() => {
              router.push("/current-role-access")
            }}
            className={styles.svgIconChangePass}
          >
            <IconUsers width={24} height={24} />
            <span>Доступы</span>
          </MenuItem>
          <MenuItem
            onClick={handleLogout}
            className={styles.svgIconLogOut}
          >
            <IconLogOut width={20} height={20} />
            <span>Выйти</span>
          </MenuItem>
        </Menu> 
        {open && <ChangePassword onClose={() => setOpen(false)} />}
      </div>
    }
  />
}

export default ProfileUser;