import { FC, MouseEvent, memo, useEffect, useState } from 'react'
import Table from '../../../components/Table/CopyTable'
import { getDevicesTableData } from '@/blocks/Devices/helpers'
import { devicesRolledTableHead, devicesTableHead } from '@/blocks/Devices/data'
import { DropdownItemI } from '@/ui/Dropdown/Dropdown'
import { IconAlertTriangle, IconAperture, IconChart, IconCog, IconDevice, IconEdit2, IconInfo, IconRefresh, IconTrash } from '@/icons'
import { useRouter } from 'next/router'
import { DeviceI } from '@/interfaces'
import { PoolSettingsModal } from '@/modals'
import PoolDefault from '@/modals/PoolSettings/PoolDefault'
import { useAtom } from 'jotai'
import { deviceUpdateManyPool, devicesDataAtom, devicesUpdatesMany, devicesUserIdFilterAtom, isReservedAtom, modalInfoAtom, modalMinStateActionAtom, modalReserveDevice, modalUpdateDisperseManyAtom, modalUpdateOwnerManyAtom, modalUpdateUserManyAtom } from '@/atoms/appDataAtom'
import { Button } from '@/ui'
import { sidebarStatus } from '@/atoms'
import Disperse from '@/modals/Disperse'
import { deviceAPI } from '@/api'
import { ErrorPopup } from '@/components'
import { useSnackbar } from 'notistack'
import UpdateDevice from '@/modals/PoolSettings/UpdateDevice'
import TestTable from '@/components/Table/TestTable'
import ModalInfo from '@/modals/PoolSettings/ModalInfo'
import DragableTable from '@/components/DragableTable'
import Alert from '@/modals/Areas/Alert'
import UpdateUserMany from '@/modals/PoolSettings/UpdateUserMany'
import DisperseMany from '@/modals/Disperse/DisperseMany'
import DeviceEdit from '@/modals/PoolSettings/DeviceEdit'
import MiningState from '@/modals/MiningState'
import UpdateOwnerMany from '@/modals/PoolSettings/UpdateOwnerMany'
import Replacement from '@/modals/PoolSettings/Replacement'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import IconSliders from '@/icons/Sliders'
import IconDashboardPerfomance from '@/icons/DashboardPerfomance'
import IconRepeat from '@/icons/Repeat'
import TableNew from '@/components/Table/TableNew'
import PoolReserve from '@/modals/PoolSettings/PoolReserve'
import { hasAccess } from '@/helpers/AccessControl'
import { requestsAccessMap } from '@/helpers/componentAccessMap'

const DevicesTable: FC<{
  devices: DeviceI[]
  isLoading?: boolean
  onDeleteDevice?: (id: string) => void
}> = ({ devices, isLoading, onDeleteDevice }) => {
  const [poolId, setPoolId] = useState<string | undefined>("");
  const [modal, setModal] = useState(false);
  const [modalDisperse, setModalDisperse] = useState(false)
  const [sucessReload, setSuccessReload] = useState(false)
  const [modalUpdate, setModelUpdate] = useAtom(deviceUpdateManyPool)
  const [modalInfo, setModalInfo] = useAtom(modalInfoAtom)
  const [modalDisperseMany, setModalDisperseMany] = useAtom(modalUpdateDisperseManyAtom)
  const [warningDelete, setWarningDelete] = useState(false)
  const [reloadModal, setReloadModal] = useState(false)
  const [deviceId, setDeviceId] = useState<any>(null)
  const [modalMinState, setModalMinState] = useAtom(modalMinStateActionAtom)
  const [{ users }] = useAtom(devicesDataAtom)

  const [editSingleDevice, setEditSingleDevice] = useState<{id: string, flag: boolean} | null>(null)
  const [isReservedSingleDevice, setIsReservedSingleDevice] = useAtom(isReservedAtom)
  const [editSingleDeviceReplacement, setEditSingleDeviceReplacement] = useState<{id: string, flag: boolean} | null>(null)

  const router = useRouter()
  const {enqueueSnackbar} = useSnackbar()

  const handleDeviceClick = (id: string) => {
    router.push(`/devices/${id}`);
  }

  const handleModalRefresh = (id?: string) => {
    setReloadModal(true)
    if(id) {
      setDeviceId(id)
    }
  }

  const handleRefreshClick = () => {
    if(deviceId) {
      enqueueSnackbar("Устройство в очереди на перезагрузку. Пожалуйста ожидайте", {
        variant: "info",
        autoHideDuration: 3000
      })
      deviceAPI.reloadManyDevices({
          where: {
            id: deviceId
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

  const handleSettingsClick = (id?: string) => {
    setPoolId(id);
    setModal(true);
  }

  const handleDisperse = (id?: string) => {
    setPoolId(id)
    setModalDisperse(true)
  }

  const handleEditClick = (id?: string) => {
    router.push(`/edit-device?id=${id}`)
  }

  const handleDeleteClick = () => {
    if (deviceId && !!onDeleteDevice) {
      onDeleteDevice(deviceId)
      setWarningDelete(false)
    }
  }

  const handleWarningDelete = (id?: string) => {
    setWarningDelete(true)
    if(id) {
      setDeviceId(id)
    }
  }

  const handleDeviceModalClick = (id?: string) => {
    if(id) {
      router.push(`/devices/${id}`)
    }
  }

  const handleEditOneDevice = (id?: string) => {
    if(id) {
      setEditSingleDevice({id, flag: true})
    }
  }

  const handleEditOneDeviceReplacement = (id?: string) => {
    if(id) {
      setEditSingleDeviceReplacement({id, flag: true})
    }
  }

  const tableDropDownItems: DropdownItemI[] = [
    {
      text: "Состояние",
      icon: <IconDevice width={20} height={20} />,
      onClick: () => {}
    },
  ]

  if(hasAccess(requestsAccessMap.reloadManyDevices)) {
    tableDropDownItems.unshift({
      text: 'Перезагрузить',
      icon: <IconRefresh width={20} height={20} />,
      onClick: handleModalRefresh
    })
  }

  if(hasAccess(requestsAccessMap.updateDevice)) {
    tableDropDownItems.unshift({
      text: "Сделать подмену",
      icon: <IconRepeat width={20} height={20} />,
      onClick: handleEditOneDeviceReplacement
    })
  }

  if(hasAccess(requestsAccessMap.updateManyDevicesPools)) {
    tableDropDownItems.unshift({
      text: 'Настройка пулов',
      icon: <IconSliders width={20} height={20} />,
      onClick: handleSettingsClick
    })
  }

  if(hasAccess(requestsAccessMap.updateManyOverclock)) {
    tableDropDownItems.unshift({
      text: 'Разогнать',
      icon: <IconDashboardPerfomance width={20} height={20} />,
      onClick: handleDisperse
    })
  }

  if(hasAccess(requestsAccessMap.createUserDevice) && hasAccess(requestsAccessMap.updateDevice)) {
    tableDropDownItems.unshift({
      text: 'Редактировать',
      icon: <IconEdit2 width={20} height={20} />,
      // onClick: handleEditClick
      onClick: handleEditOneDevice
    })
  }

  if(hasAccess(requestsAccessMap.deleteDevice)) {
    tableDropDownItems.push({
      text: 'Удалить',
      icon: <IconTrash width={20} height={20} />,
      onClick: handleWarningDelete,
      mod: 'red'
    })
  }

  const [state, setState] = useAtom(devicesUserIdFilterAtom)
  useEffect(() => {
    setUpdateManyUserModal(false)
    setModelUpdate(false)
    setModalDisperseMany(false)
    setDeviceUpdate(false)
  }, [state])
  const [sbStatus, setSbstatus] = useAtom(sidebarStatus)
  const [deviceUpdate, setDeviceUpdate] = useAtom(devicesUpdatesMany)
  const [updateManyUserModal, setUpdateManyUserModal] = useAtom(modalUpdateUserManyAtom)
  const [updateManyOwnerModal, setUpdateManyOwnerModal] = useAtom(modalUpdateOwnerManyAtom)

  const rows = getDevicesTableData(devices, handleDeviceClick, sbStatus, users)
  return (
    <>
      {modalMinState && 
        state.length > 0 && 
        <MiningState 
          correctState={state} 
          onClose={() => setModalMinState(false)} 
        />
      }
      {updateManyUserModal && 
        state.length > 0 && 
        <UpdateUserMany 
          onClose={() => setUpdateManyUserModal(false)} 
        />
      }
      {/* {state.length > 0 && <Button onClick={() => setWarningDelete(true)} title='Удалить'/>} */}
      {modalDisperseMany && 
        state.length > 0 && 
        <DisperseMany 
          onClose={() => setModalDisperseMany(false)} 
        />
      }
      {warningDelete && 
        <Alert
          title={"Удаление устройства"} 
          content={"Вы уверены что хотите удалить устройство?"} 
          open={warningDelete} 
          setOpen={setWarningDelete} 
          handleDeleteClick={handleDeleteClick} 
        />
      }
      {reloadModal && 
        <Alert
          title={"Перезагрузка устройства"} 
          content={"Вы уверены что хотите перезагрузить устройство?"} 
          open={reloadModal} 
          setOpen={setReloadModal} 
          handleDeleteClick={handleRefreshClick} 
        />
      }
      {editSingleDevice !== null && 
        editSingleDevice.flag && 
        editSingleDevice.id.length !== 0 && 
        <DeviceEdit 
          id={editSingleDevice.id} 
          onClose={() => setEditSingleDevice((prevState: any) => {
            return {
              ...prevState,
              flag: false
            }}
        )} 
        />
      }
      {editSingleDeviceReplacement !== null && 
        editSingleDeviceReplacement.flag && 
        editSingleDeviceReplacement.id.length !== 0 && 
        <Replacement 
          id={editSingleDeviceReplacement.id} 
          onClose={() => setEditSingleDeviceReplacement((prevState: any) => {
            return {
              ...prevState,
              flag: false
            }}
        )} 
        />
      }
      {isReservedSingleDevice !== null && 
        isReservedSingleDevice.flag && 
        isReservedSingleDevice.id.length !== 0 &&
        <PoolReserve deviceId={isReservedSingleDevice.id} onClose={() => setIsReservedSingleDevice(null)} /> 
      }
      {modal && 
        <PoolSettingsModal 
          id={poolId} 
          onClose={() => setModal(false)} 
        />
      }
      {modalUpdate && 
        state.length > 0 && 
        <PoolDefault 
          deviceId={state} 
          onClose={() => setModelUpdate(false)} 
        />
      }
      {modalDisperse && 
        <Disperse 
          id={poolId} 
          onClose={() => setModalDisperse(false)} 
        />
      }
      {sucessReload && 
        <ErrorPopup 
          isSuccess={sucessReload} 
          text='Операция успешна. Устройства перезагрузяться в течении 30 секунд.' 
        />
      }
      {deviceUpdate && 
        state.length > 0 && 
        <UpdateDevice 
          onClose={() => setDeviceUpdate(false)} 
        />
      }

      {updateManyOwnerModal && 
        state.length > 0 && 
        <UpdateOwnerMany
          onClose={() => setUpdateManyOwnerModal(false)} 
        />
      }
        {/* <TestTable 
          columns={devicesRolledTableHead}
          rows={rows}
          dropdownItems={tableDropDownItems}
          toLink={true}
          isLoading={isLoading}
          whichTable='device'
        /> */}

        <TableNew 
          columns={devicesRolledTableHead}
          rows={rows}
          dropdownItems={tableDropDownItems}
          toLink={true}
          isLoading={isLoading}
          whichTable='device'
        />
      {modalInfo && 
        modalInfo.open && 
        modalInfo.action.length !== 0 && 
        modalInfo.textInAction.length !== 0 && 
        modalInfo.status.length !== 0 && 
        <ModalInfo 
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
        />
      }
    </>
  )
}

export default memo(DevicesTable)
