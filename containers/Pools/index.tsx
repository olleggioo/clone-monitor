import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { deviceAPI } from "@/api";
import { deviceAtom, userAtom } from "@/atoms";
import { Button, Heading } from "@/ui";

import { devicesUserIdFilterAtom, modalInfoAtom, poolMockAtom } from "@/atoms/appDataAtom";
import PoolMockTable from "@/blocks/PoolMock/PoolMockTable";
import PoolMockTableManager from "@/blocks/PoolMock/PoolMockTableManager";
import { Dashboard, Header } from "@/components"
import PoolMockAddModal from "@/modals/PoolSettings/AddMock";
import Alert from "@/modals/Areas/Alert";
import ModalInfo from "@/modals/PoolSettings/ModalInfo";
import DropdownActions from "@/ui/Dropdown/DropdownActions";
import { IconLogOut, IconPlus, IconTrash, IconUsers } from "@/icons";

import Layout from "../Layout"
import styles from "./Pools.module.scss"
import { useRouter } from "next/router";
import ArrowDown from "@/icons/ArrowDown";
import { Menu, MenuItem } from "@mui/material";
import ProfileUser from "@/components/ProfileUser";

const PoolsContainer = () => {
  const roleId = localStorage.getItem(`${process.env.API_URL}_role`)
  const [device] = useAtom(deviceAtom)
  const [areas, setAreas] = useAtom(poolMockAtom)
  const [addMock, setAddMock] = useState(false)
  const [state, setState] = useAtom(devicesUserIdFilterAtom)
  const [deleteManyPools, setDeleteManyPools] = useState(false)
  const [modalInfo, setModalInfo] = useAtom(modalInfoAtom)
  useEffect(() => {
      deviceAPI.getDevicesPoolMocks({
          limit: 999,
          order: {
            name: "ASC"
        }
      }).then(res => {
          setAreas(res.rows)
      }).catch(err => console.error(err))
  }, [setAreas])

  const tableDropDownItems = [
    {
      text: "Удалить",
      icon: <IconTrash width={20} height={20} />,
      onClick: () => setDeleteManyPools(true),
      mod: "red"
    }
  ]

  const deletePoolsFromList = (ids: any) => {
    let newArr: any = areas
    ids.forEach((item: any) => {
      newArr = newArr.filter((pool: any) => pool.id !== item.id) 
    })
    setAreas(newArr)
  }

  const handledeleteManyPools = () => {
    if(state && state.length !== 0) {
      deviceAPI.deleteManyPoolMocks({
        where: state.map(item => ({ id: item.id }))
      }).then(res => {
        deletePoolsFromList(state)
        setModalInfo({
          open: true,
          action: "Удаление пулов",
          status: "Успешно",
          textInAction: "Выделенные пулы успешно удалены"
        })
      }).catch(err => {
        setModalInfo({
          open: true,
          action: "Удаление пулов",
          status: "Ошибка",
          textInAction: "Произошла ошибка при удалении выделенных пулов"
        })
      }).finally(() => {
        setDeleteManyPools(false)
      })
    }
  }

  const [userInfo, setUserInfo] = useAtom(userAtom)

  const [isOpenProfile, setIsOpenProfile] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null);

  const onToggleClick = (e: any) => {
    setIsOpenProfile((prev) => !prev)
    setAnchorEl(e.currentTarget)
  }

  const router = useRouter()

  const header = (
    <ProfileUser title="Шаблоны пулов" />
  )

    // const header = (
    //     <Header
    //       title={'Шаблоны пулов'}
    //       controlsBlock={
            // <div className={styles.actions}>
            //   {state.length > 0 && <DropdownActions 
            //     items={tableDropDownItems}
            //     className={styles.buttonMoreActions}
            //     // className={styles.actions}
            //   />}
            //   <Button
            //     title="Добавить шаблон"
            //     icon={<IconPlus width={22} height={22} />}
            //     className={styles.btn}
            //     onClick={() => setAddMock(true)}
            //   />
            // </div>
    //       }
    //     />
    // )
    return device !== "mobile" ? <Layout header={header}>
        <div className={styles.actions}>
          <Button
            title="Добавить шаблон"
            icon={<IconPlus width={22} height={22} />}
            className={styles.btn}
            onClick={() => setAddMock(true)}
            />
          {state.length > 0 && <DropdownActions 
            items={tableDropDownItems}
            className={styles.buttonMoreActions}
            // className={styles.actions}
          />}
        </div>
      <Dashboard 
        title=" "
        // headerTable={
        // }
      >
      {deleteManyPools && <Alert 
          title={"Удаление пулов"} 
          content={"Вы уверены что хотите выбранные пулы?"} 
          open={deleteManyPools} 
          setOpen={setDeleteManyPools} 
          handleDeleteClick={handledeleteManyPools} 
      />}
      {modalInfo && modalInfo.open && modalInfo.action.length !== 0 && modalInfo.textInAction.length !== 0 && modalInfo.status.length !== 0 && <ModalInfo 
        open={modalInfo.open}
        onClose={() => setModalInfo({
          open: false,
          action: "",
          textInAction: "",
          status: ""
        })}
        status={modalInfo.status}
        action={modalInfo.action}
        textInAction={modalInfo.textInAction}
      />}
      {addMock && <PoolMockAddModal setAreas={setAreas} onClose={() => setAddMock(false)} />}
      {areas.length !== 0 && <>
        {roleId === process.env.ROLE_MANAGER_ID
          ? <PoolMockTableManager rows={areas} setAreas={setAreas} />
          : <PoolMockTable rows={areas} setAreas={setAreas} />
        }
      </>}    
      </Dashboard>  
    </Layout> : <Layout pageTitle="Шаблоны пулов" header={<ProfileUser title='Шаблоны пулов' />}>
      <Dashboard>
      <div className={styles.actions}>
        <Button
          title="Добавить шаблон"
          icon={<IconPlus width={22} height={22} />}
          className={styles.btn_phone}
          onClick={() => setAddMock(true)}
          />
        {state.length > 0 && <DropdownActions 
          items={tableDropDownItems}
          className={styles.buttonMoreActions}
          // className={styles.actions}
        />}
      </div>
      {deleteManyPools && <Alert 
          title={"Удаление пулов"} 
          content={"Вы уверены что хотите удалить IP-диапазон?"} 
          open={deleteManyPools} 
          setOpen={setDeleteManyPools} 
          handleDeleteClick={handledeleteManyPools} 
      />}
      {modalInfo && modalInfo.open && modalInfo.action.length !== 0 && modalInfo.textInAction.length !== 0 && modalInfo.status.length !== 0 && <ModalInfo 
        open={modalInfo.open}
        onClose={() => setModalInfo({
          open: false,
          action: "",
          textInAction: "",
          status: ""
        })}
        status={modalInfo.status}
        action={modalInfo.action}
        textInAction={modalInfo.textInAction}
      />}
      {addMock && <PoolMockAddModal setAreas={setAreas} onClose={() => setAddMock(false)} />}
      {areas.length !== 0 && <>
        {roleId === process.env.ROLE_MANAGER_ID
          ? <PoolMockTableManager rows={areas} setAreas={setAreas} />
          : <PoolMockTable rows={areas} setAreas={setAreas} />
        }
      </>}     
      </Dashboard> 
    </Layout>
}

export default PoolsContainer