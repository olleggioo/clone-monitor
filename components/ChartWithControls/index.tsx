import { FC, MouseEvent, useEffect, useState } from 'react'
import Dashboard from '../Dashboard'
import Chart from '../Chart'
import { DataPointI } from '@/interfaces/chart'
import { ChartWithControlsI } from './ChartWithControls'
import TabsControls from '../TabsControls'
import Toggles from '../Toggles'
import styles from './ChartWithControls.module.scss'

import { deviceAPI } from '@/api'
import { ChartDataType } from '@/components/Chart/Chart'
import moment from 'moment'
import { useAtom } from 'jotai'
import { atomChartType, atomEnergyWeekMonth, atomPeriodFromToCharts } from '@/atoms/statsAtom'
import DatePicker from 'react-datepicker'
import ru from 'date-fns/locale/ru';
import { error } from 'console'

const ChartTypeMap: { [x: string]: string } = {
  Хэшрейт: 'hashrate',
  Температура: 'temperature',
  Энергопотребление: 'consumption',
  Кулеры: 'fans',
  // Uptime: "uptime",
}

const ChartWithControls: FC<ChartWithControlsI> = ({
  deviceId,
  tabControls,
  toggles,
  algorithm,
  modelId,
}) => {
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<DataPointI[]>([])
  const [chartType, setChartType] = useState('Хэшрейт')
  const [periodType, setPeriodType] = useAtom(atomChartType)
  const [chartWeekMonth, setChartWeekMonth] = useAtom(atomEnergyWeekMonth)
  const chartDataType = ChartTypeMap[chartType] as ChartDataType
  const filterDataByInterval = (data: any, diff: number) => {
    const filteredData =  data.filter((item: any, index: any) => {
      const currentDateTime = new Date(item.createdAt);
  
      const hours = currentDateTime.getHours();
      return hours % diff === 0;
    });
    return filteredData
  }
  // const [dateRange, setDateRange] = useAtom(atomPeriodFromToCharts);
  const [dateRange, setDateRange] = useState<[any, any]>([null, null]);
  const [startDate, endDate] = dateRange;
  
  const timeDiff = Math.abs(new Date((startDate)).getTime() - new Date(endDate).getTime());
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
  
  useEffect(() => {
    setDateRange([null, null])
  }, [])
  useEffect(() => {
    if(diffDays === 0) {
      setPeriodType("day")
    }
    if(diffDays <= 1 && diffDays > 0) {
      setPeriodType("day")
    }
    else if(diffDays > 1 && diffDays < 8) {
      setPeriodType("month")
    } else if(diffDays > 8) {
      setPeriodType("month")
    }
  }, [startDate, endDate])

  useEffect(() => {

    setLoading(true)
    const dateFrom = {
      day: moment().startOf('day').subtract(3, 'hour').format('YYYY-MM-DD HH:mm:ss'),
      week: moment().subtract(1, 'week').format('YYYY-MM-DD HH:mm:ss'),
      month: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss')
    }
    const dateNow = moment().subtract(3, 'hour').format('YYYY-MM-DD HH:mm:ss')

    const filterDataByInterval = (data: any, diff: number) => {
      const filteredData =  data.filter((item: any, index: any) => {
        const currentDateTime = new Date(item.createdAt);
  
        const hours = currentDateTime.getHours();
        return hours % diff === 0;
      });
      return filteredData 
    }

    const params = {
      where: {
      },
      order: {
        createdAt: 'ASC'
      },
      select: {
        createdAt: true,
        value: true
      },
      limit: 600
    }
    if(startDate !== null && endDate !== null) {
      params.where = {
          deviceId,
          createdAt: periodType === "day" ?  
          `$Between([\"${moment(startDate).subtract(3, 'hour').format("YYYY-MM-DD HH:mm:ss")}\",\"${moment(endDate).add(1, 'day').subtract(3, 'hour').format("YYYY-MM-DD HH:mm:ss")}\"])` 
          : `$Between([\"${moment(startDate).subtract(3, 'hour').format("YYYY-MM-DD HH:mm:ss")}\",\"${moment(endDate).add(1, 'day').subtract(3, 'hour').format("YYYY-MM-DD HH:mm:ss")}\"])`,
      }
    } else {
      params.where = {
        deviceId,
        createdAt: `$Between([\"${dateFrom[periodType]}\",\"${dateNow}\"])`,
      }
    }
    switch (chartType) {
      case 'Хэшрейт':
        if(periodType === "day") {
          deviceAPI.getDevicesHashrateSingleDay(params).then((res) => {
              const filteredArray = filterDataByInterval(res, 8)
              setChartData(res)
              setLoading(false)
          }).catch((error) => console.log("error", error))
        }
        else if (periodType === "week") {
          deviceAPI.getDevicesHashrateSingleWeek(params).then((res) => {
            const filteredArray = filterDataByInterval(res, 8)
            setChartData(res)
            setLoading(false)
         }).catch((error) => console.error("error", error))
        } else if(periodType === "month") {
          deviceAPI.getDevicesHashrateSingleMonth(params).then((res) => {
            const filteredArray = filterDataByInterval(res, 8)
            setChartData(res)
            setLoading(false)
         }).catch((error) => console.log("error", error))
        }
        break
      case 'Температура':
        if(periodType === "day") {
          deviceAPI.getDevicesTemperatureSingleDay(params).then((res) => {
              const filteredArray = filterDataByInterval(res, 8)
              setChartData(res)
              setLoading(false)
          }).catch((error) => console.log("error", error))
        }
        else if (periodType === "week") {
          deviceAPI.getDevicesTemperatureSingleWeek(params).then((res) => {
            setChartData(res)
            setLoading(false)
         }).catch((error) => console.log("error", error))
        } else if(periodType === "month") {
          deviceAPI.getDevicesTemperatureSingleMonth(params).then((res) => {
            setChartData(res)
            setLoading(false)
         }).catch((error) => console.log("error", error))
        }
        break
      case 'Энергопотребление':
        if(periodType === "day") {
          deviceAPI.getDevicesEnergySingleDay(params).then((res) => {
              const filteredArray = filterDataByInterval(res, 8)
              setChartData(res)
              setLoading(false)
          }).catch((error) => console.log("error", error))
        }
        else if (periodType === "week") {
          deviceAPI.getDevicesEnergySingleWeek(params).then((res) => {
            const filteredArray = filterDataByInterval(res, 8)
            setChartData(res)
            setChartWeekMonth(res)

            setLoading(false)
         }).catch((error) => console.log("error", error))
        } else if(periodType === "month") {
          deviceAPI.getDevicesEnergySingleMonth(params).then((res) => {
            const filteredArray = filterDataByInterval(res, 8)
            setChartData(res)
            setChartWeekMonth(res)
            setLoading(false)
         }).catch((error) => console.log("error", error))
        }
        break
      case 'Кулеры':
        if(periodType === "day") {
          deviceAPI.getDevicesFanSingleDay(params).then((res) => {
              const filteredArray = filterDataByInterval(res, 8)
              setChartData(res)
              setLoading(false)
          }).catch((error) => console.log("error", error))
        }
        else if (periodType === "week") {
          deviceAPI.getDevicesFanSingleWeek(params).then((res) => {
            const filteredArray = filterDataByInterval(res, 8)
            setChartData(res)
            setLoading(false)
         }).catch((error) => console.log("error", error))
        } else if(periodType === "month") {
          deviceAPI.getDevicesFanSingleMonth(params).then((res) => {
            const filteredArray = filterDataByInterval(res, 8)
            setChartData(res)
            setLoading(false)
         }).catch((error) => console.log("error", error))
        }
        break
      case 'Uptime':
        if(periodType === "day") {
          deviceAPI.getDevicesUptimeSingleDay(params).then((res) => {
              const filteredArray = filterDataByInterval(res, 8)
              setChartData(res)
              setLoading(false)
          }).catch((error) => console.log("error", error))
        }
        else if (periodType === "week") {
          deviceAPI.getDevicesUptimeSingleWeek(params).then((res) => {
            const filteredArray = filterDataByInterval(res, 8)
            setChartData(res)
            setLoading(false)
         }).catch((error) => console.log("error", error))
        } else if(periodType === "month") {
          deviceAPI.getDevicesUptimeSingleMonth(params).then((res) => {
            const filteredArray = filterDataByInterval(res, 8)
            setChartData(res)
            setLoading(false)
         }).catch((error) => console.log("error", error))
        }
        break
      default:
        setChartData([])
        setLoading(false)
    }
  }, [chartType, periodType, deviceId, startDate, endDate])

  const filterParams = {
    algorithm
  }

  return (
    <div className={styles.box}>
      <Dashboard>
        <div className={styles.head}>
          <TabsControls
            items={tabControls}
            currentTab={chartType}
            onChange={setChartType}
            modelId={modelId}
          />
          <div className={styles.flexDates}>
            <Toggles
              items={toggles}
              activeType={periodType}
              onToggleClick={setPeriodType}
              // className={styles.period}
            />
            <DatePicker
              locale={ru}
              wrapperClassName={styles.dataPicker}
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                setDateRange(update);
              }}
              isClearable={true}
              placeholderText={'Диапазон дат'} 
            />
          </div>
        </div>

        <Chart
          chartData={chartData}
          dataType={chartDataType}
          period={periodType}
          algorithm={algorithm}
          loading={loading}
        />
      </Dashboard>
    </div>
  )
}
export default ChartWithControls
