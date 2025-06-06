import { FC, MouseEvent, memo, useEffect, useMemo, useState } from "react"
import { TableRowI } from "../Table"
import TableCell from "../CopyTable/TableCell"
import { Dropdown, IconButton } from "@/ui"
import Cell from "./Cell"
import styles from "./Test.module.scss"
import { useAtom } from "jotai"
import { devicesUserIdFilterAtom, devicesUserIdMiningFilterAtom, modalInfoAtom, modalMinStateAtom, modalReserveDevice, selectedInputAtom } from "@/atoms/appDataAtom"
import DropdownTest from "@/ui/Dropdown/DropdownTest"
import { IconCog, IconDevice, IconHelp, IconInfo, IconMoreVertical, IconPieChart, IconPlay, IconSave, IconServer } from "@/icons"
import { DropdownItemI } from "@/ui/Dropdown/Dropdown"
import { deviceAPI } from "@/api"
import Alert from "@/modals/Areas/Alert"
import { RoleGroup } from "@/const"
import { usersListAtom } from "@/atoms"
import Checkbox from "@/components/Checkbox"
import { archiveDeviceSubmit, disableDevice, enableDevice, repairDeviceSubmit, reserveDeviceSubmit, restoreDeviceSubmit } from "./requests"
import IconArchive from "@/icons/Archive"
import IconTool from "@/icons/Tool"
import IconSave2 from "@/icons/Save2"
import IconRollBrush from "@/icons/RollBrush"
import IconPower from "@/icons/Power"
import { hasAccess } from "@/helpers/AccessControl"
import { requestsAccessMap } from "@/helpers/componentAccessMap"

interface TableRowNewI extends TableRowI {
  accessId?: string
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
}

const Row: FC<TableRowNewI> = ({
    id,
    accessId,
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
    checkedI
  }) => {
  const [usersList, setUsersList] = useAtom(usersListAtom)
  const [selectedAll, setSelected] = useAtom(selectedInputAtom)
  const roleId = localStorage.getItem(`${process.env.API_URL}_role`)
  const [textColor, setTextColor] = useState<string>('black');

  const [state, setState] = useAtom(devicesUserIdFilterAtom)
  const [checked, setChecked] = useState(state.filter((item: any) => item.id === id)[0]?.flag || false);

  const [modalInfo, setModalInfo] = useAtom(modalInfoAtom)
  const [deviceId, setDeviceId] = useState<any>(null)
  const [agreedModal, setAgreedModal] = useState(false)
  const [agreedModalEnable, setAgreedModalEnalbe] = useState(false)
  const [stateDevicesId, setStateDevicesId] = useAtom(devicesUserIdMiningFilterAtom)
  const [modalReserve, setModalReserve] = useState(false)
  const [modalRestore, setModalRestore] = useState(false)
  const [modalArchive, setModalArchive] = useState(false)
  const [modalRepair, setModalRepair] = useState(false)

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

  const repairDeviceModal = (id?: string) => {
    if(id) {
      setDeviceId(id)
      setModalRepair(true)
    }
  }


  let someItems: DropdownItemI[] = []

  if(whichTable === "device" && dropdownItems?.filter((item: any) => item.text === "Состояние")) {
    const miningState = columns.filter((item: any) => item.accessor === "miningState")[0]?.title
    let index = dropdownItems.filter((item: any) => item.text !== "Состояние")
    let lastArray = index[index.length - 1]
    index.pop()
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
    if(miningState === "Включено") {
      index.push({
        text: "Выключить",
        icon: <IconPower width={20} height={20} />,
        onClick: disableDeviceModal
      })
      if(isReserved) {
        if(hasAccess(requestsAccessMap.updateDeviceMany)) {
          index.unshift({
            text: 'Восстановить',
            icon: <IconRollBrush width={20} height={20} />,
            onClick: restoreDeviceModal
          })
        }
      }
      if(hasAccess(requestsAccessMap.reserveDeviceById)) {
        index.unshift({
          text: 'Зарезервировать',
          icon: <IconSave2 width={20} height={20} />,
          onClick: reserveDeviceModal
        })
      }

    } else if (miningState === "Выключено") {
      index.push({
        text: "Включить",
        icon: <IconPlay width={20} height={20} />,
        onClick: enableDeviceModal
      })
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
      if(hasAccess(requestsAccessMap.reserveDeviceById)) {
        index.unshift({
          text: 'Зарезервировать',
          icon: <IconSave2 width={20} height={20} />,
          onClick: reserveDeviceUserModal
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
    {
      title: "Ремонт устройства",
      content: "Вы уверены что хотите отправить устройство в ремонт?",
      open: modalRepair,
      setOpen: setModalRepair,
      handleAction: repairDevice
    }
  ];

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
  
  return <>
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
    {required && 
      <div 
        className={styles.rowInput}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseEnter={handleMouseEnter}
      >
        <Checkbox
          value={userId}
          dataIndex={index}
          checked={checkedI}
          onChange={onChangeInput}
          keys={id}
        />
      </div>
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
          />
        })}
    {dropdownItems && 
      requiredAction && 
      <div 
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          position: "sticky",
          right: whichTable === "device" ? "0px" : "0px",
          zIndex: 1,
          width: "100%",
          marginBottom: "20px",
          background: "white",
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
            />
        : dropdownItems && requiredAction && whichTable === "comments" 
        
        ? <Dropdown 
          items={someItems.length !== 0 ? someItems : dropdownItems}
          id={id}
          className={styles.otherDropdown}
        /> : <DropdownTest 
            items={someItems.length !== 0 ? someItems : dropdownItems} 
            id={id} 
            accessId={accessId}
            whichTable={whichTable}
            className={styles.dropdown}
          />
      }
      {(whichTable === "device" || whichTable === "users") && <div className={styles.addingColumn}>
        {whichTable === "users" 
          ? hasAccess(requestsAccessMap.getUserId) 
            ? <button
              onClick={handleLinkDevice}
              className={styles.toLink}
            >
              <IconPieChart width={20} height={20} />
            </button>
            : <></>
          : <button
              onClick={handleLinkDevice}
              className={styles.toLink}
            >
              <IconPieChart width={20} height={20} />
            </button>
            }
        </div>}
    </div>}
  </>
    
}

export default memo(Row)