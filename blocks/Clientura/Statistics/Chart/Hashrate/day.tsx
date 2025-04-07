import { FC, useEffect, useState, useMemo, useRef } from 'react'
import styles from '../StatsChart.module.scss'
import { Chart, Dashboard, TabsControls, Toggles } from '@/components'
import classNames from 'classnames'
import { ChartPeriodType, DataPointI } from '@/interfaces'
import { ChartDataType } from '@/components/Chart/Chart'
import moment from 'moment'
import {  deviceAPI } from '@/api'
import { useAtom } from 'jotai'
import { atomPeriodFromToCharts, statsFilterAtom } from '@/atoms/statsAtom'
import { getDevicesFilterParams } from '@/helpers/getStatsFilterParams'
import { Button } from '@/ui'

const ChartTypeMap: { [x: string]: string } = {
  Хэшрейт: 'hashrate',
  Энергопотребление: 'consumption',
  Uptime: 'uptime'
}

const tabsControls = [{ text: 'Энергопотребление' }, { text: 'Uptime' }]

const OneDayHashrateChartClients: FC<{ 
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
  const currentTabsControls = useMemo(
    () =>
      filterState.algorithm
        ? [...tabsControls, { text: 'Хэшрейт' }]
        : tabsControls,
    [filterState.algorithm]
  )
  let abortController = new AbortController()
  const chartClass = classNames(styles.el, className)
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [dateRange, setDateRange] = useAtom(atomPeriodFromToCharts);
  const [startDate, endDate] = dateRange;

  function compare(a: any, b: any) {
    var dateA: any = new Date(a.date);
    var dateB: any = new Date(b.date);
  
    return dateB - dateA;
  }
  useEffect(() => {
    setChartData([])

    setLoading(true)

    const dateNow = moment().format('YYYY-MM-DD HH:mm')
    const filterParams = getDevicesFilterParams(filterState)
    const params = {
      where: {},
      order: {
        createdAt: "ASC"
      },
      limit: 300
    }

    if(startDate !== null && endDate !== null) {
      params.where = {
            createdAt: `$Between([\"${moment(startDate).format("YYYY-MM-DD HH:mm")}\",\"${moment(endDate).add(1, 'day').format("YYYY-MM-DD HH:mm")}\"])`,
            areaId: filterParams.areaId || null,
            algorithmId: filterParams.algorithm || null,
            modelId: filterParams.model || null,
            statusId: filterParams.status || null,
            rangeipId: filterParams.ranges || null,
        }
    } else {
      params.where = {
        createdAt: `$Between([\"${moment().startOf("day").format("YYYY-MM-DD HH:mm")}\",\"${dateNow}\"])`,
        areaId: filterParams.areaId || null,
        algorithmId: filterParams.algorithm || null,
        modelId: filterParams.model || null,
        statusId: filterParams.status || null,
        rangeipId: filterParams.ranges || null,
      }
    }
    deviceAPI.getDevicesHashrateSingleDay(params).then(res => {
      setChartData((prevState: any) => {
        const newData = [...prevState, ...res.sort(compare)];
        const uniqueData = Array.from(new Set(newData.map((item: any) => item.createdAt))).map((createdAt: string) => {
          return newData.find((item: any) => item.createdAt === createdAt);
        });
        
        const sortedData = uniqueData.sort((a: any, b: any) => {
          const dateA: any = new Date(a.createdAt);
          const dateB: any = new Date(b.createdAt);
          return dateA - dateB;
        });
      
        return sortedData;
      });
      setLoading(false)
    }).catch((error) => console.log("error", error))

  }, [periodType, filterState, startDate, endDate])

  const chartRef = useRef<any>(null);

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
      {!isFetchingData && <Chart
        filterParams={filterState}
        chartData={chartData}
        dataType={chartDataType}
        period={periodType}
        loading={loading}
        chartRef={chartRef}
      />}
    </Dashboard>
  )
}

export default OneDayHashrateChartClients
