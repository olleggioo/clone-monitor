import {
    IconDevice,
    IconEdit2,
    IconPlus,
    IconRefresh,
    IconSettings,
    IconTrash
  } from '@/icons'
  import { Button, Dropdown } from '@/ui'
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
  import Accordion from '@/components/Accordion'
  import DatePicker from "react-datepicker";
  import "react-datepicker/dist/react-datepicker.css";
  import Pools from '@/blocks/Devices/Pool'
import LayoutClients from '../Layout/LayoutClients'
  
  const tabControls = [
    { text: 'Хэшрейт' },
    { text: 'Температура' },
    { text: 'Энергопотребление' },
    { text: 'Кулеры' },
    { text: 'Uptime' }
  ]
  
  const DeviceClients: FC<DeviceI> = ({
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
    devicePools
  }) => {
    const [periodType, setPeriodType] = useAtom(atomChartType)
    const [chartWeekMonth, setChartWeekMonth] = useAtom(atomEnergyWeekMonth)
  
    const [dateRange, setDateRange] = useAtom(atomPeriodFromToCharts);
    const [startDate, endDate] = dateRange;
  
    const title = status?.name ? getStatusName(status?.name) : ''
    const state = status?.name
      ? (status.name.toLowerCase().replace(' ', '_') as StatusType)
      : 'not_configured'
  
    const header = (
      <Header
        title={model?.name || 'Устройство'}
        status={{
          title,
          state,
          tagName: 'span'
        }}
        algorithm={algorithm.name}
      />
    )
  
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
        case 'клиент':
          // const client = userAPI.getUserId(userId)
          item.value = (userFullname ? userFullname : '') as string
          break
        case 'процент по отказу':
          item.value = `${rejectedPollsProcents} %`
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
          item.value =  nominalEnergy && hashRate && `${((nominalEnergy * hashRate) / 1000).toFixed(1)} кВт`
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
    return (
      <LayoutClients header={header}>
        <div className={styles.el}>
          <TechInfo items={techInfo} model={model} />
  
          {!!deviceBoards?.length && (
            <Boards data={deviceBoards} algorithm={algorithm.name} />
          )}
  
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
          {/* {listLog && <Accordion 
            title='Логи'
          >
            <Log listLog={listLog} />
          </Accordion>} */}
        </div>
      </LayoutClients>
    )
  }
  export default DeviceClients
  