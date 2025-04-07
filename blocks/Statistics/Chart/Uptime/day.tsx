import { FC, useEffect, useState, useMemo, useRef } from 'react'
import styles from '../StatsChart.module.scss'
import { Chart, Dashboard, TabsControls, Toggles } from '@/components'
import classNames from 'classnames'
import { ChartPeriodType, DataPointI } from '@/interfaces'
import { ChartDataType } from '@/components/Chart/Chart'
import moment from 'moment'
import { cancelTokenSource, deviceAPI } from '@/api'
import { useAtom } from 'jotai'
import { StatsFilterStateI, atomPeriodFromToCharts, atomPeriodFromToChartsStats, statsFilterAtom } from '@/atoms/statsAtom'
import { getDevicesFilterParams } from '@/helpers/getStatsFilterParams'
import { Button } from '@/ui'
import { saveAs } from 'file-saver'

const ChartTypeMap: { [x: string]: string } = {
  Хэшрейт: 'hashrate',
  Энергопотребление: 'consumption',
  Uptime: 'uptime'
}

const tabsControls = [
  { text: 'Энергопотребление' }, 
  // { text: 'Uptime' }
]

const OneDayUptimeChart: FC<{ 
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
  const [dateRange, setDateRange] = useAtom(atomPeriodFromToChartsStats);
  const [startDate, endDate] = dateRange;
  const currentTabsControls = useMemo(
    () =>
      filterState.algorithm || filterState.model
        ? [...tabsControls, { text: 'Хэшрейт' }]
        : tabsControls,
    [filterState.algorithm, filterState.model]
  )
  let abortController = new AbortController()
  const chartClass = classNames(styles.el, className)

  function compare(a: any, b: any) {
    var dateA: any = new Date(a.date);
    var dateB: any = new Date(b.date);
  
    return dateB - dateA;
  }

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
      limit: 300
    }

    if(startDate !== null && endDate !== null) {
      params.where = {
            createdAt: `$Between([\"${moment(startDate).format("YYYY-MM-DD HH:mm")}\",\"${moment(endDate).add(1, 'day').format("YYYY-MM-DD HH:mm")}\"])`,
            areaId: filterParams.areaId || "",
            algorithmId: filterParams.algorithm || "",
            modelId: filterParams.model || "",
            statusId: filterParams.status || "",
            rangeipId: filterParams.ranges || "",
            userId: filterParams.userId || "",
        }
    } else {
      params.where = {
        createdAt: `$Between([\"${moment().startOf("day").format("YYYY-MM-DD HH:mm")}\",\"${dateNow}\"])`,
        areaId: filterParams.areaId || "",
        algorithmId: filterParams.algorithm || "",
        modelId: filterParams.model || "",
        statusId: filterParams.status || "",
        rangeipId: filterParams.ranges || "",
        userId: filterParams.userId || "",
      }
    }
    deviceAPI.getDevicesUptimeCacheDay(params).then(res => {
      setChartData((prevState: any) => {
        const newData = [...prevState, ...res.rows.sort(compare)];
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

  const handleResetZoom = () => {
    if (chartRef && chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  const dateFrom = {
    day: moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm'),
    week: moment().subtract(1, 'week').format('YYYY-MM-DD HH:mm'),
    month: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm')
  }
  const dateNow = moment().format('YYYY-MM-DD HH:mm')
  const [downLoading, setDownLoading] = useState(false)
  const downloadData = async (e: any) => {
    const params = {
      where: {},
      order: {
        createdAt: "ASC"
      },
      select: {
        createdAt: true,
        value: true
      },
    }
    
    const filterParams = getDevicesFilterParams(filterState)
    if(startDate !== null && endDate !== null) {
      params.where = {
            createdAt: `$Between([\"${moment(startDate).startOf("day").format("YYYY-MM-DD HH:mm")}\",\"${moment(endDate).add(1, 'day').format("YYYY-MM-DD HH:mm")}\"])`,
            areaId: filterParams.areaId || "",
            algorithmId: filterParams.algorithm || "",
            modelId: filterParams.model || "",
            statusId: filterParams.status || "",
            rangeipId: filterParams.ranges || "",
            userId: filterParams.userId || "",
        }
    } else {
      params.where = {
        createdAt: `$Between([\"${dateFrom[periodType]}\",\"${dateNow}\"])`,
        areaId: filterParams.areaId || "",
        algorithmId: filterParams.algorithm || "",
        modelId: filterParams.model || "",
        statusId: filterParams.status || "",
        rangeipId: filterParams.ranges || "",
        userId: filterParams.userId || "",
      }
    }
    setDownLoading(true)
    await deviceAPI.getDownloadUptimeCacheDay(params)
    .then(res => {
        const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'stats_report.xlsx');
    })
    .catch((error) => {
        if (error.message) {
            // setError(error.message)
        } else {
            console.error(error)
        }
    })
    .finally(() => {
      setDownLoading(false)
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
          downloadData={downloadData}
        />
      </div>
      <Chart
        filterParams={filterState}
        chartData={chartData}
        dataType={chartDataType}
        period={periodType}
        loading={loading}
        chartRef={chartRef}
      />
    </Dashboard>
  )
}

export default OneDayUptimeChart
