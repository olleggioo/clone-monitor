import { useRef, FC, useEffect, useState, useMemo, useCallback, memo } from 'react'
import styles from '../StatsChart.module.scss'
import { Chart, Dashboard, TabsControls, Toggles } from '@/components'
import classNames from 'classnames'
import { ChartPeriodType, DataPointI } from '@/interfaces'
import { ChartDataType } from '@/components/Chart/Chart'
import moment from 'moment'
import { deviceAPI } from '@/api'
import { useAtom } from 'jotai'
import { atomPeriodFromToCharts, atomPeriodFromToChartsStats, dateCharts, statsEnergyFromCharts, statsFilterAtom, zoomLevel } from '@/atoms/statsAtom'
import { getDevicesFilterParams } from '@/helpers/getStatsFilterParams'
import { saveAs } from 'file-saver'
import { hasAccess } from '@/helpers/AccessControl'
import { requestsAccessMap } from '@/helpers/componentAccessMap'

const ChartTypeMap: { [x: string]: string } = {
  Хэшрейт: 'hashrate',
  Энергопотребление: 'consumption',
  // Uptime: 'uptime'
}

const tabsControls = [
  { text: 'Энергопотребление' }, 
  // { text: 'Uptime' }
]

const EnergyChart: FC<{ 
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
  const [chartData, setChartData] = useState<DataPointI[]>([])
  const chartDataType = ChartTypeMap[currentChart] as ChartDataType
  const [loading, setLoading] = useState(true)
  const [filterState] = useAtom(statsFilterAtom)
  const [_, setStartEnergyFromCharts] = useAtom(statsEnergyFromCharts)
  const [isFetchingData, setIsFetchingData] = useState(false);

  const [dateRange, setDateRange] = useAtom(atomPeriodFromToChartsStats);
  const [startDate, endDate] = dateRange;

  const dateFrom = {
    day: moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
    week: moment().subtract(1, 'week').format('YYYY-MM-DD HH:mm:ss'),
    month: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss')
  }

  const dateNow = moment().format('YYYY-MM-DD HH:mm:ss')

  const [date, setDate] = useAtom(dateCharts)
  const currentTabsControls = useMemo(
    () =>
      filterState.algorithm || filterState.model
        ? [...tabsControls, { text: 'Хэшрейт' }]
        : tabsControls,
    [filterState.algorithm, filterState.model]
  )
  const chartClass = classNames(styles.el, className)

  useEffect(() => {
    if(hasAccess(requestsAccessMap.getDevicesLogEnergyLog)) {

      setChartData([])
  
      setLoading(true)
      
      const filterParams = getDevicesFilterParams(filterState)
      const params: any = {
        where: {},
        order: {
          createdAt: "ASC"
        },
        select: {
          createdAt: true,
          value: true
        },
        limit: 96
      }
      if(startDate !== null && endDate !== null) {
        params.where = {
          createdAt: `$Between([\"${moment(startDate).format("YYYY-MM-DD HH:mm:ss")}\",\"${moment(endDate).add(1, 'day').format("YYYY-MM-DD HH:mm:ss")}\"])`,
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
          
      } else if (startDate === null && endDate === null) {
        params.where = {
          createdAt: `$Between([\"${dateFrom[periodType]}\",\"${dateNow}\"])`,
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
      }
      if(periodType === "week") {
        deviceAPI.getDevicesEnergySumWeek(params).then((res) => {
          setChartData([])
          setChartData(res);
          setStartEnergyFromCharts(res)
          setLoading(false);
        }).catch((error) => console.log("error", error))
      } else if(periodType === "month") {
        deviceAPI.getDevicesEnergySumMonth(params).then((res) => {
          setChartData([])
          setChartData(res);
          setStartEnergyFromCharts(res)
          setLoading(false);
        }).catch((error) => console.log("error", error))
      }
    }

}, [periodType, filterState, startDate, endDate])

  const handleDate = (from: string, to: string) => {
    setDate({
      from,
      to
    })
  }

  const chartRef = useRef<any>(null);

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
      await deviceAPI.getDownloadEnergyCacheWeek(params)
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
      })
    } else if(periodType === "month") {
        await deviceAPI.getDownloadEnergyCacheMonth(params)
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
          setDate={setDate}
        />
        <Toggles
          className={styles.toggles}
          activeType={periodType}
          onToggleClick={setPeriodType}
          downloadData={downloadData}
        />
      </div>
      {isFetchingData && hasAccess(requestsAccessMap.getDevicesLogEnergyLog)
        ? <p>Loading...</p>
        : <Chart
            filterParams={filterState}
            chartData={chartData}
            dataType={chartDataType}
            period={periodType}
            loading={loading}
            chartRef={chartRef}
            setDate={handleDate}
          />
      }
    </Dashboard>
  )
}

export default memo(EnergyChart)
