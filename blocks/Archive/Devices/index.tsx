import { FC, memo, useEffect, useState } from 'react'
import { getDevicesArchiveTableData, getDevicesTableData } from '@/blocks/Devices/helpers'
import { devicesArchiveRolledTableHead, devicesRolledTableHead, devicesTableHead } from '@/blocks/Devices/data'
import { DropdownItemI } from '@/ui/Dropdown/Dropdown'
import { IconDevice, IconEdit2, IconInfo, IconRefresh, IconTrash } from '@/icons'
import { useRouter } from 'next/router'
import { DeviceI } from '@/interfaces'
import { useAtom } from 'jotai'
import { deviceUpdateManyPool, devicesDataAtom, devicesUpdatesMany, devicesUserIdFilterAtom, isReservedAtom, modalInfoAtom, modalMinStateActionAtom, modalReserveDevice, modalUpdateDisperseManyAtom, modalUpdateOwnerManyAtom, modalUpdateUserManyAtom } from '@/atoms/appDataAtom'
import { sidebarStatus } from '@/atoms'
import { deviceAPI } from '@/api'
import { useSnackbar } from 'notistack'
import TestTable from '@/components/Table/TestTable'
import IconSliders from '@/icons/Sliders'
import IconDashboardPerfomance from '@/icons/DashboardPerfomance'
import IconRepeat from '@/icons/Repeat'
import styles from "./Devices.module.scss"
import TableNew from '@/components/Table/TableNew'
import PoolReserve from '@/modals/PoolSettings/PoolReserve'
import ModalInfo from '@/modals/PoolSettings/ModalInfo'

const DevicesArchiveTable: FC<{
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
    // {
    //   text: 'Перезагрузить',
    //   icon: <IconRefresh width={20} height={20} />,
    //   onClick: handleModalRefresh
    // },
    // {
    //   text: "Состояние",
    //   icon: <IconDevice width={20} height={20} />,
    //   onClick: () => {}
    // },
    // {
    //   text: "Сделать подмену",
    //   icon: <IconRepeat width={20} height={20} />,
    //   onClick: handleEditOneDeviceReplacement
    // },
    // {
    //   text: 'Настройка пулов',
    //   icon: <IconSliders width={20} height={20} />,
    //   onClick: handleSettingsClick
    // },
    // {
    //   text: 'Разогнать',
    //   icon: <IconDashboardPerfomance width={20} height={20} />,
    //   onClick: handleDisperse
    // },
    // {
    //   text: 'Редактировать',
    //   icon: <IconEdit2 width={20} height={20} />,
    //   // onClick: handleEditClick
    //   onClick: handleEditOneDevice
    // },
    // {
    //   text: 'Удалить',
    //   icon: <IconTrash width={20} height={20} />,
    //   onClick: handleWarningDelete,
    //   mod: 'red'
    // },
  ]

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
  const [isReservedSingleDevice, setIsReservedSingleDevice] = useAtom(isReservedAtom)

  const rows = getDevicesArchiveTableData(devices, handleDeviceClick, sbStatus, users)
  return (
    <>
      {isReservedSingleDevice !== null && 
          isReservedSingleDevice.flag && 
          isReservedSingleDevice.id.length !== 0 &&
          <PoolReserve deviceId={isReservedSingleDevice.id} onClose={() => setIsReservedSingleDevice(null)} /> 
        }
        <TableNew 
            columns={devicesArchiveRolledTableHead}
            rows={rows}
            dropdownItems={tableDropDownItems}
            toLink={true}
            isLoading={isLoading}
            whichTable='archive'
            className={styles.container}
            // required={false}
            requiredAction={true}
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

export default memo(DevicesArchiveTable)
