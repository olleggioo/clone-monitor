import {
  IconDevice,
  IconEdit2,
  IconPlus,
  IconRefresh,
  IconSettings,
  IconTrash
} from '@/icons'
import { Button, Dropdown, Status } from '@/ui'
import { FC, useEffect, useState } from 'react'
import Layout from '../Layout'
import { ChartWithControls, Header, TechInfo } from '@/components'
import { techInfoMock } from '@/mocks'
import { Coolers } from '@/blocks'
import styles from './Device.module.scss'
import Boards from '@/blocks/Devices/Boards'
import { DeviceI, StatusType } from '@/interfaces'

import { TechInfoItemI } from '@/components/TechInfo/TechInfo'
import moment from 'moment'
import { getStatusName, getUptime } from '@/helpers'
import { deviceAPI, userAPI } from '@/api'
import { useAtom } from 'jotai'
import { atomChartType, atomEnergyWeekMonth, atomPeriodFromToCharts } from '@/atoms/statsAtom'
import getEnergyUnit from '@/helpers/getEnergyUnit'
import Log from '@/blocks/Devices/Log'
import AccordionComponent from '@/components/Accordion'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Pools from '@/blocks/Devices/Pool'
import { deviceAtom } from '@/atoms'
import { useRouter } from 'next/router'
import { Accordion } from '@mui/material'
import ErrorLog from '@/blocks/Devices/Log/ErrorLog'
import AntminerWrapper from '@/blocks/Devices/Log/AntminerWrapper'
import DeviceEdit from '@/modals/PoolSettings/DeviceEdit'
import { modalInfoAtom } from '@/atoms/appDataAtom'
import ModalInfo from '@/modals/PoolSettings/ModalInfo'
import Alert from '@/modals/Areas/Alert'
import ProfileUser from '@/components/ProfileUser'
import Comment from '@/blocks/Devices/Comment'
import Comments from '@/modals/PoolSettings/Comments'

const tabControls = [
  { text: 'Хэшрейт' },
  { text: 'Температура' },
  { text: 'Энергопотребление' },
  { text: 'Кулеры' },
  { text: 'Uptime' }
]

const Device: FC<DeviceI> = ({
  id,
  area,
  algorithm,
  macaddr,
  ipaddr,
  deviceUsers,
  sn,
  location,
  place,
  rack,
  shelf,
  nominalEnergy,
  rejectedPollsProcents,
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
  const [reloadModal, setReloadModal] = useState(false)
  const [editSingleDevice, setEditSingleDevice] = useState<{id?: string, flag: boolean} | null>({
    id: id,
    flag: false
  })
  const [device] = useAtom(deviceAtom)
  const [modalInfo, setModalInfo] = useAtom(modalInfoAtom)
  const [dateRange, setDateRange] = useAtom(atomPeriodFromToCharts);
  const [startDate, endDate] = dateRange;
  const Buttons = () => {
    return (
      <div className={styles.buttons}>
        {/*<Button*/}
        {/*  appearance="icon"*/}
        {/*  icon={<IconDevice width={22} height={22} />}*/}
        {/*  className={styles.btn}*/}
        {/*/>*/}
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
      // controlsBlock={<Buttons />}
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
      // controlsBlock={<Buttons />}
      status={{
        title,
        state,
        tagName: 'span'
      }}
      algorithm={algorithm.name}
    />
  )

  const handleRefreshClick = () => {
    // console.log("id", deviceId)
    if(id) {
      // enqueueSnackbar("Устройство в очереди на перезагрузку. Пожалуйста ожидайте", {
      //   variant: "info",
      //   autoHideDuration: 3000
      // })
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
      case 'комментарий':
        item.value = comment ? comment : ''
        break
      case 'клиент':
        // const client = userAPI.getUserId(userId)
        item.value = (userFullname ? userFullname : '') as string
        break
      case 'процент по отказу':
        item.value = `${rejectedPollsProcents ? rejectedPollsProcents : "0"} %` || "0 %"
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
              //   : ''
              // : periodType === "week"
              //   ? chartWeekMonth.length !== 0
              //     ? `${getEnergyUnit(chartWeekMonth[chartWeekMonth.length - 1].value).value} ${getEnergyUnit(chartWeekMonth[chartWeekMonth.length - 1].value).unit}`
              //     : ''
              //   : periodType === "month"
              //     ? chartWeekMonth.length !== 0
              //       ? `${getEnergyUnit(chartWeekMonth[chartWeekMonth.length - 1].value).value} ${getEnergyUnit(chartWeekMonth[chartWeekMonth.length - 1].value).unit}`
              //       : ''
              //     : ''
        break
      case 'перезагрузка':
        const date = uptimeElapsed
          ? `${getUptime(uptimeElapsed)} назад`
          : 'Н/Д'
        item.value = date
        break
      case 'uptime':
        item.value = uptimeTotal ? uptimeTotal.toFixed(2).toString() + "%" : "0%"
        break
    }
    return item
  })
  const [modalComment, setModalComment] = useState(false)

  const renderModals = () => (
    <>
      {reloadModal && <Alert
        title={"Перезагрузка устройства"} 
        content={"Вы уверены что хотите перезагрузить устройство?"} 
        open={reloadModal} 
        setOpen={setReloadModal} 
        handleDeleteClick={handleRefreshClick} 
      />}
      {editSingleDevice !== null && editSingleDevice.flag && editSingleDevice.id && editSingleDevice.id.length !== 0 && <DeviceEdit id={editSingleDevice.id} onClose={() => setEditSingleDevice((prevState: any) => {
        return {
          ...prevState,
          flag: false
        }
      })} />}
      {modalComment && <Comments id={id} onClose={() => setModalComment(false)} />}
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
    </>
  )

  return device !== "mobile" ? (
    <Layout header={<ProfileUser 
      title={model?.name || 'Устройство'} 
      back
      addedControlsBlock={<Buttons />}
      status={{
        title,
        state,
        tagName: 'span'
      }}
      algorithm={algorithm.name}
    />}>
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

        {deviceFan && deviceFan.length && <Coolers modelId={model.name} data={deviceFan} />}
        {/* <DatePicker
          wrapperClassName={styles.dataPicker}
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => {
            setDateRange(update);
          }}
          isClearable={true}
          placeholderText={'Диапазон дат'} 
        /> */}
        <ChartWithControls
          deviceId={id}
          modelId={model.name}
          tabControls={tabControls}
          algorithm={algorithm.name}
        />
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

      </div>
    </Layout>
  ) : (
    <Layout pageTitle={model?.name || 'Устройство'} header={<ProfileUser title={model?.name || "Устройство"} />}>
      {renderModals()}
      <div className={styles.el}>
          <TechInfo items={techInfo} model={model} />

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

        {deviceFan && deviceFan.length && <Coolers modelId={model.name} data={deviceFan} />}

        <ChartWithControls
          deviceId={id}
          modelId={model.name}
          tabControls={tabControls}
          algorithm={algorithm.name}
        />
        {listLog && <AccordionComponent 
          title='История действий с устройством'
          editable={false}
        >
          <Log id={id} listLog={listLog} />
        </AccordionComponent>}
        {model && model.name.includes("Antminer") && <AccordionComponent
          title='Логи'
          editable={false}
        >
        <AntminerWrapper />
      </AccordionComponent>}
      </div>
    </Layout>
  )
}
export default Device
