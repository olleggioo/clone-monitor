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
import { deviceUpdateManyPool } from '@/atoms/appDataAtom'
import { Button } from '@/ui'
import { sidebarStatus } from '@/atoms'
import Disperse from '@/modals/Disperse'
import { deviceAPI } from '@/api'
import { ErrorPopup } from '@/components'
import { useSnackbar } from 'notistack'
import TestTable from '@/components/Table/TestTable'
import styles from "./DeviceTable.module.scss"

const DevicesTableClient: FC<{
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
  const router = useRouter()
  const {enqueueSnackbar} = useSnackbar()

  const handleDeviceClick = (id: string) => {
    
    window.open(`/devices/${id}`, "_blank")
  }

  const [sbStatus, setSbstatus] = useAtom(sidebarStatus)
  const rows = getDevicesTableData(devices, handleDeviceClick, sbStatus)

  const tableDropDownItems: DropdownItemI[] = [
    {
      text: 'Перезагрузить',
      icon: <IconRefresh width={20} height={20} />,
      onClick: () => {}
    },
  ]
  return (
    <>
      {modal && <PoolSettingsModal id={poolId} onClose={() => setModal(false)} />}
      {/* {modalUpdate && <PoolDefault onClose={() => setModelUpdate(false)} />} */}
      {modalDisperse && <Disperse id={poolId} onClose={() => setModalDisperse(false)} />}
      {sucessReload && <ErrorPopup isSuccess={sucessReload} text='Операция успешна. Устройства перезагрузяться в течении 30 секунд.' />}
       <TestTable 
        columns={devicesRolledTableHead}
        rows={rows}
        dropdownItems={tableDropDownItems}
        toLink={true}
        isLoading={isLoading}
        whichTable='device'
        required={false}
        className={styles.containerClient}
      />
    </>
  )
}

export default DevicesTableClient
