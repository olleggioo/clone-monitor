import { FC, useEffect, useState, useMemo } from 'react'
import styles from './StatsChart.module.scss'
import { Chart, Dashboard, TabsControls } from '@/components'
import classNames from 'classnames'
import Toggles from '../../../components/Toggles'
import { ChartPeriodType, DataPointI } from '@/interfaces'
import { ChartDataType } from '@/components/Chart/Chart'
import moment from 'moment'
import { cancelTokenSource, deviceAPI } from '@/api'
import { useAtom } from 'jotai'
import { StatsFilterStateI, statsFilterAtom } from '@/atoms/statsAtom'
import { getDevicesFilterParams } from '@/helpers/getStatsFilterParams'

const ChartTypeMap: { [x: string]: string } = {
  Хэшрейт: 'hashrate',
  Энергопотребление: 'consumption',
  Uptime: 'uptime'
}

const tabsControls = [
  { text: 'Энергопотребление' }, 
  // { text: 'Uptime' }
]

const StatsChart: FC<{ className?: string }> = ({ className }) => {
  const [currentChart, setCurrentChart] = useState<string>('Энергопотребление')
  const [periodType, setPeriodType] = useState<ChartPeriodType>('day')
  const [chartData, setChartData] = useState<DataPointI[]>([])
  const chartDataType = ChartTypeMap[currentChart] as ChartDataType
  const [loading, setLoading] = useState(true)
  const [filterState] = useAtom(statsFilterAtom)
  const currentTabsControls = useMemo(
    () =>
      filterState.algorithm
        ? [...tabsControls, { text: 'Хэшрейт' }]
        : tabsControls,
    [filterState.algorithm]
  )
  let abortController = new AbortController()
  const chartClass = classNames(styles.el, className)

  useEffect(() => {
    abortController.abort()
    const newAbortController = new AbortController();
    abortController = newAbortController;

    setLoading(true)
    const dateFrom = {
      day: moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm'),
      week: moment().subtract(1, 'week').format('YYYY-MM-DD HH:mm'),
      month: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm')
    }

    const dateNow = moment().format('YYYY-MM-DD HH:mm')
    const filterParams = getDevicesFilterParams(filterState)

    const fetchData = async(from: string, to: string) => {
      const params = {
        where: {
          dateFrom: from,
          dateTo: to,
          ...filterParams
        }
      }

      let res: any = null;

      switch (currentChart) {
        case 'Хэшрейт':
          let hashrate = await deviceAPI.getDevicesHashRateChart(params)
          hashrate.rows.sort((a: any, b: any) => {
            const dateA: any = new Date(a.createdAt);
            const dateB: any = new Date(b.createdAt);
            return dateA - dateB;          
          })
          setChartData((prevState: any) => [...prevState.sort((a: any, b: any) => {
            const dateA: any = new Date(a.createdAt);
            const dateB: any = new Date(b.createdAt);
            return dateA - dateB;          
          }), ...hashrate.rows]);
          setLoading(false)
          break
        case 'Энергопотребление':
          let energy = await deviceAPI.getDevicesConsumptionChart(params)
          setChartData((prevState: any) => [...prevState.sort((a: any, b: any) => {
            const dateA: any = new Date(a.createdAt);
            const dateB: any = new Date(b.createdAt);
            return dateA - dateB;          
          }), ...energy.rows]);
          // setLoading(false)
          break
        case 'Uptime':
          let uptime = await deviceAPI.getDevicesUptimeChart(params)
          setChartData((prevState: any) => [...prevState.sort((a: any, b: any) => {
            const dateA: any = new Date(a.createdAt);
            const dateB: any = new Date(b.createdAt);
            return dateA - dateB;          
          }), ...uptime.rows]);
          // setLoading(false)
          break
        default:
          setChartData([])
          setLoading(false)
      }

      return res
    }

    const fetchHourlyData = async (startHour: number, endHour: number) => {
      const hourlyData = []
  
      for (let i = startHour; i <= endHour; i+=2) {
        const from = moment(dateFrom.day).add(i, 'hours').format('YYYY-MM-DD HH:mm')
        const to = moment(from).add(2, 'hours').format('YYYY-MM-DD HH:mm')
        const res = await fetchData(from, to)
        hourlyData.push(res)
      }
  
      return hourlyData
    }

    if(periodType === "day") {
      const startHour = 0;
      const endHour = 23;

      fetchHourlyData(startHour, endHour)
      setLoading(false)
  } else { 
    const params = {
      where: {
        dateFrom: dateFrom[periodType],
        dateTo: dateNow,
        ...filterParams
      }
    }
    const paramsEnergy = {
      ...params,
      order: {
        createdAt: 'ASC'
      },
      limit: 96,
      relations: {
        device: true,
        deviceUser: true
      }
    }
  
    switch (currentChart) {
      case 'Хэшрейт':
        deviceAPI.getDevicesHashRateChart(params).then((res) => {
          setChartData(res.rows)
          setLoading(false)
        })
        break
      case 'Энергопотребление':
        deviceAPI.getDevicesConsumptionChart(paramsEnergy).then((res) => {
          setChartData(res.rows)
          setLoading(false)
        })
        break
      case 'Uptime':
        deviceAPI.getDevicesUptimeChart(params).then((res) => {
          setChartData(res.rows)
          setLoading(false)
        })
        break
  
      default:
        setChartData([])
        setLoading(false)
    }
  }
    return () => {
      newAbortController.abort();
    };

  }, [periodType, currentChart])

  return (
    <Dashboard className={chartClass}>
      <div className={styles.head}>
        <TabsControls
          items={currentTabsControls}
          currentTab={currentChart}
          onChange={setCurrentChart}
          onChangeChartData={setChartData}
          abortController={abortController}
        />
        <Toggles
          className={styles.toggles}
          activeType={periodType}
          onToggleClick={setPeriodType}
        />
      </div>
      <Chart
        filterParams={filterState}
        chartData={chartData}
        dataType={chartDataType}
        period={periodType}
        loading={loading}
      />
    </Dashboard>
  )
}

export default StatsChart
