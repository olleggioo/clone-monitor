import { FC, useState } from 'react'
import Table from '../../../components/Table/CopyTable'
import { getDevicesTableData } from '@/blocks/Devices/helpers'
import { devicesRolledTableHead, devicesTableHead } from '@/blocks/Devices/data'
import { DropdownItemI } from '@/ui/Dropdown/Dropdown'
import { IconDevice, IconEdit2, IconRefresh, IconTrash } from '@/icons'
import { useRouter } from 'next/router'
import { DeviceI } from '@/interfaces'
import { PoolSettingsModal } from '@/modals'
import PoolDefault from '@/modals/PoolSettings/PoolDefault'
import { useAtom } from 'jotai'
import { deviceUpdateManyPool, devicesDataAtom, devicesUpdatesMany, devicesUserIdFilterAtom, modalInfoAtom, modalMinStateActionAtom, modalUpdateOwnerManyAtom, modalUpdateUserManyAtom } from '@/atoms/appDataAtom'
import { Button } from '@/ui'
import { sidebarStatus } from '@/atoms'
import Disperse from '@/modals/Disperse'
import { deviceAPI } from '@/api'
import { ErrorPopup } from '@/components'
import { useSnackbar } from 'notistack'
import UpdateDevice from '@/modals/PoolSettings/UpdateDevice'
import TestTable from '@/components/Table/TestTable'
import DeviceEdit from '@/modals/PoolSettings/DeviceEdit'
import MiningState from '@/modals/MiningState'
import ModalInfo from '@/modals/PoolSettings/ModalInfo'
import UpdateUserMany from '@/modals/PoolSettings/UpdateUserMany'
import UpdateOwnerMany from '@/modals/PoolSettings/UpdateOwnerMany'
import TableNew from '@/components/Table/TableNew'

const DevicesTableManager: FC<{
  devices: DeviceI[]
  isLoading?: boolean
  onDeleteDevice?: (id: string) => void
  style?: any
}> = ({ devices, isLoading, onDeleteDevice, style }) => {
  const [poolId, setPoolId] = useState<string | undefined>("");
  const [modal, setModal] = useState(false);
  const [modalDisperse, setModalDisperse] = useState(false)
  const [sucessReload, setSuccessReload] = useState(false)
  const [modalUpdate, setModelUpdate] = useAtom(deviceUpdateManyPool)
  const [deviceUpdate, setDeviceUpdate] = useAtom(devicesUpdatesMany)
  const [modalInfo, setModalInfo] = useAtom(modalInfoAtom)
  const router = useRouter()
  const {enqueueSnackbar} = useSnackbar()

  const handleDeviceClick = (id: string) => {
    
    window.open(`/devices/${id}`, "_blank")
  }

  const handleRefreshClick = (id?: string) => {
    enqueueSnackbar("Устройство в очереди на перезагрузку. Пожалуйста ожидайте", {
      variant: "info",
      autoHideDuration: 3000
    })
    deviceAPI.reloadManyDevices({
        where: {
          id
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

  const [editSingleDevice, setEditSingleDevice] = useState<{id: string, flag: boolean} | null>(null)
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

  const handleDeleteClick = (id?: string) => {
    if (id && !!onDeleteDevice) {
      onDeleteDevice(id)
    }
  }

  const handleEditOneDevice = (id?: string) => {
    if(id) {
      setEditSingleDevice({id, flag: true})
    }
  }

  const tableDropDownItems: DropdownItemI[] = [
    {
      text: 'Перезагрузить',
      icon: <IconRefresh width={20} height={20} />,
      onClick: handleRefreshClick
    },
    {
      text: 'Настройка пулов',
      icon: <IconDevice width={20} height={20} />,
      onClick: handleSettingsClick
    },
    {
      text: 'Редактировать',
      icon: <IconEdit2 width={20} height={20} />,
      // onClick: handleEditClick
      onClick: handleEditOneDevice
    },
  ]
  const [sbStatus, setSbstatus] = useAtom(sidebarStatus)
  const [modalMinState, setModalMinState] = useAtom(modalMinStateActionAtom)
  const [state, setState] = useAtom(devicesUserIdFilterAtom)
  const [updateManyUserModal, setUpdateManyUserModal] = useAtom(modalUpdateUserManyAtom)
  const [updateManyOwnerModal, setUpdateManyOwnerModal] = useAtom(modalUpdateOwnerManyAtom)
  const [{ users }] = useAtom(devicesDataAtom)

  const rows = getDevicesTableData(devices, handleDeviceClick, sbStatus)
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

      {updateManyOwnerModal && 
        state.length > 0 && 
        <UpdateOwnerMany 
          onClose={() => setUpdateManyOwnerModal(false)} 
        />
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
        <UpdateDevice 
          onClose={() => setDeviceUpdate(false)} 
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
            }
          })} 
        />
      }
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
      {/* {!sbStatus ? <Table
        columns={devicesRolledTableHead}
        rows={rows}
        dropdownItems={tableDropDownItems}
        isLoading={isLoading}
      /> : <Table
        columns={devicesTableHead}
        rows={rows}
        dropdownItems={tableDropDownItems}
        isLoading={isLoading}
      />} */}
       {/* <TestTable 
        columns={devicesRolledTableHead}
        rows={rows}
        dropdownItems={tableDropDownItems}
        isLoading={isLoading}
        whichTable='device'
        style={style}
      /> */}
      <TableNew 
        columns={devicesRolledTableHead}
        rows={rows}
        dropdownItems={tableDropDownItems}
        toLink={true}
        isLoading={isLoading}
        whichTable='device'
      />
    </>
  )
}

export default DevicesTableManager
