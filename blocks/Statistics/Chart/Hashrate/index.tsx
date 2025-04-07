import { FC, useEffect, useState, useMemo, useRef } from 'react'
import styles from '../StatsChart.module.scss'
import { Chart, Dashboard, TabsControls, Toggles } from '@/components'
import classNames from 'classnames'
import { ChartPeriodType, DataPointI } from '@/interfaces'
import { ChartDataType } from '@/components/Chart/Chart'
import moment from 'moment'
import { cancelTokenSource, deviceAPI } from '@/api'
import { useAtom } from 'jotai'
import { StatsFilterStateI, atomPeriodFromToCharts, atomPeriodFromToChartsStats, dateCharts, statsFilterAtom, zoomLevel } from '@/atoms/statsAtom'
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

const HashrateChart: FC<{ 
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

  useEffect(() => {
    setChartData([])
    
    setLoading(true)
    const dateFrom = {
      day: moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
      week: moment().subtract(1, 'week').format('YYYY-MM-DD HH:mm:ss'),
      month: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss')
    }

    const dateNow = moment().format('YYYY-MM-DD HH:mm:ss')
    const filterParams = getDevicesFilterParams(filterState)
    const params: any = {
      where: {},
      order: {
        createdAt: "ASC"
      },
      limit: 96
    }

    if(startDate !== null && endDate !== null) {
      params.where = {
            createdAt: `$Between([\"${moment(startDate).subtract(8, 'hours').format("YYYY-MM-DD HH:mm:ss")}\",\"${moment(endDate).add(1, 'day').format("YYYY-MM-DD HH:mm:ss")}\"])`,
        }
        if (filterParams.areaId) {
          params.where.areaId = filterParams.areaId;
        }
        if (filterParams.algorithm) {
            params.where.algorithmId = filterParams.algorithm;
        }
        if (filterParams.model) {
            params.where.modelId = filterParams.model;
        }
        if (filterParams.status) {
            params.where.statusId = filterParams.status;
        }
        if (filterParams.ranges) {
            params.where.rangeipId = filterParams.ranges;
        }
        if (filterParams.userId) {
            params.where.userId = filterParams.userId;
        }
    } else {
      params.where = {
        createdAt: `$Between([\"${dateFrom[periodType]}\",\"${dateNow}\"])`,
      }
    }
    if(periodType === "week") {
      deviceAPI.getDevicesHashrateCacheWeek(params).then((res) => {
        setChartData([])
        setChartData(res);
        setLoading(false);
      }).catch((error) => console.log("error", error))
    } else if(periodType === "month") {
      deviceAPI.getDevicesHashrateCacheMonth(params).then((res) => {
        setChartData([])
        setChartData(res);
        setLoading(false);
      }).catch((error) => console.log("error", error))
    }

  }, [periodType, filterState, startDate, endDate])

  const chartRef = useRef<any>(null);

  const handleResetZoom = () => {
    if (chartRef && chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  const handleDate = (from: string, to: string) => {
    setDate({
      from,
      to
    })
  }
  const [downLoading, setDownLoading] = useState(false)
  const dateFrom = {
    day: moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm'),
    week: moment().subtract(1, 'week').format('YYYY-MM-DD HH:mm'),
    month: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm')
  }
  const dateNow = moment().format('YYYY-MM-DD HH:mm')
  const downloadData = async (e: any) => {
    const filterParams = getDevicesFilterParams(filterState)
    const params = {
      where: {},
      order: {
        createdAt: "ASC"
      }
    }
    if(startDate !== null && endDate !== null) {
      params.where = {
            createdAt: `$Between([\"${moment(startDate).subtract(8, 'hours').format("YYYY-MM-DD HH:mm")}\",\"${moment(endDate).add(1, 'day').format("YYYY-MM-DD HH:mm")}\"])`,
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
    if(periodType === "week") {
      setDownLoading(true)
      await deviceAPI.getDownloadHashrateCacheWeek(params)
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
    } else if(periodType === "month") {
        setDownLoading(true)
        await deviceAPI.getDownloadHashrateCacheMonth(params)
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
        setDate={handleDate}
      />
    </Dashboard>
  )
}

export default HashrateChart
