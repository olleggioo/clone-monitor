import { FC, useEffect, useMemo, useState } from 'react'
import styles from './Tabs.module.scss'
import { getNumberDeclinationString, getStatusName } from '@/helpers'
import { Button, CustomSelect, IconButton } from '@/ui'
import { OptionItemI } from '@/ui/CustomSelect/CustomSelect'
import TabsControls from '@/components/TabsControls'
import { TabsControlI } from '@/components/TabsControls/TabsControls'
import { DevicesTabsI } from '@/blocks/Devices/Tabs/DevicesTabs'
import { useAtom } from 'jotai'
import { checkedAtom, deviceTabsControlsAtom, deviceUpdateManyPool, devicesUpdatesMany, devicesUserIdFilterAtom, modalInfoAtom, modalMinStateActionAtom, modalUpdateDisperseManyAtom, modalUpdateUserManyAtom, selectedInputAtom, sortConfigOptionsAtom, sortFilterAtom } from '@/atoms/appDataAtom'
import { Fab, Tooltip } from '@mui/material'
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import { IconChart, IconCpu, IconDevice, IconEdit, IconEdit2, IconMoreVertical, IconPlay, IconRefresh, IconTrash } from '@/icons'
import { DropdownItemI } from '@/ui/Dropdown/Dropdown'
import DropdownTest from '@/ui/Dropdown/DropdownTest'
import DropdownActions from '@/ui/Dropdown/DropdownActions'
import UpdateUserMany from '@/modals/PoolSettings/UpdateUserMany'
import Alert from '@/modals/Areas/Alert'
import { deviceAPI } from '@/api'
import IconSliders from '@/icons/Sliders'
import IconPower from '@/icons/Power'

const COUNT_OPTIONS: OptionItemI[] = [
  { label: '15', value: '15' },
  { label: '30', value: '30' },
  { label: '50', value: '50' },
  { label: '100', value: '100' },
  
]

const DevicesTabsManager: FC<DevicesTabsI> = ({
  filterStatus,
  statuses,
  onTabChange,
  onCountChange
}) => {
  const [currentTabTest, setCurrentTabTest] = useAtom(deviceTabsControlsAtom)
  const [currentTab, setCurrentTab] = useState("Все")
  const [selectedCount, setSelectedCount] = useState(COUNT_OPTIONS[3])

  const [state, setCheckboxFilter] = useAtom(devicesUserIdFilterAtom)
  const [checked, setChecked] = useAtom(checkedAtom)
  
  const [sortFilter, setSortFilter] = useAtom(sortFilterAtom)
  const [selectedSort, setSelectedSort] = useState({
    label: "Сортировка",
    value: null
  })
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null); 
  const [selected, setSelected] = useAtom(selectedInputAtom)
  const [updateManyUserModal, setUpdateManyUserModal] = useAtom(modalUpdateUserManyAtom)
  const [alertMessage, setAlertMessage] = useState(false)
  const [modalUpdate, setModelUpdate] = useAtom(deviceUpdateManyPool)
  const [modalInfo, setModalInfo] = useAtom(modalInfoAtom)
  const [modalDisperseMany, setModalDisperseMany] = useAtom(modalUpdateDisperseManyAtom)
  const [sucessReload, setSuccessReload] = useState(false)
  const [deviceUpdate, setDeviceUpdate] = useAtom(devicesUpdatesMany)
  const countSuffix = getNumberDeclinationString(state.length, [
    'устройство',
    'устройства',
    'устройств'
  ])
  const [modalMinState, setModalMinState] = useAtom(modalMinStateActionAtom)

  const [modalEnableManyDevices, setModalEnableManyDevices] = useState(false)
  const [modalDisableManyDevices, setModalDisableManyDevices] = useState(false)

  const tabControls: any[] = useMemo(() => {
    const statusList = statuses && statuses.map((status) => {
      const text = getStatusName(status.name)
      const count = filterStatus && filterStatus.length !== 0
        ? filterStatus.some((filterStat: any) => filterStat.value === status.id)
          ? status.count
          : undefined
        : status.count;
        return {
          text,
          id: status.id,
          mod: status.color,
          count
        }
    });
    return [{ text: 'Все' }, ...statusList]
  }, [statuses]);

  // const tabControls: TabsControlI[] = useMemo(() => {
  //   const statusList = statuses.map((status) => {
  //     const text = getStatusName(status.name)
  //     const count = !!filterStatus
  //       ? filterStatus === status.id
  //         ? status.count
  //         : undefined
  //       : status.count
  //     return {
  //       text,
  //       id: status.id,
  //       mod: status.color,
  //       count
  //     }
  //   })

  //   return [{ text: 'Все' }, ...statusList]
  // }, [statuses])
  const [sortConfigOpt, setSortConfigOpt] = useAtom(sortConfigOptionsAtom); 
  useEffect(() => {
    if(selectedSort.value !== null) {
      let direction = 'ASC';
      if (sortConfig && sortConfig.key === selectedSort.label && sortConfig.direction === 'ASC') {
        direction = 'DESC';
      }
      const key = selectedSort.label
      setSortConfig({ key, direction });

      const orders: any = {}
      switch(key) {
        case 'IP':
          orders.ipaddr = direction
          break
        case 'SN':
          orders.sn = direction
          break
        default: {}
      }
      setSortFilter(orders)
    } else {
      setSortConfigOpt(null)
      setSortFilter(null)
    }
  }, [selectedSort])

  const handleTabsChange = (value: string, id?: string) => {
    // console.log("values", value, id, currentTab)
    onTabChange(id || null)
    setSelected(false)
    setCheckboxFilter([])
    setChecked([])
    setCurrentTabTest({
      id: id || null,
      value
    })
    setCurrentTab(value)
    // setCheckboxFilter([])
  }

  const handleSelectChange = (option: OptionItemI) => {
    onCountChange(Number(option.value))
    setSelectedCount(option)
    setSelected(false)
    setCheckboxFilter([])
    setChecked([])
    // setCheckboxFilter([])

  }

  useEffect(() => {
    onTabChange(currentTabTest.id || null)
    setCurrentTab(currentTabTest.value)
  }, [currentTabTest, filterStatus])

  const [showText, setShowText] = useState(false);

  const handleMouseEnter = () => {
    setShowText(true);
  };

  const handleMouseLeave = () => {
    setShowText(false);
  };

  const onChangeSelect = (option: any) => {
    setSelectedSort((prevState: any) => {
      return {
        ...prevState,
        label: option.label,
        value: option.value,
      }
    })
  }

  const handleResetSort = (e: any) => {
    setSortFilter({})
    setSelectedSort({label: "Сортировка", value: null})
  }

  const handleUpdateModalUser = (e: any) => {
    setUpdateManyUserModal(true)
  }

  const reloadDevicesSubmit = () => {
    if(state.length > 0) {
        deviceAPI.reloadManyDevices({
            where: state.map(item => ({ id: item.id }))
        })
            .then(res => {
              setAlertMessage(false)
              setModalInfo({
                open: true,
                action: "Перезагрузка",
                status: "Успешно",
                textInAction: "Устройства перезагрузятся в течении 30 секунд"
              })
              setSuccessReload(true)
            })
            .catch(err => {
              setAlertMessage(false)
              setModalInfo({
                open: true,
                action: "Перезагрузка",
                status: "Ошибка",
                textInAction: "Произошла ошибка при перезагрузке устройств"
              })
              setSuccessReload(false)
            })
    }
  }

  const enableDevices = (ids: any) => {
    if(ids && ids.length !== 0) {
        const where: any = []
        ids.map((item: any) => {
            where.push({
                id: item
            })
        })
        deviceAPI.enableDevice({
            where
        }).then((res) => {
            // onClose()
            setModalInfo({
                open: true,
                action: "Изменение состояния майнинга",
                status: "Успешно",
                textInAction: "Состояние майнинга устройств изменится в течении 30 секунд"
            })
            setModalEnableManyDevices(false)
            setTimeout(() => {
              window.location.reload()
            }, 2000)
        }).catch(err => {
            setModalInfo({
                open: true,
                action: "Изменение состояния майнинга",
                status: "Ошибка",
                textInAction: "Произошла ошибка при измении состояния майнгина"
            })
            setModalEnableManyDevices(false)
        })
    }
  }

  const disableDevices = (ids: any) => {
    if(ids && ids.length !== 0) {
        const where: any = []
        ids.map((item: any) => {
            where.push({
                id: item
            })
        })
        deviceAPI.disableDevice({
            where
        }).then((res) => {
            // onClose()
            setModalInfo({
                open: true,
                action: "Изменение состояния майнинга",
                status: "Успешно",
                textInAction: "Состояние майнинга устройств изменится в течении 30 секунд"
            })
            setModalDisableManyDevices(false)
            setTimeout(() => {
              window.location.reload()
            }, 2000)
        }).catch(err => {
            setModalInfo({
                open: true,
                action: "Изменение состояния майнинга",
                status: "Ошибка",
                textInAction: "Произошла ошибка при измении состояния майнгина"
            })
            setModalDisableManyDevices(false)
        })
    }

  }

  const handleEnableDevices = () => {
    if(state.length > 0) {
      const devicesIds = state.map((item: any) => item.id)
      enableDevices(devicesIds)
    }
  }

  const handleDisableDevices = () => {
    if(state.length > 0) {
      const devicesIds = state.map((item: any) => item.id)
      disableDevices(devicesIds)
    }
  }

  const tableDropDownItems: DropdownItemI[] = [
    {
      text: 'Включить',
      icon: <IconPlay width={20} height={20} />,
      onClick: () => setModalEnableManyDevices(true)
    },
    {
      text: 'Выключить',
      icon: <IconPower width={20} height={20} />,
      onClick: () => setModalDisableManyDevices(true)
    },
    {
      text: 'Обновить клиентов',
      icon: <IconRefresh width={20} height={20} />,
      onClick: handleUpdateModalUser
    },
    {
      text: 'Обновить пулы',
      icon: <IconSliders width={20} height={20} />,
      onClick: () => setModelUpdate(true)
    },
    {
      text: 'Перезагрузить',
      icon: <IconDevice width={20} height={20} />,
      onClick: () => setAlertMessage(true)
    },
    {
      text: 'Обновить устройства',
      icon: <IconEdit2 width={20} height={20} />,
      onClick: () => setDeviceUpdate(true),
    },
    // {
    //   text: "Изменить состояние майнгина",
    //   icon: <IconChart width={20} height={20} />,
    //   onClick: () => setModalMinState(true)
    // }
  ]

  useEffect(() => {
    setAlertMessage(false)  
  }, [state])

  return (
    <div className={styles.el}>
       {alertMessage && state.length > 0 && <Alert 
        title={"Перезагрузка выделенных устройств"} 
        content={"Вы уверены что хотите перезагрузить выделенные устройства?"} 
        open={alertMessage} 
        setOpen={setAlertMessage} 
        handleDeleteClick={reloadDevicesSubmit} 
      />}
      {modalEnableManyDevices &&
        state.length > 0 &&
        <Alert 
          title={"Включение выделенных устройств"} 
          content={"Вы уверены что хотите включить выделенные устройства?"} 
          open={modalEnableManyDevices} 
          setOpen={setModalEnableManyDevices} 
          handleDeleteClick={handleEnableDevices} 
        />
      }

      {modalDisableManyDevices &&
        state.length > 0 &&
        <Alert 
          title={"Выключение выделенных устройств"} 
          content={"Вы уверены что хотите выключить выделенные устройства?"} 
          open={modalDisableManyDevices} 
          setOpen={setModalDisableManyDevices} 
          handleDeleteClick={handleDisableDevices} 
        />
      }
      <TabsControls
        items={tabControls} 
        currentTab={currentTab}
        onChange={handleTabsChange}
      />
      <div className={styles.pagAndAction}>
        {state.length > 0 && <DropdownActions 
            items={tableDropDownItems}
            className={styles.buttonMoreActions}
            // className={styles.actions}
        />}
        <CustomSelect 
          options={[
            {label: "IP", value: "IP"},
            {label: "SN", value: "SN"},
            {label: "Сортировка", value: null}
          ]}
          className={styles.selects}
          selectedOption={selectedSort}
          onChange={(option: any) => setSelectedSort((prevState: any) => {
            return {
              ...prevState,
              label: option.label,
              value: option.value,
            }
          })}
        />
        {/* <Tooltip title="Сбросить сортировку" aria-label="add" sx={{zIndex: 1, background: "#5820f6"}} onClick={handleResetSort}>
          <Fab color="primary" size='small'>
            <SettingsBackupRestoreIcon style={{fontSize: 20}} />
          </Fab>
        </Tooltip> */}
        <CustomSelect
          // type={'small'}
          options={COUNT_OPTIONS}
          selectedOption={selectedCount}
          onChange={handleSelectChange}
          className={styles.pages}
        />
        
      </div>
    </div>
  )
}

export default DevicesTabsManager
