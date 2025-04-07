import {
  FC,
  useState,
  useMemo,
  memo
} from 'react'
import { useRouter } from 'next/router'
import { useAtom } from 'jotai'
import type { UserI } from '@/interfaces'
import type { DropdownItemI } from '@/ui/Dropdown/Dropdown'
import { RoleGroup } from '@/const'
import { usersListAtom } from '@/atoms'
import { deviceAPI, userAPI } from '@/api'
import {
  IconCpu,
  IconDevice,
  IconEdit2,
  IconRefresh,
  IconTrash,
  IconTrendingUp
} from '@/icons'
import { UsersTableI } from '@/blocks/Users/Table/UsersTable'
import {
  clientsTableHead,
  teamTableHead
} from '@/blocks/Users/Table/tableData'
import { getUsersTableData } from '@/blocks/Users/helpers'
import {
  EditClientModal,
  EditUserModal
} from '@/modals'
import { ErrorPopup } from '@/components'
import Table from '@/components/Table/CopyTable'
import { Button } from '@/ui'
import { changeManyMiningStateInUsers, devicesFilterAtom, devicesUserIdFilterAtom, devicesUserIdMiningFilterAtom, modalInfoAtom, statusInfoAtom } from '@/atoms/appDataAtom'
import Alert from '@/modals/Areas/Alert'
import { useSnackbar } from 'notistack'
import TestTable from '@/components/Table/TestTable'
import styles from "./Table.module.scss"
import MiningState from '@/modals/MiningState'
import ModalInfo from '@/modals/PoolSettings/ModalInfo'
import UpdateManyMiningState from '@/modals/MiningState/UpdateManyMiningState'
import PoolDefault from '@/modals/PoolSettings/PoolDefault'
import DisperseMany from '@/modals/Disperse/DisperseMany'
import { hasAccess } from '@/helpers/AccessControl'
import { requestsAccessMap } from '@/helpers/componentAccessMap'
 
const UsersTable: FC<UsersTableI> = ({ view, currentViewUsers, isLoading }) => {
  const router = useRouter()
  const roleId = localStorage.getItem(`${process.env.API_URL}_role`)
  const [usersList, setUsersList] = useAtom(usersListAtom)
  const [currentUser, setCurrentUser] = useState<UserI | undefined>(undefined)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [updateAllPools, setUpdateAllPools] = useState(false)
  const [warningDelete, setWarningDelete] = useState(false)
  const [userId, setUserId] = useState<any>(null)
  const [state, setState] = useAtom(devicesUserIdFilterAtom)
  const [statuses, setStatuses] = useAtom(statusInfoAtom)
  const [filterData, setFilterData] = useAtom(devicesFilterAtom)
  const [modalChangeMin, setModalChangeMin] = useState(false)
  const [usersDevicesIds, setUsersDevicesIds] = useState<any>(null)
  const [modalInfo, setModalInfo] = useAtom(modalInfoAtom)
  const [miningStateManyModal, setMiningStateModal] = useAtom(changeManyMiningStateInUsers)

  const handleUserClick = (id: string) => {
    router.push(`/users/${id}`)
  }
  const tableData = useMemo(() => {
    const head = view === RoleGroup.Clients ? clientsTableHead : teamTableHead
    return {
      columns: head,
      rows: getUsersTableData(head, currentViewUsers, statuses, handleUserClick)
    }
  }, [view, currentViewUsers])

  const deleteUserFromList = (id: string) => {
    setUsersList(usersList.filter((user) => user.id !== id))
  }

  const handleStatisticsClick = (id?: string) => {
    setFilterData((prevState: any) => {
      return {
        ...prevState,
        client: [{
          label: usersList.filter((item: any) => item.id === id)[0].fullname,
          value: id,
        }]
      }

    })
    router.push(`/devices`)
  }

  const handleEditClick = (id?: string) => {
    setCurrentUser(currentViewUsers.find((user) => user.id === id))
    setIsEditModalOpen(true)
  }

  const handleDeleteManyClick = () => {
    if(state.length > 0) {
      
    }
  }

  const handleSoftDelete = () => {
    if(userId !== null && userId.length !== 0) {
      userAPI
        .deleteUser(userId)
        .then(() => {
          deleteUserFromList(userId)
          setWarningDelete(false)
        })
        .catch(console.error)
    }
  }

  const handleDeleteClick = (id?: string) => {
    if(id) {
      setUserId(id)
      setWarningDelete(true)
    }
  }

  const handleCloseModal = () => {
    setIsEditModalOpen(false)
  }
  const {enqueueSnackbar} = useSnackbar()

  const changeMiningState = (id?: string) => {
    if(id) {
      const userDevices = currentViewUsers.filter((item: any) => item.id === id)[0].userDevices
      if(userDevices) {
        setUsersDevicesIds(userDevices)
        setModalChangeMin(true)
      }
    }
  }

  const handleUpdateAllPools = (id?: any) => {
    if(id) {
      setUserId(id)
      setUpdateAllPools(true)
    }
  }
  const [stateDevicesId, setStateDevicesId] = useAtom(devicesUserIdMiningFilterAtom)
  const [reloadModal, setReloadModal] = useState(false)
  const [successReload, setSuccessReload] = useState(false)
  const [modalDisperse, setModalDisperse] = useState(false)

  const handleModalRefresh = (id?: string) => {
    setReloadModal(true)
    if(id) {
      setUserId(id)
    }
  }

  const handleRefreshClick = () => {
    if(userId) {
      enqueueSnackbar("Устройство в очереди на перезагрузку. Пожалуйста ожидайте", {
        variant: "info",
        autoHideDuration: 3000
      })
      deviceAPI.reloadManyDevices({
          where: {
            userId
          }
      })
      .then(res => {
        setSuccessReload(true)
        setModalInfo({
          open: true,
          action: "Перезагрузка",
          status: "Успешно",
          textInAction: "Устройства перезагрузятся в течении 30 секунд"
        })
        setReloadModal(false)
      })
      .catch(err => {
        setSuccessReload(false)
        setModalInfo({
          open: true,
          action: "Перезагрузка",
          status: "Ошибка",
          textInAction: "Произошла ошибка при перезагрузке устройства"
        })
      })
    }
  }

  const handleDisperse = (id?: string) => {
    if(id) {
      setUserId(id)
      setModalDisperse(true)
    }
  }

  let tableDropDownItems: DropdownItemI[] = []

  if(view === RoleGroup.Clients) {
    tableDropDownItems = [
      {
        text: 'Статистика',
        icon: <IconTrendingUp width={20} height={20} />,
        onClick: handleStatisticsClick
      },
    ]
    if(hasAccess(requestsAccessMap.updateUser)) {
      tableDropDownItems.push({
        text: 'Редактировать',
        icon: <IconEdit2 width={20} height={20} />,
        onClick: handleEditClick
      })
    }
    if(hasAccess(requestsAccessMap.enableDevice) && hasAccess(requestsAccessMap.disableDevice)) {
      tableDropDownItems.push({
        text: 'Изменить состояние майнинга',
        icon: <IconTrendingUp width={20} height={20} />,
        onClick: changeMiningState
      })
    }

    if(hasAccess(requestsAccessMap.updateManyDevicesPools)) {
      tableDropDownItems.push({
        text: 'Обновить все пулы',
        icon: <IconDevice width={20} height={20} />,
        onClick: handleUpdateAllPools
      })
    }

    if(hasAccess(requestsAccessMap.reloadManyDevices)) {
      tableDropDownItems.push({
        text: 'Перезагрузить устройства',
        icon: <IconRefresh width={20} height={20} />,
        onClick: handleModalRefresh 
      })
    }

    if(hasAccess(requestsAccessMap.updateManyOverclock)) {
      tableDropDownItems.push({
        text: 'Разогнать устройства',
        icon: <IconCpu width={20} height={20} />,
        onClick: handleDisperse
      })
    }

    if(hasAccess(requestsAccessMap.deleteUser)) {
      tableDropDownItems.push({
        text: 'Удалить',
        icon: <IconTrash width={20} height={20} />,
        onClick: handleDeleteClick,
        mod: 'red'
      })
    }

  } else {
    tableDropDownItems = [
      {
        text: 'Статистика',
        icon: <IconTrendingUp width={20} height={20} />,
        onClick: handleStatisticsClick
      }
    ]
    if(hasAccess(requestsAccessMap.updateUser)) {
      tableDropDownItems.push({
        text: 'Редактировать',
        icon: <IconEdit2 width={20} height={20} />,
        onClick: handleEditClick
      })
    }
    if(hasAccess(requestsAccessMap.deleteUser)) {
      tableDropDownItems.push({
        text: 'Удалить',
        icon: <IconTrash width={20} height={20} />,
        onClick: handleDeleteClick,
        mod: 'red'
      })
    }
  }

  return (
    <>
    {miningStateManyModal && <UpdateManyMiningState state={stateDevicesId} onClose={() => setMiningStateModal(false)} /> }
    {successReload && <ErrorPopup isSuccess={successReload} text='Операция успешна. Устройства перезагрузяться в течении 30 секунд.' />}
    {userId !== null && userId.length !== 0 && updateAllPools && <PoolDefault deviceId={[{
      userId
    }]} onClose={() => setUpdateAllPools(false)} /> }
     {warningDelete && <Alert 
      title={"Удаление пользователя"} 
      content={"Вы уверены что хотите удалить выбранного пользователя?"} 
      open={warningDelete} 
      setOpen={setWarningDelete} 
      handleDeleteClick={handleSoftDelete} 
     />}
     {reloadModal && <Alert
        title={"Перезагрузка устройств"} 
        content={"Вы уверены что хотите перезагрузить все устройства?"} 
        open={reloadModal} 
        setOpen={setReloadModal} 
        handleDeleteClick={handleRefreshClick} 
      />}
     {modalDisperse && <DisperseMany state={[{userId}]} onClose={() => setModalDisperse(false)} /> }
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
     {modalChangeMin && usersDevicesIds && <MiningState state={usersDevicesIds} onClose={() => setModalChangeMin(false)} />}
      <TestTable
        {...tableData}
        dropdownItems={tableDropDownItems}
        isLoading={isLoading}
        view={view}
        className={(view === RoleGroup.Clients && roleId !== process.env.ROLE_MANAGER_ID) 
          ? styles.containerClients 
          : (view === RoleGroup.Team && roleId !== process.env.ROLE_MANAGER_ID)
            ? styles.containerUsers
            : styles.containerManagerUsers
        }
        whichTable='users'
        requiredAction={
          (view === RoleGroup.Clients && roleId !== process.env.ROLE_MANAGER_ID) 
          || (view === RoleGroup.Team && roleId !== process.env.ROLE_MANAGER_ID) ? true : false}

      />
      {isEditModalOpen && currentUser && (
        <>
          {view === RoleGroup.Clients && (
            <EditClientModal
              initialState={currentUser}
              onClose={handleCloseModal}
            />
          )}

          {view === RoleGroup.Team && (
            <EditUserModal
              initialState={currentUser}
              onClose={handleCloseModal}
            />
          )}
        </>
      )}
     {/* {state.length > 0 && <Button onClick={() => setWarningDelete(true)} title='Удалить'/>}
     {warningDelete && <Alert 
      title={"Удаление пользователей"} 
      content={"Вы уверены что хотите пользователей? При удалении пользователей они отвязываются от асиков"} 
      open={warningDelete} 
      setOpen={setWarningDelete} 
      handleDeleteClick={handleDeleteManyUsers} 
    />} */}
    </>
  )
}

export default memo(UsersTable)
