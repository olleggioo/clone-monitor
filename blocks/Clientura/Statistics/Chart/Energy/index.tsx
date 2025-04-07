import { useRef, FC, useEffect, useState, useMemo, useCallback } from 'react'
import styles from '../StatsChart.module.scss'
import { Chart, Dashboard, TabsControls, Toggles } from '@/components'
import classNames from 'classnames'
import { ChartPeriodType, DataPointI } from '@/interfaces'
import { ChartDataType } from '@/components/Chart/Chart'
import moment from 'moment'
import { deviceAPI } from '@/api'
import { useAtom } from 'jotai'
import { atomPeriodFromToCharts, dateCharts, statsEnergyFromCharts, statsFilterAtom, zoomLevel } from '@/atoms/statsAtom'
import { getDevicesFilterParams } from '@/helpers/getStatsFilterParams'
import { Algorithms } from '@/const'
import { Button } from '@/ui'
import { saveAs } from 'file-saver'
import { userAtom } from '@/atoms'

const ChartTypeMap: { [x: string]: string } = {
  Хэшрейт: 'hashrate',
  Энергопотребление: 'consumption',
  Uptime: 'uptime'
}

const tabsControls = [{ text: 'Энергопотребление' }, { text: 'Uptime' }]

const EnergyChartClients: FC<{ 
    periodType: ChartPeriodType
    currentChart: string
    setPeriodType?: any
    setCurrentChart?: any
    className?: string 
}> = ({ 
    periodType, 
    currentChart,
    setPeriodType, 
    setCurrentChart,
    className 
}) => {
  const [userInfo, setUserInfo] = useAtom(userAtom)
  const [chartData, setChartData] = useState<DataPointI[]>([])
  const chartDataType = ChartTypeMap[currentChart] as ChartDataType
  const [loading, setLoading] = useState(true)
  const [filterState] = useAtom(statsFilterAtom)
  const [_, setStartEnergyFromCharts] = useAtom(statsEnergyFromCharts)
  const [zoom, setZoomLevel] = useAtom(zoomLevel)
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [downLoading, setDownLoading] = useState(false)

  const [dateRange, setDateRange] = useAtom(atomPeriodFromToCharts);
  const [startDate, endDate] = dateRange;
  // const [date, setDate] = useState<any>({
  //   from: null,
  // });
  const dateFrom = {
    day: moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm'),
    week: moment().subtract(1, 'week').format('YYYY-MM-DD HH:mm'),
    month: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm')
  }

  const dateNow = moment().format('YYYY-MM-DD HH:mm')

  const [date, setDate] = useAtom(dateCharts)
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
    setChartData([])
    
    abortController.abort()
    const newAbortController = new AbortController();
    abortController = newAbortController;

    setLoading(true)
    
    const filterParams = getDevicesFilterParams(filterState)
    const params = {
      where: {},
      order: {
        createdAt: "ASC"
      },
      limit: 96
    }
    if(startDate !== null && endDate !== null) {
      params.where = {
            createdAt: `$Between([\"${moment(startDate).subtract(8, 'hours').format("YYYY-MM-DD HH:mm")}\",\"${moment(endDate).add(1, 'day').format("YYYY-MM-DD HH:mm")}\"])`,
            areaId: filterParams.areaId || null,
            algorithmId: filterParams.algorithm || null,
            modelId: filterParams.model || null,
            statusId: filterParams.status || null,
            rangeipId: filterParams.ranges || null,
            userId: userInfo?.id
        }
        
    } else {
      params.where = {
        createdAt: `$Between([\"${dateFrom[periodType]}\",\"${dateNow}\"])`,
        areaId: filterParams.areaId || null,
        algorithmId: filterParams.algorithm || null,
        modelId: filterParams.model || null,
        statusId: filterParams.status || null,
        rangeipId: filterParams.ranges || null,
        userId: userInfo?.id
      }
    }
    if(periodType === "week") {
      deviceAPI.getDevicesEnergySingleWeek(params).then((res) => {
        setChartData([])
        setChartData(res);
        setStartEnergyFromCharts(res)
        setLoading(false);
      }).catch((error) => console.log("error", error))
    } else if(periodType === "month") {
      deviceAPI.getDevicesEnergySingleMonth(params).then((res) => {
        setChartData([])
        setChartData(res);
        setStartEnergyFromCharts(res)
        setLoading(false);
      }).catch((error) => console.log("error", error))
    }

    return () => {
        newAbortController.abort();
    };

}, [periodType, filterState, startDate, endDate])

  const handleDate = (from: string, to: string) => {
    setDate({
      from,
      to
    })
  }

  return (
    <Dashboard className={chartClass}>
      <div className={styles.head}>
        <TabsControls
          items={currentTabsControls}
          currentTab={currentChart}
          onChange={setCurrentChart}
          onChangeChartData={setChartData}
          abortController={abortController}
          setDate={setDate}
        />
        <Toggles
          className={styles.toggles}
          activeType={periodType}
          onToggleClick={setPeriodType}
        />
      </div>
      {isFetchingData
        ? <p>Loading...</p>
        : <Chart
            filterParams={filterState}
            chartData={chartData}
            dataType={chartDataType}
            period={periodType}
            loading={loading}
            setDate={handleDate}
          />
      }
    </Dashboard>
  )
}

export default EnergyChartClients
