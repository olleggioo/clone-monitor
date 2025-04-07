import { FC, useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import moment from 'moment'
import { deviceAtom, userAtom } from '@/atoms'
import { atomPeriodFromToCharts } from '@/atoms/statsAtom'
import { deviceAPI } from '@/api'
import "react-datepicker/dist/react-datepicker.css";
import {
  IconLogOut,
  IconRefresh,
  IconSettings,
  IconUsers,
} from '@/icons'
import { techInfoMock } from '@/mocks'
import { getStatusName, getUptime } from '@/helpers'
import { DeviceI, StatusType } from '@/interfaces'
import { ChartWithControls, Dashboard, Header, TechInfo } from '@/components'
import { TechInfoItemI } from '@/components/TechInfo/TechInfo'
import Boards from '@/blocks/Devices/Boards'
import Log from '@/blocks/Devices/Log'
import { Button, Heading } from '@/ui'
import { Coolers } from '@/blocks'

import AccordionComponent from '@/components/Accordion'
import Pools from '@/blocks/Devices/Pool'
import ErrorLog from '@/blocks/Devices/Log/ErrorLog'
import AntminerWrapper from '@/blocks/Devices/Log/AntminerWrapper'
import DeviceEdit from '@/modals/PoolSettings/DeviceEdit'
import { modalInfoAtom } from '@/atoms/appDataAtom'
import ModalInfo from '@/modals/PoolSettings/ModalInfo'
import Alert from '@/modals/Areas/Alert'
import styles from './Device.module.scss'
import Layout from '../Layout'
import Comment from '@/blocks/Devices/Comment'
import ProfileUser from '@/components/ProfileUser'
import { Menu, MenuItem } from '@mui/material'
import ArrowDown from '@/icons/ArrowDown'
import { useRouter } from 'next/router'
import Comments from '@/modals/PoolSettings/Comments'

const tabControls = [
  { text: 'Хэшрейт' },
  { text: 'Температура' },
  { text: 'Энергопотребление' },
  { text: 'Кулеры' },
  // { text: 'Uptime' }
]

const Device: FC<DeviceI> = ({
  id,
  area,
  algorithm,
  macaddr,
  ipaddr,
  deviceUsers,
  rejectedPollsProcents,
  sn,
  location,
  place,
  rack,
  shelf,
  nominalEnergy,
  status,
  model,
  deviceFan,
  deviceBoards,
  userId,
  userFullname,
  nominalHashrate,
  uptimeElapsed,
  listLog,
  sumEnergyMonth,
  uptimeTotal,
  rangeip,
  lastSeenNormal,
  comment,
  devicePools,
  deviceLogs,
  deviceComments
}) => {
  console.log("Daa", deviceBoards)
  const [reloadModal, setReloadModal] = useState(false)
  const [editSingleDevice, setEditSingleDevice] = useState<{id?: string, flag: boolean} | null>({
    id: id,
    flag: false
  })
  const [device] = useAtom(deviceAtom)
  const [modalInfo, setModalInfo] = useAtom(modalInfoAtom)
  const [modalComment, setModalComment] = useState(false)

  const [userInfo, setUserInfo] = useAtom(userAtom)

  const [isOpenProfile, setIsOpenProfile] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null);

  const onToggleClick = (e: any) => {
      setIsOpenProfile((prev) => !prev)
      setAnchorEl(e.currentTarget)
  }

  const router = useRouter()

  const Buttons = () => {
    return (
        <div className={styles.buttons}>
          <Button
            appearance="icon"
            icon={<IconRefresh width={22} height={22} />}
            className={styles.btn}
            onClick={() => setReloadModal(true)}
          />
          <Button
            appearance="icon"
            icon={<IconSettings width={22} height={22} />}
            // href={`/edit-device?id=${id}`}
            onClick={() => setEditSingleDevice((prevState: any) => {
              return {
                ...prevState,
                flag: true
              }
            })}
            className={styles.btn}
          />
        </div>
      )
  }
  const title = status?.name ? getStatusName(status?.name) : ''
  const state = status?.name
    ? (status.name.toLowerCase().replace(' ', '_') as StatusType)
    : 'not_configured'

  const header = (
    <Header
      back
      title={model?.name || 'Устройство'}
      controlsBlock={<Buttons />}
      status={{
        title,
        state,
        tagName: 'span'
      }}
      algorithm={algorithm.name}
    />
  )

  const mobileHeader = (
    <Header
      back
      title={''}
      controlsBlock={<Buttons />}
      status={{
        title,
        state,
        tagName: 'span'
      }}
      algorithm={algorithm.name}
      className={styles.mobileHeader}
    />
  )

  const handleRefreshClick = () => {
    if(id) {
      deviceAPI.reloadManyDevices({
          where: {
            id
          }
      })
      .then(res => {
        setReloadModal(false)
        setModalInfo({
          open: true,
          action: "Перезагрузка",
          status: "Успешно",
          textInAction: "Устройства перезагрузятся в течении 30 секунд"
        })
      })
      .catch(err => {
        setReloadModal(false)
        setModalInfo({
          open: true,
          action: "Перезагрузка",
          status: "Ошибка",
          textInAction: "Произошла ошибка при перезагрузке устройства"
        })
      })
    }
  }

  const techInfo: TechInfoItemI[] = techInfoMock.map((item) => {
    switch (item.label.toLowerCase()) {
      case 'хостинг':
        item.value = area?.name || ''
        break
      case 'процент по отказу':
        item.value = `${rejectedPollsProcents} %`
        break

      case 'контейнер':
        item.value = rangeip.name
        break
      case 'mac-адрес':
        item.value = macaddr || ''
        break
      case 'ip':
        item.value = ipaddr
        break
      case 'место':
        item.value = place ? place : ""
        break
      case 'в норме':
        item.value = moment(lastSeenNormal).format("YYYY-MM-DD HH:mm")
        break
      case 'клиент':
        // const client = userAPI.getUserId(userId)
        item.value = (userFullname ? userFullname : '') as string
        break
      case 'sn':
        item.value = sn || ''
        break
      case 'общее потребление':
        item.value = `${sumEnergyMonth?.value} ${sumEnergyMonth?.unit}`
        break
      case 'площадка':
        const array = []
        if (location) {
          array.push(`здание ${location}`)
        }
        if (rack) {
          array.push(`стойка ${rack}`)
        }
        if (shelf) {
          array.push(`полка ${shelf}`)
        }
        if (place) {
          array.push(`место ${place}`)
        }
        item.value = array.join(', ')
        break
      case 'потребление':
        const boards = deviceBoards?.reduce((prevState, accamulator) => Number(prevState) + parseFloat(accamulator.rateReal), 0)
        const hashRate = boards ? boards : 0
        item.value =  nominalEnergy && hashRate && `${((nominalEnergy * hashRate) / 1000).toFixed(2)} кВт`
        break
      case 'перезагрузка':
        const date = uptimeElapsed
          ? `${getUptime(uptimeElapsed)} назад`
          : 'Н/Д'
        item.value = date
        break
      case 'текущая эффективность':
        const hoursPassed = moment().diff(moment().startOf('day'), 'hours', true);
        const value = uptimeTotal && ((uptimeTotal / 12) / (nominalEnergy * nominalHashrate * hoursPassed)) * 100
        item.value = uptimeTotal 
          ? value > 100
            ? "100 %"
            : value.toFixed(2).toString() + " %"
          : "0 %"
        break
    }
    return item
  })

  const renderModals = () => (
    <>
      {reloadModal && (
        <Alert
          title="Перезагрузка устройства"
          content="Вы уверены что хотите перезагрузить устройство?"
          open={reloadModal}
          setOpen={setReloadModal}
          handleDeleteClick={handleRefreshClick}
        />
      )}
      {modalComment && <Comments id={id} onClose={() => setModalComment(false)} />}
      {editSingleDevice?.flag && editSingleDevice.id && (
        <DeviceEdit id={editSingleDevice.id} onClose={() => setEditSingleDevice({ ...editSingleDevice, flag: false })} />
      )}
      {modalInfo?.open && (
        <ModalInfo
          open={modalInfo.open}
          onClose={() => setModalInfo({ open: false, action: "", textInAction: "", status: "" })}
          status={modalInfo.status}
          action={modalInfo.action}
          textInAction={modalInfo.textInAction}
        />
      )}
    </>
 );
  
  return device !== "mobile" ? (
    <Layout header={
    <ProfileUser 
      title={model?.name || 'Устройство'} 
      back
      addedControlsBlock={<Buttons />}
      status={{
        title,
        state,
        tagName: 'span'
      }}
      algorithm={algorithm.name}
    />
    }>
      <div>

        <Menu
          open={isOpenProfile}
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          onClose={() => setIsOpenProfile(false)}
          slotProps={{
            paper: {
              style: {
                maxHeight: 250,
                width: "150px",
                marginTop: "20px",
                right: 0,
              },
            }
          }}
        >
          <MenuItem
            // onClick={handleClick}
            // key={item.text}
            onClick={() => {
              localStorage.removeItem(`${process.env.API_URL}_accessToken`)
              localStorage.removeItem(`${process.env.API_URL}_refreshToken`)
              router.push('/login')
            }}
            sx={{
              gap: "10px"
            }}
          >
            <IconLogOut width={20} height={20} />
            <span>Выйти</span>
          </MenuItem>
        </Menu>
      </div>
      {renderModals()}
      <div className={styles.el}>
        <div style={{
          gridRow: "span 2"
        }}>
          <TechInfo items={techInfo} model={model} />
        </div>

        {!!deviceBoards?.length && (
          <Boards data={deviceBoards} algorithm={algorithm.name} />
        )}

        <Comment 
          deviceComments={deviceComments} 
          setModalComment={setModalComment}
        />

        {devicePools && !!devicePools.length && (
          <Pools data={devicePools} />
        )}

        {deviceFan && deviceFan.length !== 0 && <Coolers modelId={model.name} data={deviceFan} />}
        <ChartWithControls
          deviceId={id}
          modelId={model.name}
          tabControls={tabControls}
          algorithm={algorithm.name}
        />

      </div>
        <Dashboard className={styles.wrapperLogs}>

          <AccordionComponent 
            title='История действия с устройством'
            editable={false}
          >
            <Log id={id} listLog={listLog && listLog.rows && listLog.rows.length !== 0 ? listLog : {rows: []}} />
          </AccordionComponent>
          {deviceLogs && deviceLogs.length !== 0 && <AccordionComponent 
            title="Ошибки с устройства"
            editable={false}
          >
            <ErrorLog listLog={deviceLogs} />
          </AccordionComponent>}
          {model && model.name.includes("Antminer") && <AccordionComponent
          
            title='Логи'
            editable={false}
          >
            <AntminerWrapper />
          </AccordionComponent>}
        </Dashboard>
    </Layout>
  ) : (
    <Layout header={
      <ProfileUser 
        title={model?.name || 'Устройство'} 
        back
        addedControlsBlock={<Buttons />}
        status={{
          title,
          state,
          tagName: 'span'
        }}
        algorithm={algorithm.name}
      />
      }>
        <div>
  
          <Menu
            open={isOpenProfile}
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            onClose={() => setIsOpenProfile(false)}
            slotProps={{
              paper: {
                style: {
                  maxHeight: 250,
                  width: "150px",
                  marginTop: "20px",
                  right: 0,
                },
              }
            }}
          >
            <MenuItem
              // onClick={handleClick}
              // key={item.text}
              onClick={() => {
                localStorage.removeItem(`${process.env.API_URL}_accessToken`)
                localStorage.removeItem(`${process.env.API_URL}_refreshToken`)
                router.push('/login')
              }}
              sx={{
                gap: "10px"
              }}
            >
              <IconLogOut width={20} height={20} />
              <span>Выйти</span>
            </MenuItem>
          </Menu>
        </div>
        {renderModals()}
        <div className={styles.el}>
          <div style={{
            gridRow: "span 2"
          }}>
            <TechInfo items={techInfo} model={model} />
          </div>
  
          {!!deviceBoards?.length && (
            <Boards data={deviceBoards} algorithm={algorithm.name} />
          )}
  
          <Comment 
            deviceComments={deviceComments} 
            setModalComment={setModalComment}
          />
  
          {devicePools && !!devicePools.length && (
            <Pools data={devicePools} />
          )}
  
          {deviceFan && deviceFan.length !== 0 && <Coolers modelId={model.name} data={deviceFan} />}
          <ChartWithControls
            deviceId={id}
            modelId={model.name}
            tabControls={tabControls}
            algorithm={algorithm.name}
          />
  
        </div>
          <Dashboard className={styles.wrapperLogs}>
  
            <AccordionComponent 
              title='История действия с устройством'
              editable={false}
            >
              <Log id={id} listLog={listLog && listLog.rows && listLog.rows.length !== 0 ? listLog : {rows: []}} />
            </AccordionComponent>
            {deviceLogs && deviceLogs.length !== 0 && <AccordionComponent 
              title="Ошибки с устройства"
              editable={false}
            >
              <ErrorLog listLog={deviceLogs} />
            </AccordionComponent>}
            {model && model.name.includes("Antminer") && <AccordionComponent
            
              title='Логи'
              editable={false}
            >
              <AntminerWrapper />
            </AccordionComponent>}
          </Dashboard>
      </Layout>
  )
}
export default Device
