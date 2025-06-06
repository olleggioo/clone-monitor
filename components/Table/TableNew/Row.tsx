import { FC, MouseEvent, memo, useEffect, useMemo, useState } from "react"
import { TableRowI } from "../Table"
import TableCell from "../CopyTable/TableCell"
import { Dropdown, IconButton } from "@/ui"
import styles from "./TableNew.module.scss"
import { useAtom } from "jotai"
import { devicesUserIdFilterAtom, devicesUserIdMiningFilterAtom, isReservedAtom, modalInfoAtom, modalMinStateAtom, modalReserveDevice, selectedInputAtom } from "@/atoms/appDataAtom"
import DropdownTest from "@/ui/Dropdown/DropdownTest"
import { IconCog, IconDevice, IconHelp, IconInfo, IconMoreVertical, IconPieChart, IconPlay, IconSave, IconServer } from "@/icons"
import { DropdownItemI } from "@/ui/Dropdown/Dropdown"
import { deviceAPI } from "@/api"
import Alert from "@/modals/Areas/Alert"
import { RoleGroup } from "@/const"
import { usersListAtom } from "@/atoms"
import Checkbox from "@/components/Checkbox"
import { archiveDeviceSubmit, disableDevice, enableDevice, repairDeviceSubmit, reserveDeviceSubmit, restoreDeviceSubmit } from "./../TestTable/requests"
import IconArchive from "@/icons/Archive"
import IconTool from "@/icons/Tool"
import IconSave2 from "@/icons/Save2"
import IconRollBrush from "@/icons/RollBrush"
import IconPower from "@/icons/Power"
import Cell from "./Cell"
import classNames from "classnames"
import IconSave3 from "@/icons/Save3"
import { hasAccess } from "@/helpers/AccessControl"
import { requestsAccessMap } from "@/helpers/componentAccessMap"
import IconOff from "@/icons/Off"

interface TableRowNewI extends TableRowI {
  index: number
  length?: number
  whichTable?: string
  toLink?: boolean
  style?: any
  view?: any
  isReserved?: boolean
  selectionStart: any
  selectionEnd: any
  isSelecting: any
  handleMouseDown: any
  handleMouseUp: any
  handleMouseEnter: any
  selectedRow: any
  onChangeInput: any
  checkedI: number
  status?: string
  changePoolStatusVerbose?: any
  lastSeenNormal?: any
}

const Row: FC<TableRowNewI> = ({
    id,
    devicesId,
    userId,
    status,
    columns,
    isLoading,
    onClick,
    dropdownItems,
    // selectedAll = false,
    required = true,
    requiredAction,
    index,
    length,
    whichTable,
    toLink,
    style,
    view,
    isReserved,
    selectionStart,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    selectedRow,
    onChangeInput,
    checkedI,
    changePoolStatusVerbose,
    lastSeenNormal
  }) => {
  const [usersList, setUsersList] = useAtom(usersListAtom)
  const [selectedAll, setSelected] = useAtom(selectedInputAtom)
  const roleId = localStorage.getItem(`${process.env.API_URL}_role`)
  const [textColor, setTextColor] = useState<string>('black');

  const [state, setState] = useAtom(devicesUserIdFilterAtom)
  const [checked, setChecked] = useState(state.filter((item: any) => item.id === id)[0]?.flag || false);
  const [lastUpdatedItem, setLastUpdatedItem] = useState(null);

  const [modalInfo, setModalInfo] = useAtom(modalInfoAtom)
  const [deviceId, setDeviceId] = useState<any>(null)
  const [agreedModal, setAgreedModal] = useState(false)
  const [agreedModalEnable, setAgreedModalEnalbe] = useState(false)
  const [stateDevicesId, setStateDevicesId] = useAtom(devicesUserIdMiningFilterAtom)
  const [modalReserve, setModalReserve] = useState(false)
  const [modalRestore, setModalRestore] = useState(false)
  const [modalArchive, setModalArchive] = useState(false)
  const [modalBlinkOn, setModalBlinkOn] = useState(false)
  const [modalBlinkOff, setModalBlinkOff] = useState(false)
  const [modalRemoveFromRepair, setModalFromRepair] = useState(false)
  const [modalRepairNotOnline, setMOdalRepiarNotOnline] = useState(false)
  const [modalRemoveFromArchive, setModalRemoveFromArchive] = useState(false)
  const [modalRemoveFromArchiveNotOnline, setModalRemoveFromArchiveNotOnline] = useState(false)
  const [modalRepair, setModalRepair] = useState(false)
  const [isReservedSingleDevice, setIsReservedSingleDevice] = useAtom(isReservedAtom)

  const handleClick = (evt: MouseEvent<HTMLDivElement>) => {
    const targetEl = evt.target as Element
    const isDropdownClick = !!targetEl.closest('[data-dropdown-id]')
    if (!isDropdownClick) {
      onClick && onClick()
    }
  }

  const handleLinkDevice = (evt: any) => {
    const targetEl = evt.target as Element
    const isDropdownClick = !!targetEl.closest('[data-dropdown-id]')
    if (!isDropdownClick) {
      onClick && onClick()
    }
  }

  const hasUserId = (userIdToCheck: string) => {
    return state.some(device => device.id === userIdToCheck);
  };

  const handleCheckboxChange = (evt: any) => {
    const newChecked = !checked;
    if (newChecked === checked) {
      return;
    }
    const currentRow = state.filter((item: any) => item.id === id);
    setState((prevState) => {
      const uniqueState = prevState.filter(
        (item, index, array) => array.findIndex((t) => t.id === item.id) === index
      );
  
      if (newChecked && currentRow.length === 0) {
        setTextColor('red')
        return [...uniqueState, { flag: true, id }];
      } else {
        setTextColor('black')
        return uniqueState.filter((device) => device.id !== id);
      }
    });
    if(devicesId !== undefined) {
      setStateDevicesId((prevState: any) => {
        const uniqueState = prevState.filter(
          (item: any, index: any, array: any) => array.findIndex((t: any) => t.devicesId === item.devicesId) === index
        );
        if (newChecked) {
          setTextColor('red')
          return [...uniqueState, { devicesId }];
        } else {
          setTextColor('black')
          return uniqueState.filter((device: any) => device.devicesId !== devicesId);
        }
      })
    }
  
    setChecked(newChecked);
  };

  useEffect(() => {
    setChecked(false);
    setSelected(false);
  }, []);

  const restoreDeviceModal = (id?: string) => {
    if(id) {
      setDeviceId(id)
      setModalRestore(true)
    }
  }

  const restoreDeviceUserModal = (id?: string) => {
    if(id) {
      const userDevices = usersList.filter((item: any) => item.id === id)[0].userDevices
      if(userDevices.length !== 0) {
        setDeviceId(userDevices.map(item => ({id: item.deviceId})))
        setModalRestore(true)
      }
    }
  }

  const reserveDeviceUserModal = (id?: string) => {
    if(id) {
      const userDevices = usersList.filter((item: any) => item.id === id)[0].userDevices
      if(userDevices.length !== 0) {
        setDeviceId(userDevices.map(item => ({id: item.deviceId})))
        setModalReserve(true)
      }
    }
  }

  const reserveDeviceModal = (id?: string) => {
    if(id) {
      setDeviceId(id)
      setModalReserve(true)
    }
  }

  const disableDeviceModal = (id?: string) => {
    if(id) {
      setDeviceId(id)
      setAgreedModal(true)
    }
  }

  const enableDeviceModal = (id?: string) => {
    if(id) {
      setDeviceId(id)
      setAgreedModalEnalbe(true)
    }
  }

  const archiveDeviceModal = (id?: string) => {
    if(id) {
      setDeviceId(id)
      setModalArchive(true)
    }
  }

  const enableBlinkModal = (id?: string) => {
    if(id) {
      setDeviceId(id)
      setModalBlinkOn(true)
    }
  }

  const disableBlinkModal = (id?: string) => {
    if(id) {
      setDeviceId(id)
      setModalBlinkOff(true)
    }
  }

  const removeFromRepair = (id?: string) => {
    if(id) {
      setDeviceId(id)
      setModalFromRepair(true)
    }
  }

  const removeFromRepairNotOnline = (id?: string) => {
    if(id) {
      setDeviceId(id)
      setMOdalRepiarNotOnline(true)
    }
  }

  const removeFromArchive = (id?:string) => {
    if(id) {
      console.log("IDDDDDDDDD", id)
      setDeviceId(id)
      setModalRemoveFromArchive(true)
    }
  }

  const removeFromArchiveNotOnline = (id?:string) => {
    if(id) {
      setDeviceId(id)
      setModalRemoveFromArchiveNotOnline(true)
    }
  }

  const repairDeviceModal = (id?: string) => {
    if(id) {
      setDeviceId(id)
      setModalRepair(true)
    }
  }

  const targetDate: Date = new Date(lastSeenNormal);
  const currentDate: Date = new Date();
  const diff: number = Math.abs(targetDate.getTime() - currentDate.getTime());
  const diffInMinutes: number = diff / (1000 * 60);
  // console.log("diffInMinutes", diffInMinutes, currentDate.getTime(), targetDate.getTime())

  let someItems: DropdownItemI[] = []
  if(whichTable === "device" && dropdownItems?.filter((item: any) => item.text === "Состояние")) {
    const miningState = columns.filter((item: any) => item.accessor === "miningState")[0].title
    let index = dropdownItems.filter((item: any) => item.text !== "Состояние")
    let lastArray = index[index.length - 1]
    index.pop()
    if(columns && columns[0] && columns[0].title && columns[0].title.includes("Antminer") ) {
      index.push({
        text: "Включить блинк",
        icon: <IconOff width={20} height={20} />,
        onClick: enableBlinkModal
      })
      index.push({
        text: "Выключить блинк",
        icon: <IconOff width={20} height={20} />,
        onClick: disableBlinkModal
      })
    }
    if(status && status === "Not online") {
      if(hasAccess(requestsAccessMap.archiveDevice)) {
        index.push({
          text: "В расторжение",
          icon: <IconArchive width={20} height={20} />,
          onClick: archiveDeviceModal
        })
      }
      if(hasAccess(requestsAccessMap.updateDevice)) {
        index.push({
          text: "В ремонт", 
          icon: <IconTool width={20} height={20} />,
          onClick: repairDeviceModal
        })
      }
    }
    if(status && status === "In repair") {
      if(hasAccess(requestsAccessMap.archiveDevice)) {
        index.push({
          text: "В расторжение",
          icon: <IconArchive width={20} height={20} />,
          onClick: archiveDeviceModal
        })
      }
      if(diffInMinutes <= 5) {
        if(hasAccess(requestsAccessMap.updateDevice)) {
          index.push({
            text: "Вывести из ремонта",
            icon: <IconArchive width={20} height={20} />,
            onClick: removeFromRepair
          })
        }
      } else {
        if(hasAccess(requestsAccessMap.updateDevice)) {
          index.push({
            text: "Вывести из ремонта",
            icon: <IconArchive width={20} height={20} />,
            onClick: removeFromRepairNotOnline
          })
        }
      }
    }
    if(miningState === "Включено") {
      if(hasAccess(requestsAccessMap.disableDevice) || hasAccess(requestsAccessMap.disableDeviceAuthedAreaId)) {
        index.push({
          text: "Выключить",
          icon: <IconPower width={20} height={20} />,
          onClick: disableDeviceModal
        })
      }
      if(isReserved) {
        if(hasAccess(requestsAccessMap.updateDeviceMany)) {
          index.unshift({
            text: 'Восстановить',
            icon: <IconRollBrush width={20} height={20} />,
            onClick: restoreDeviceModal
          })
        }
      }
      if(hasAccess(requestsAccessMap.reserveDeviceById) || hasAccess(requestsAccessMap.reserveDeviceByIdAuthedAreaId)) {
        index.unshift({
          text: 'Зарезервировать',
          icon: <IconSave2 width={20} height={20} />,
          onClick: reserveDeviceModal
        })
      }

    } else if (miningState === "Выключено") {
      if(hasAccess(requestsAccessMap.enableDevice) || hasAccess(requestsAccessMap.enableDeviceAuthedAreaId)) {
        index.push({
          text: "Включить",
          icon: <IconPlay width={20} height={20} />,
          onClick: enableDeviceModal
        })
      }
    }
    index.push(lastArray)
    someItems = index
  } else if(whichTable === "users" && dropdownItems) {
    const miningState = columns.filter((item: any) => item.accessor === "miningState")[0]?.title
      let index = dropdownItems.filter((item: any) => item.text !== "Состояние")
      let lastArray = index[index.length - 1]
      index.pop()
      if((miningState === "Включен" || miningState === "Частично выключен")) {
        if(hasAccess(requestsAccessMap.updateDeviceMany)) {
          index.unshift({
              text: 'Восстановить',
              icon: <IconRollBrush width={20} height={20} />,
              onClick: restoreDeviceUserModal
          })
        }
      if(roleId === process.env.ROLE_ROOT_ID) {
        index.unshift({
          text: 'Зарезервировать',
          icon: <IconSave2 width={20} height={20} />,
          onClick: reserveDeviceUserModal
        })
      }
      index.push(lastArray)
      someItems = index
    }
  } else if(whichTable === "archive" && dropdownItems) {
    const miningState = columns.filter((item: any) => item.accessor === "miningState")[0]?.title
      let index = dropdownItems.filter((item: any) => item.text !== "Состояние")
      let lastArray = index[index.length - 1]
      index.pop()
      if(status === "In archive") {
        
        if(diffInMinutes <= 5) {
          index.unshift({
            text: 'Вывести из расторжения',
            icon: <IconArchive width={20} height={20} />,
            onClick: removeFromArchive
          })
        } else {
          index.unshift({
            text: 'Вывести из расторжения',
            icon: <IconArchive width={20} height={20} />,
            onClick: removeFromArchiveNotOnline
          })
        }
      index.push(lastArray)
      someItems = index
    }
  }


  const archiveDevice = () => {
    archiveDeviceSubmit(
      setModalArchive,
      setModalInfo,
      deviceId
    )
  } 

  const repairDevice = () => {
    repairDeviceSubmit(
      setModalRepair,
      setModalInfo,
      deviceId
    )
  }

  const restoreDevice = () => {
    restoreDeviceSubmit(
      setModalRestore,
      setModalInfo,
      deviceId
    )
  } 

  const reserveDevice = () => {
    reserveDeviceSubmit(
      setModalReserve,
      setModalInfo,
      deviceId
    )
  } 

  const enableDeviceReq = () => {
    enableDevice(
      setAgreedModalEnalbe,
      setModalInfo,
      deviceId
    )
  }

  const disableDeviceReq = () => {
    disableDevice(
      setAgreedModalEnalbe,
      setModalInfo,
      deviceId
    )
  }

  const modalsData = [
    {
      title: "Изменение состояния майннинга",
      content: "Вы уверены что изменить состояние майннинга?",
      open: agreedModal,
      setOpen: setAgreedModal,
      handleAction: disableDeviceReq
    },
    {
      title: "Изменение состояния майннинга",
      content: "Вы уверены что изменить состояние майннинга?",
      open: agreedModalEnable,
      setOpen: setAgreedModalEnalbe,
      handleAction: enableDeviceReq
    },
    {
      title: "Зарезервировать устройство",
      content: "Вы уверены что хотите зарезервировать устройство?",
      open: modalReserve,
      setOpen: setModalReserve,
      handleAction: reserveDevice
    },
    {
      title: "Восстановить устройство",
      content: "Вы уверены что хотите восстановить устройство?",
      open: modalRestore,
      setOpen: setModalRestore,
      handleAction: restoreDevice
    },
    {
      title: "Расторжение устройства",
      content: "Вы уверены что хотите расторжение устройства?",
      open: modalArchive,
      setOpen: setModalArchive,
      handleAction: archiveDevice
    },
    // {
    //   title: "Вывести из ремонта",
    //   content: "Вы уверены что хотите вывести устройство из ремонта?",
    //   open: modalRemoveFromRepair,
    //   setOpen: setModalFromRepair,

    // },
    {
      title: "Ремонт устройства",
      content: "Вы уверены что хотите отправить устройство в ремонт?",
      open: modalRepair,
      setOpen: setModalRepair,
      handleAction: repairDevice
    }
  ];

  const updateStatusDeviceNormal = () => {
    const data: any = {
      accessToken: localStorage.getItem(`${process.env.API_URL}_accessToken`),
      // statusId: "82cddea0-861f-11ee-932b-300505de684f" // В норме
      statusId: "9a8471f1-861f-11ee-932b-300505de684f" // Не в сети
    }
    deviceAPI.updateDevice(id, data)
      .then((res) => {
        setModalRepair(false)
        setDeviceId(null)
        setModalInfo({
          open: true,
          action: "Вывод из ремонта",
          status: "Успешно. Страница перезагрузится через 3 секунды",
          textInAction: "Запрос на вывод устройства из ремонта в очереди."
        });
        setTimeout(() => {
          window.location.reload()
        }, 3000)
      })
      .catch(err => {
        setModalRepair(false)
        setDeviceId(null)
        setModalInfo({
          open: true,
          action: "Вывод из ремонта",
          status: "Ошибка",
          textInAction: "Произошла ошибка при выводе устройства из ремонта."
        });
      })

  }

  const updateStatusDeviceNotOnline = () => {
    const data: any = {
      accessToken: localStorage.getItem(`${process.env.API_URL}_accessToken`),
      statusId: "9a8471f1-861f-11ee-932b-300505de684f"
    }
    deviceAPI.updateDevice(id, data)
      .then((res) => {
        setMOdalRepiarNotOnline(false)
        setDeviceId(null)
        setModalInfo({
          open: true,
          action: "Вывод из ремонта",
          status: "Успешно. Страница перезагрузится через 3 секунды",
          textInAction: "Запрос на вывод устройства из ремонта в очереди."
        });
        setTimeout(() => {
          window.location.reload()
        }, 3000)
      })
      .catch(err => {
        setMOdalRepiarNotOnline(false)
        setDeviceId(null)
        setModalInfo({
          open: true,
          action: "Вывод из ремонта",
          status: "Ошибка",
          textInAction: "Произошла ошибка при выводе устройства из ремонта."
        });
      })

  }

  const updateStatusDeviceInArchiveNormal = () => {
    const data: any = {
      accessToken: localStorage.getItem(`${process.env.API_URL}_accessToken`),
      statusId: "82cddea0-861f-11ee-932b-300505de684f"
    }
    deviceAPI.updateDevice(id, data)
      .then((res) => {
        setModalRemoveFromArchive(false)
        setDeviceId(null)
        setModalInfo({
          open: true,
          action: "Вывод из расторжения",
          status: "Успешно. Страница перезагрузится через 3 секунды",
          textInAction: "Запрос на вывод устройства из расторжения в очереди."
        });
        setTimeout(() => {
          window.location.reload()
        }, 3000)
      })
      .catch(err => {
        setModalRemoveFromArchive(false)
        setDeviceId(null)
        setModalInfo({
          open: true,
          action: "Вывод из расторжения",
          status: "Ошибка",
          textInAction: "Произошла ошибка при выводе устройства из расторжения."
        });
      })
  }

  const updateStatusDeviceInArchiveNotOnline = () => {
    const data: any = {
      accessToken: localStorage.getItem(`${process.env.API_URL}_accessToken`),
      statusId: "9a8471f1-861f-11ee-932b-300505de684f"
    }
    deviceAPI.updateDevice(id, data)
      .then((res) => {
        setModalRemoveFromArchiveNotOnline(false)
        setDeviceId(null)
        setModalInfo({
          open: true,
          action: "Вывод из расторжения",
          status: "Успешно. Страница перезагрузится через 3 секунды",
          textInAction: "Запрос на вывод устройства из расторжения в очереди."
        });
        setTimeout(() => {
          window.location.reload()
        }, 3000)
      })
      .catch(err => {
        setModalRemoveFromArchiveNotOnline(false)
        setDeviceId(null)
        setModalInfo({
          open: true,
          action: "Вывод из расторжения",
          status: "Ошибка",
          textInAction: "Произошла ошибка при выводе устройства из расторжения."
        });
      })
  }

  const enableBlinkOn = () => {
    deviceAPI.updateDeviceBlinkOn({
      where: {
        id
      }
    }).then((res) => {
      setModalBlinkOn(false)
      setDeviceId(null)
      setModalInfo({
        open: true,
          action: "Включение блинка",
          status: "Успешно. Страница перезагрузится через 3 секунды",
          textInAction: "Запрос на включение блинка в очереди."
      })
      setTimeout(() => {
        window.location.reload()
      }, 3000)
    })
    .catch(err => {
      setModalBlinkOn(false)
      setDeviceId(null)
      setModalInfo({
        open: true,
        action: "Включение блинка",
        status: "Ошибка",
        textInAction: "Произошла ошибка при включении блинка."
      });
    })
  }

  const disableBlinkOff = () => {
    deviceAPI.updateDeviceBlinkOff({
      where: {
        id
      }
    }).then((res) => {
      setModalBlinkOff(false)
      setDeviceId(null)
      setModalInfo({
        open: true,
          action: "Выключение блинка",
          status: "Успешно. Страница перезагрузится через 3 секунды",
          textInAction: "Запрос на выключение блинка в очереди."
      })
      setTimeout(() => {
        window.location.reload()
      }, 3000)
    })
    .catch(err => {
      setModalBlinkOn(false)
      setDeviceId(null)
      setModalInfo({
        open: true,
        action: "Выключение блинка",
        status: "Ошибка",
        textInAction: "Произошла ошибка при выключении блинка."
      });
    })
  }

  const AlertModal: FC<any> = ({ title, content, open, setOpen, handleAction }) => {
    return open && 
      <Alert
        title={title}
        content={content}
        open={open}
        setOpen={setOpen}
        handleDeleteClick={handleAction}
      />
  }
  
  return <tr className={styles.tr}>
    {modalsData.map((modal, index) => (
      <AlertModal
        key={index}
        title={modal.title}
        content={modal.content}
        open={modal.open}
        setOpen={modal.setOpen}
        handleAction={modal.handleAction}
      />
    ))}
    {modalBlinkOn && <Alert 
      title={"Включение блинка на устройстве"} 
      content={"Вы уверены, что хотите включить блинк на устройстве?"} 
      open={modalBlinkOn} 
      setOpen={setModalBlinkOn} 
      handleDeleteClick={enableBlinkOn} 
    />}
    {modalBlinkOff && <Alert 
      title={"Выключение блинка на устройстве"} 
      content={"Вы уверены, что хотите выключить блинк на устройстве?"} 
      open={modalBlinkOff} 
      setOpen={setModalBlinkOff} 
      handleDeleteClick={disableBlinkOff} 
    />}
    {modalRemoveFromRepair && <Alert 
      title={"Вывод устройства из ремонта"} 
      content={"Вы уверены, что хотите вывести устройство из ремонта?"} 
      open={modalRemoveFromRepair} 
      setOpen={setModalFromRepair} 
      handleDeleteClick={updateStatusDeviceNormal} 
    />}

    {modalRepairNotOnline && <Alert 
      title={"Вывод устройства из ремонта"} 
      content={"Вы уверены, что хотите вывести устройство из ремонта?"} 
      open={modalRepairNotOnline} 
      setOpen={setMOdalRepiarNotOnline} 
      handleDeleteClick={updateStatusDeviceNotOnline} 
    />}

    {modalRemoveFromArchive && <Alert 
      title={"Вывод устройства из расторжения"} 
      content={"Вы уверены, что хотите вывести устройство из расторжения?"} 
      open={modalRemoveFromArchive} 
      setOpen={setModalRemoveFromArchive} 
      handleDeleteClick={updateStatusDeviceInArchiveNormal} 
    />}

    {modalRemoveFromArchiveNotOnline && <Alert 
      title={"Вывод устройства из флывфлыволфыовы"} 
      content={"Вы уверены, что хотите вывести устройство из ремонта?"} 
      open={modalRemoveFromArchiveNotOnline} 
      setOpen={setModalRemoveFromArchiveNotOnline} 
      handleDeleteClick={updateStatusDeviceInArchiveNotOnline} 
    />}
    {required && 
      <td 
        className={classNames(styles.td, styles.rowInput)}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseEnter={handleMouseEnter}
      >
        <Checkbox
          value={userId}
          dataIndex={index}
          // checked={checked || selectedRow.has(index)}
          // checked={state.filter((item: any) => item.id === id)[0]?.flag || false}
          checked={checkedI}
          onChange={onChangeInput}
          keys={id}
        />
      </td>
    }
    {hasAccess(requestsAccessMap.getDevicesPoolReserve) 
      ? <td className={classNames(styles.td, styles.isReserved)} onClick={isReserved ? () => setIsReservedSingleDevice({id, flag: true}) : () => {}}>
      {isReserved && <IconSave3 width={35} height={35} />}
      </td>
      : <td  className={classNames(styles.tdEmpty, styles.isReserved)}>

      </td>
    }
    {columns && 
      columns[0] && 
      columns[0].title && 
      columns[0].title.includes("Antminer") 
        ? columns.map((cell) => {
          return <Cell
            {...cell}
            id={id}
            index={index} 
            userId={userId}
            onClick={handleClick}
            styling={state.filter((item: any) => item.id === id)[0]?.flag || false}
            url={"http://root:root@"}
            key={`${cell.accessor}_${cell.title}`}
            isLoading={isLoading}
            changePoolStatusVerbose={changePoolStatusVerbose}
          />
        }) 
      : columns.map((cell) => {
          return <Cell
            {...cell}
            index={index}
            id={id}
            userId={userId}
            styling={state.filter((item: any) => item.id === id)[0]?.flag || false}
            onClick={handleClick}
            url={"https://"}
            key={`${cell.accessor}_${cell.title}`}
            isLoading={isLoading}
            changePoolStatusVerbose={changePoolStatusVerbose}
          />
        })}
    {dropdownItems && 
      requiredAction && 
      <td className={classNames(styles.dropBlock)} style={{
        display: "flex",
        gap: "20px",
        alignItems: "center",
        position: "sticky",
        right: whichTable === "device" ? "0px" : "0px",
        zIndex: 1,
        width: "100%",
        // marginBottom: "20px",
        // background: "white",
        // height: "100%",
      // padding: "0px 23px"
      }}
      >

      {roleId === process.env.ROLE_MANAGER_ID
        ? dropdownItems && requiredAction && whichTable === "comments" 
        
            ? <Dropdown 
            items={someItems.length !== 0 ? someItems : dropdownItems}
            id={id}
            className={styles.otherDropdown}
            />
        : <DropdownTest 
            items={someItems.length !== 0 ? someItems : dropdownItems} 
            id={id} 
            whichTable={whichTable}
            className={styles.dropdown} 
            style={length && 
              required ? 
                whichTable === "device"
                  ? { 
                    "top": index === 0 ? "-50px" : "none", 
                    "bottom": index === 1 ? "-30px" : "none", 
                    "height": index === 0 ? "11.2rem" : "auto", 
                    "right": "100px"
                  } 
                  : whichTable === "users"
                    ? {
                      "top": index === 0 ? "-50px" : "none", 
                      "bottom": index === 1 ? "-30px" : "none", 
                      "height": index === 0 ? "8.5rem" : "auto", 
                      "right": "100px"
                    }
                    : { 
                      "top": index === 0 ? "-50px" : "none", 
                      "right": "100px"
                    }
                  : { 
                    "top": index === 0 ? "-20px" : "none", 
                    "height": index === 0 ? "3rem" : "auto",
                    "right": "100px", 
                  }
            } 
          />
        : dropdownItems && requiredAction && whichTable === "comments" 
        
        ? <Dropdown 
          items={someItems.length !== 0 ? someItems : dropdownItems}
          id={id}
          className={styles.otherDropdown}
        /> : <DropdownTest 
            items={someItems.length !== 0 ? someItems : dropdownItems} 
            id={id} 
            whichTable={whichTable}
            className={styles.dropdown} 
            style={length && 
              required 
                ? whichTable === "device"
                  ? { 
                    "top": index === 0 ? "-50px" : "none", 
                    "bottom": index === 1 ? "-30px" : "none", 
                    "height": index === 0 ? "16.5rem" : "auto", 
                    "right": "100px"
                  } 
                  : whichTable === "users" && view === RoleGroup.Clients
                    ? {
                      "top": index === 0 ? "-50px" : "none", 
                      "bottom": index === 1 ? "-90px" : "none", 
                      "height": index === 0 ? "19.2rem" : "auto", 
                      "right": "100px"
                    }
                    : { 
                      "top": index === 0 ? "-50px" : "none", 
                      "height": index === 0 ? "8.2rem" : "auto",
                      "right": "100px", 
                    }
                : { 
                  "top": index === 0 ? "-69px" : "none", 
                  "right": "100px"
                }
            } 
          />
      }
      {(whichTable === "device" || whichTable === "users") && <div className={styles.addingColumn}>
          <button
            onClick={handleLinkDevice}
            className={styles.toLink}
          >
            <IconPieChart width={20} height={20} />
          </button>
        </div>}
    </td>}
  </tr>
    
}

export default memo(Row)