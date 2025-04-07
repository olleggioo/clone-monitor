import { FC, useEffect, useState, useMemo, useRef } from 'react'
import styles from '../StatsChart.module.scss'
import { Chart, Dashboard, TabsControls, Toggles } from '@/components'
import classNames from 'classnames'
import { ChartPeriodType, DataPointI } from '@/interfaces'
import { ChartDataType } from '@/components/Chart/Chart'
import moment from 'moment'
import { cancelTokenSource, deviceAPI } from '@/api'
import { useAtom } from 'jotai'
import { StatsFilterStateI, atomPeriodFromToCharts, dateCharts, statsFilterAtom, zoomLevel } from '@/atoms/statsAtom'
import { getDevicesFilterParams } from '@/helpers/getStatsFilterParams'
import { Button } from '@/ui'

const ChartTypeMap: { [x: string]: string } = {
  Хэшрейт: 'hashrate',
  Энергопотребление: 'consumption',
  Uptime: 'uptime'
}

const tabsControls = [{ text: 'Энергопотребление' }, { text: 'Uptime' }]

const HashrateChartClients: FC<{ 
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
//   const [currentChart, setCurrentChart] = useState<string>('Энергопотребление')
//   const [periodType, setPeriodType] = useState<ChartPeriodType>('day')
  const [chartData, setChartData] = useState<DataPointI[]>([])
  const chartDataType = ChartTypeMap[currentChart] as ChartDataType
  const [loading, setLoading] = useState(true)
  const [filterState] = useAtom(statsFilterAtom)
  const [date, setDate] = useAtom(dateCharts)
  const [zoom, setZoomLevel] = useAtom(zoomLevel)
  const [dateRange, setDateRange] = useAtom(atomPeriodFromToCharts);
  const [startDate, endDate] = dateRange;

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
    
    setLoading(true)
    const dateFrom = {
      day: moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm'),
      week: moment().subtract(1, 'week').format('YYYY-MM-DD HH:mm'),
      month: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm')
    }

    const dateNow = moment().format('YYYY-MM-DD HH:mm')
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
      }
    } else {
      params.where = {
        createdAt: `$Between([\"${dateFrom[periodType]}\",\"${dateNow}\"])`,
        areaId: filterParams.areaId || null,
        algorithmId: filterParams.algorithm || null,
        modelId: filterParams.model || null,
        statusId: filterParams.status || null,
        rangeipId: filterParams.ranges || null,
      }
    }
    if(periodType === "week") {
      deviceAPI.getDevicesHashrateSingleWeek(params).then((res) => {
        setChartData([])
        setChartData(res);
        setLoading(false);
      }).catch((error) => console.log("error", error))
    } else if(periodType === "month") {
      deviceAPI.getDevicesHashrateSingleMonth(params).then((res) => {
        setChartData([])
        setChartData(res);
        setLoading(false);
      }).catch((error) => console.log("error", error))
    }

  }, [periodType, filterState, startDate, endDate])

  const chartRef = useRef<any>(null);

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
        chartRef={chartRef}
        setDate={handleDate}
      />
    </Dashboard>
  )
}

export default HashrateChartClients
