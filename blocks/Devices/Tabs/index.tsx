import { FC, memo, useEffect, useMemo, useState } from 'react'
import styles from './Tabs.module.scss'
import { getNumberDeclinationString, getStatusName } from '@/helpers'
import { Button, CustomSelect, IconButton } from '@/ui'
import { OptionItemI } from '@/ui/CustomSelect/CustomSelect'
import TabsControls from '@/components/TabsControls'
import { TabsControlI } from '@/components/TabsControls/TabsControls'
import { DevicesTabsI } from '@/blocks/Devices/Tabs/DevicesTabs'
import { useAtom } from 'jotai'
import { checkedAtom, deviceTabsControlsAtom, deviceUpdateManyPool, devicesDataAtom, devicesUpdatesMany, devicesUserIdFilterAtom, modalInfoAtom, modalMinStateActionAtom, modalUpdateDisperseManyAtom, modalUpdateOwnerManyAtom, modalUpdateUserManyAtom, selectedInputAtom, sortConfigOptionsAtom, sortFilterAtom } from '@/atoms/appDataAtom'
import { Fab, tabsClasses, Tooltip } from '@mui/material'
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import { IconBack, IconChart, IconCog, IconCpu, IconDevice, IconEdit, IconEdit2, IconInfo, IconMoreVertical, IconPlay, IconRefresh, IconTrash, IconUser } from '@/icons'
import { DropdownItemI } from '@/ui/Dropdown/Dropdown'
import DropdownTest from '@/ui/Dropdown/DropdownTest'
import DropdownActions from '@/ui/Dropdown/DropdownActions'
import UpdateUserMany from '@/modals/PoolSettings/UpdateUserMany'
import Alert from '@/modals/Areas/Alert'
import { deviceAPI } from '@/api'
import IconSliders from '@/icons/Sliders'
import IconRollBrush from '@/icons/RollBrush'
import IconDashboardPerfomance from '@/icons/DashboardPerfomance'
import IconSave2 from '@/icons/Save2'
import IconPower from '@/icons/Power'
import IconArchive from '@/icons/Archive'
import IconTool from '@/icons/Tool'
import { hasAccess } from '@/helpers/AccessControl'
import { requestsAccessMap } from '@/helpers/componentAccessMap'
import { useSnackbar } from 'notistack'
import IconOff from '@/icons/Off'

const COUNT_OPTIONS: OptionItemI[] = [
  { label: '15', value: '15' },
  { label: '30', value: '30' },
  { label: '50', value: '50' },
  { label: '100', value: '100' },
]

const SORT_OPTIONS: OptionItemI[] = [
  {label: "IP", value: "IP"},
  {label: "SN", value: "SN"},
  {label: "Сортировка", value: null}
]

const SELECTED_OPTION: OptionItemI = {
  label: "Сортировка",
  value: null
}

const DevicesTabs: FC<DevicesTabsI> = ({
  filterStatus,
  statuses,
  onTabChange,
  onCountChange
}) => {
  const roleId = localStorage.getItem(`${process.env.API_URL}_role`)
  const [currentTabTest, setCurrentTabTest] = useAtom(deviceTabsControlsAtom)
  const [currentTab, setCurrentTab] = useState("Все")
  const [selectedCount, setSelectedCount] = useState(COUNT_OPTIONS[3])
  
  const [state, setCheckboxFilter] = useAtom(devicesUserIdFilterAtom)
  const [checked, setChecked] = useAtom(checkedAtom)

  const [sortFilter, setSortFilter] = useAtom(sortFilterAtom)
  const [selectedSort, setSelectedSort] = useState(SELECTED_OPTION)
  const [data, setData] = useAtom(devicesDataAtom)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null); 
  const [selected, setSelected] = useAtom(selectedInputAtom)
  const [updateManyUserModal, setUpdateManyUserModal] = useAtom(modalUpdateUserManyAtom)
  const [updateManyOwnerModal, setUpdateManyOwnerModal] = useAtom(modalUpdateOwnerManyAtom)
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
  const [deleteManyDevices, setDeleteManyDevices] = useState(false)
  const [modalReserveManyDevices, setModalReserveManyDevices] = useState(false)
  const [modalRestoreManyDevices, setModalRestoreManyDevices] = useState(false)
  const [modalEnableManyDevices, setModalEnableManyDevices] = useState(false)
  const [modalDisableManyDevices, setModalDisableManyDevices] = useState(false)
  const [modalArchiveManyDevices, setModalArchiveManyDevices] = useState(false)
  const [modalRepairManyDevices, setModalRepairManyDevices] = useState(false)
  const [modalDeviceOutput, setModalDeviceOutput] = useState(false)
  const [modalEnableBlink, setModalEnableBlink] = useState(false)
  const [modalDisableBlink, setModalDisableBlink] = useState(false)
 
  const tabControls: any[] = useMemo(() => {
    const statusList = statuses && statuses.map((status) => {
      const text = status.description;
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
      };
    });

    const indexOffline = statusList.findIndex(status => status.text === "Не в сети");
    const indexProblem = statusList.findIndex(status => status.text === "Проблема");

    // Меняем элементы местами, если оба найдены
    if (indexOffline !== -1 && indexProblem !== -1) {
      [statusList[indexOffline], statusList[indexProblem]] = [statusList[indexProblem], statusList[indexOffline]];
    }

    return [{ text: 'Все' }, ...statusList];
  }, [statuses]);
  
  const [_, setSortConfigOpt] = useAtom(sortConfigOptionsAtom); 

  const handleTabsChange = (value: string, id?: string) => {
    onTabChange(id || null)
    setSelected(false)
    setCheckboxFilter([])
    setChecked([])
    setCurrentTabTest({
      id: id || null,
      value
    })
    setCurrentTab(value)
  }

  const handleSelectChange = (option: OptionItemI) => {
    onCountChange(Number(option.value))
    setSelectedCount(option)
    setSelected(false)
    setCheckboxFilter([])
    setChecked([])
    // setCheckboxFilter([])

  }

  const [showText, setShowText] = useState(false);

  const handleMouseEnter = () => {
    setShowText(true);
  };

  const handleMouseLeave = () => {
    setShowText(false);
  };

  const deleteFromArrayDevices = (ids: any) => {
    ids.forEach((itemId: any) => {
      setData((prevState: any) => {
        return {
          ...prevState,
          devices: {
            rows: prevState.devices.rows.filter((item: any) => item.id !== itemId.id),
            total: prevState.devices.total - 1
          }
        }
      })
    })
  }

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

  const handleUpdateModalOwner = (e: any) => {
    setUpdateManyOwnerModal(true)
  }

  const restoreDevicesSubmit = () => {
    if(state.length > 0) {
      deviceAPI.restoreDeviceById({
        where: state.map(item => ({ id: item.id }))
      }).then(() => {
        setModalRestoreManyDevices(false)
        setModalInfo({
          open: true,
          action: "Восстановление",
          status: "Успешно",
          textInAction: "Запрос на восстановление устройств в очереди"
        })
      })
      .catch(err => {
        setModalRestoreManyDevices(false)
        setModalInfo({
          open: true,
          action: "Восстановление",
          status: "Ошибка",
          textInAction: "Произошла ошибка при восстановлении устройств"
        })
      })
    }
  }

  const archiveDevicesSubmit = () => {
    if(state.length > 0) {
      deviceAPI.archiveMassDevice({
        where: state.map(item => ({ id: item.id }))
      }).then(() => {
        setModalArchiveManyDevices(false)
        setModalInfo({
          open: true,
          action: "Расторжение",
          status: "Успешно",
          textInAction: "Запрос на расторжение устройств в очереди"
        })
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      })
      .catch(err => {
        setModalArchiveManyDevices(false)
        setModalInfo({
          open: true,
          action: "Расторжение",
          status: "Ошибка",
          textInAction: "Произошла ошибка при расторжении устройств"
        })
      })
    }
  }

  const repairDevicesSubmit = () => {
    if(state.length > 0) {
      deviceAPI.repairMassDevice({
        where: state.map(item => ({ id: item.id }))
      }).then(() => {
        setModalRepairManyDevices(false)
        setModalInfo({
          open: true,
          action: "Ремонт",
          status: "Успешно",
          textInAction: "Запрос на ремонт устройств в очереди"
        })
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      })
      .catch(err => {
        setModalRepairManyDevices(false)
        setModalInfo({
          open: true,
          action: "Ремонт",
          status: "Ошибка",
          textInAction: "Произошла ошибка при ремонте устройств"
        })
      })
    }
  }

  const enableBlinkSubmit = () => {
    if(state.length > 0) {
      deviceAPI.updateDeviceBlinkOn({
        where: state.map(item => ({ id: item.id }))
      }).then(() => {
        setModalEnableBlink(false)
        setModalInfo({
          open: true,
          action: "Включение блинка",
          status: "Успешно",
          textInAction: "Запрос на включение блинка в очереди"
        })
      })
      .catch(err => {
        setModalEnableBlink(false)
        setModalInfo({
          open: true,
          action: "Включение блинка",
          status: "Ошибка",
          textInAction: "Произошла ошибка на включение блинка."
        })
      })
    }
  }

  const disableBlinkSubmit = () => {
    if(state.length > 0) {
      deviceAPI.updateDeviceBlinkOff({
        where: state.map(item => ({ id: item.id }))
      }).then(() => {
        setModalDisableBlink(false)
        setModalInfo({
          open: true,
          action: "Выключение блинка",
          status: "Успешно",
          textInAction: "Запрос на выключение блинка в очереди"
        })
      })
      .catch(err => {
        setModalDisableBlink(false)
        setModalInfo({
          open: true,
          action: "Выключение блинка",
          status: "Ошибка",
          textInAction: "Произошла ошибка на выключение блинка."
        })
      })
    }
  }

  const reserveDevicesSubmit = () => {
    if(state.length > 0) {
      deviceAPI.reserveDeviceById({
        where: state.map(item => ({ id: item.id }))
      }).then(() => {
        setModalReserveManyDevices(false)
        setModalInfo({
          open: true,
          action: "Резервирование",
          status: "Успешно",
          textInAction: "Запрос на резервирование устройств в очереди"
        })
      })
      .catch(err => {
        setModalReserveManyDevices(false)
        setModalInfo({
          open: true,
          action: "Резервирование",
          status: "Ошибка",
          textInAction: "Произошла ошибка при резервировании устройств"
        })
      })
    }
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

  const tableDropDownItems: DropdownItemI[] = []

  tableDropDownItems.unshift({
    text: 'Выключить блинк',
    icon: <IconOff width={20} height={20} />,
    onClick: () => setModalDisableBlink(true)
  })

  tableDropDownItems.unshift({
    text: 'Включить блинк',
    icon: <IconPlay width={20} height={20} />,
    onClick: () => setModalEnableBlink(true)
  })


  if(hasAccess(requestsAccessMap.enableDevice) || hasAccess(requestsAccessMap.enableDeviceAuthedAreaId)) {
    tableDropDownItems.unshift({
      text: 'Включить',
      icon: <IconPlay width={20} height={20} />,
      onClick: () => setModalEnableManyDevices(true)
    })
  }

  if(hasAccess(requestsAccessMap.disableDevice) || hasAccess(requestsAccessMap.disableDeviceAuthedAreaId)) {
    tableDropDownItems.unshift({
      text: 'Выключить',
      icon: <IconPower width={20} height={20} />,
      onClick: () => setModalDisableManyDevices(true)
    })
  }

  if(hasAccess(requestsAccessMap.updateDeviceMany) || hasAccess(requestsAccessMap.updateDeviceManyAuthedUserId)) {
    tableDropDownItems.unshift({
      text: 'Восстановить',
      icon: <IconRollBrush width={20} height={20} />,
      onClick: () => setModalRestoreManyDevices(true)
    })
  }

  if(hasAccess(requestsAccessMap.createUserDevice) && 
    (hasAccess(requestsAccessMap.deleteUserDevicesMany) || hasAccess(requestsAccessMap.deleteUserDevicesManyAuthedUserId))) {
    tableDropDownItems.unshift({
      text: 'Обновить клиентов',
      icon: <IconRefresh width={20} height={20} />,
      onClick: handleUpdateModalUser
    })
  }

  if(hasAccess(requestsAccessMap.updateDeviceMany) || hasAccess(requestsAccessMap.updateDeviceManyAuthedUserId)) {
    tableDropDownItems.unshift({
      text: 'Обновить владельцев',
      icon: <IconUser width={20} height={20} />,
      onClick: handleUpdateModalOwner
    })
  }

  if(hasAccess(requestsAccessMap.updateManyDevicesPools) ||
    hasAccess(requestsAccessMap.updateManyDevicesPoolsAuthedAreaId) || 
    hasAccess(requestsAccessMap.updateManyDevicesPoolsAuthedUserId)) {
    tableDropDownItems.unshift({
      text: 'Обновить пулы',
      icon: <IconSliders width={20} height={20} />,
      onClick: () => setModelUpdate(true)
    })
  }

  if(hasAccess(requestsAccessMap.updateDeviceMany) || hasAccess(requestsAccessMap.updateDeviceManyAuthedUserId)) {
    tableDropDownItems.unshift({
      text: 'Обновить устройства',
      icon: <IconEdit2 width={20} height={20} />,
      onClick: () => setDeviceUpdate(true),
    })
  }

  if(hasAccess(requestsAccessMap.reloadManyDevices) || hasAccess(requestsAccessMap.reloadManyDevicesAuthedUserId)) {
    tableDropDownItems.unshift({
      text: 'Перезагрузить',
      icon: <IconRefresh width={20} height={20} />,
      onClick: () => setAlertMessage(true)
    })
  }

  if(hasAccess(requestsAccessMap.updateManyOverclock) || hasAccess(requestsAccessMap.updateManyOverclockAuthedAreaId)) {
    tableDropDownItems.unshift({
      text: 'Разогнать',
      icon: <IconDashboardPerfomance width={20} height={20} />,
      onClick: () => setModalDisperseMany(true)
    })
  }
  if(hasAccess(requestsAccessMap.deleteManyDevices) || hasAccess(requestsAccessMap.deleteManyDevicesAuthedUserId)) {
    tableDropDownItems.push({
      text: "Удалить",
      icon: <IconTrash width={20} height={20} />,
      onClick: () => setDeleteManyDevices(true),
      mod: "red"
    })
  }

  if(hasAccess(requestsAccessMap.reserveDeviceById) || hasAccess(requestsAccessMap.reserveDeviceByIdAuthedAreaId)) {
    tableDropDownItems.unshift({
        text: 'Зарезервировать',
        icon: <IconSave2 width={20} height={20} />,
        onClick: () => setModalReserveManyDevices(true)
    })
  }

  if(currentTabTest.value === "Не в сети") {
    if(hasAccess(requestsAccessMap.updateDeviceMany) || hasAccess(requestsAccessMap.updateDeviceManyAuthedUserId)) {
      tableDropDownItems.unshift({
        text: "В ремонт",
        icon: <IconTool width={20} height={20} />,
        onClick: () => setModalRepairManyDevices(true)
      })
    }
    if(hasAccess(requestsAccessMap.archiveMassDevice) || hasAccess(requestsAccessMap.archiveMassDeviceAuthedAreaId)) {
      tableDropDownItems.unshift({
        text: "В расторжение",
        icon: <IconArchive width={20} height={20} />,
        onClick: () => setModalArchiveManyDevices(true)
      })
    }
  }

  if(currentTabTest.value === "В ремонте") {
    if(hasAccess(requestsAccessMap.archiveMassDevice) || hasAccess(requestsAccessMap.archiveMassDeviceAuthedAreaId)) {
      tableDropDownItems.unshift({
        text: "В расторжение",
        icon: <IconArchive width={20} height={20} />,
        onClick: () => setModalArchiveManyDevices(true)
      })
    }
    if(hasAccess(requestsAccessMap.updateDeviceMany)) {
      tableDropDownItems.unshift({
        text: "Вывести из ремонта",
        icon: <IconBack width={20} height={20} />,
        onClick: () => setModalDeviceOutput(true)
      })
    }
  }

  const handleDeleteManyDevices = () => {
    if(state && state.length !== 0) {
      deviceAPI.deleteManyDevices({
        where: state.map(item => ({ id: item.id }))
      }).then(res => {
        deleteFromArrayDevices(state)
        setModalInfo({
          open: true,
          action: "Удаление устройств",
          status: "Успешно",
          textInAction: "Выделенные устройства удалены"
        })
      }).catch(err => {
        setModalInfo({
          open: true,
          action: "Удаление устройств",
          status: "Ошибка",
          textInAction: "Произошла ошибка при удалении выделенных устройств"
        })
      }).finally(() => {
        setDeleteManyDevices(false)
      })
    }
  }

  const {enqueueSnackbar} = useSnackbar()

  const outputDeviceSubmit = () => {
    if(state && state.length !== 0) {
      deviceAPI.updateDeviceMany({
        where: state.map(item => ({ id: item.id }))
      }, {
        statusId: "9a8471f1-861f-11ee-932b-300505de684f"
      }).then(res => {
        enqueueSnackbar("Устройства выведены из ремонта. Страница перезагрузится через 3 секунды.", {
          variant: "info",
          autoHideDuration: 3000
        })
        setTimeout(() => {
          window.location.reload()
        }, 3000)
      }).catch(err => {
        enqueueSnackbar("Произошла ошибка при выводе устройств из ремонта.")
      })
    }
  }

  const onChangeSort = (option: any) => {
    setSelectedSort((prevState: any) => {
      const direction = 
        sortConfig && sortConfig.key === option.label && sortConfig.direction === 'ASC' 
          ? 'DESC' 
          : 'ASC';
      
      // Обновляем sortConfig
      setSortConfig({
        key: option.label,
        direction: direction,
      });
  
      // Создаём orders для sortFilter
      const orders: any = {};
      switch (option.label) {
        case 'IP':
          orders.ipaddr = direction;
          break;
        case 'SN':
          orders.sn = direction;
          break;
        default:
          break;
      }
  
      // Обновляем sortFilter
      setSortFilter(orders);
  
      return {
        ...prevState,
        label: option.label,
        value: option.value,
      };
    });
  };

  useEffect(() => {
    setAlertMessage(false)  
  }, [state])

  // useEffect(() => {
  //   if(selectedSort.value !== null) {
  //     let direction = 'ASC';
  //     if (sortConfig && sortConfig.key === selectedSort.label && sortConfig.direction === 'ASC') {
  //       direction = 'DESC';
  //     }
  //     const key = selectedSort.label
  //     setSortConfig({ key, direction });

  //     const orders: any = {}
  //     switch(key) {
  //       case 'IP':
  //         orders.ipaddr = direction
  //         break
  //       case 'SN':
  //         orders.sn = direction
  //         break
  //       default: {}
  //     }
  //     setSortFilter(orders)
  //   } else {
  //     setSortConfigOpt(null)
  //     setSortFilter(null)
  //   }
  // }, [selectedSort])

  useEffect(() => {
    onTabChange(currentTabTest.id || null)
    setCurrentTab(currentTabTest.value)
  }, [currentTabTest, filterStatus])

  return (
    <div className={styles.el}>
       {alertMessage && 
        state.length > 0 && 
        <Alert 
          title={"Перезагрузка выделенных устройств"} 
          content={"Вы уверены что хотите перезагрузить выделенные устройства?"} 
          open={alertMessage} 
          setOpen={setAlertMessage} 
          handleDeleteClick={reloadDevicesSubmit} 
        />
      }
      {modalDeviceOutput &&
      state.length > 0 && 
      <Alert 
        title={"Вывод из ремонта выделенных устройств"} 
        content={"Вы уверены что хотите вывести из ремонта выделенные устройства?"} 
        open={modalDeviceOutput} 
        setOpen={setModalDeviceOutput} 
        handleDeleteClick={outputDeviceSubmit} 
      />}
      {modalReserveManyDevices &&
        state.length > 0 &&
        <Alert 
          title={"Резервирование выделенных устройств"} 
          content={"Вы уверены что хотите зарезервировать выделенные устройства?"} 
          open={modalReserveManyDevices} 
          setOpen={setModalReserveManyDevices} 
          handleDeleteClick={reserveDevicesSubmit} 
        />
      }

      {modalEnableBlink &&
        state.length > 0 &&
        <Alert 
          title={"Включение блинка на выделенных устройствах"} 
          content={"Вы уверены что хотите включить блинк на выделенных устройствах?"} 
          open={modalEnableBlink} 
          setOpen={setModalEnableBlink} 
          handleDeleteClick={enableBlinkSubmit} 
        />
      }

      {modalDisableBlink &&
        state.length > 0 &&
        <Alert 
          title={"Выключение блинка на выделенных устройствах"} 
          content={"Вы уверены что хотите выключить блинк на выделенных устройствах?"} 
          open={modalDisableBlink} 
          setOpen={setModalDisableBlink} 
          handleDeleteClick={disableBlinkSubmit} 
        />
      }

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

      {modalRestoreManyDevices &&
        state.length > 0 &&
        <Alert 
          title={"Восстановление выделенных устройств"} 
          content={"Вы уверены что хотите восстановить выделенные устройства?"} 
          open={modalRestoreManyDevices} 
          setOpen={setModalRestoreManyDevices} 
          handleDeleteClick={restoreDevicesSubmit} 
        />
      }

      {modalArchiveManyDevices &&
        state.length > 0 &&
        <Alert 
          title={"Расторжение выделенных устройств"} 
          content={"Вы уверены что хотите расторгнуть выделенные устройства?"} 
          open={modalArchiveManyDevices} 
          setOpen={setModalArchiveManyDevices} 
          handleDeleteClick={archiveDevicesSubmit} 
        />
      }

      {modalRepairManyDevices &&
        state.length > 0 &&
        <Alert 
          title={"Ремонт выделенных устройств"} 
          content={"Вы уверены что хотите перенести в ремонт выделенные устройства?"} 
          open={modalRepairManyDevices} 
          setOpen={setModalRepairManyDevices} 
          handleDeleteClick={repairDevicesSubmit} 
        />
      }

      <TabsControls
        items={tabControls} 
        currentTab={currentTab}
        onChange={handleTabsChange}
      />
      {deleteManyDevices && <Alert 
        title={"Удаление устройств"} 
        content={"Вы уверены что хотите удалить выделенные устройства?"} 
        open={deleteManyDevices} 
        setOpen={setDeleteManyDevices} 
        handleDeleteClick={handleDeleteManyDevices} 
      />}
      <div className={styles.pagAndAction}>
        {state.length > 0 && <DropdownActions 
            items={tableDropDownItems}
            className={styles.buttonMoreActions}
        />}
        <CustomSelect 
          options={SORT_OPTIONS}
          className={styles.selects}
          selectedOption={selectedSort}
          onChange={onChangeSort}
        />
        <CustomSelect
          options={COUNT_OPTIONS}
          selectedOption={selectedCount}
          onChange={handleSelectChange}
          className={styles.pages}
        />
        
      </div>
    </div>
  )
}

export default memo(DevicesTabs)
