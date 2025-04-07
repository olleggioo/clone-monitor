import { FC, useEffect, useState, useMemo, useRef, memo } from 'react'
import classNames from 'classnames'
import { saveAs } from 'file-saver'
import { useAtom } from 'jotai'
import moment from 'moment'
import { deviceAPI } from '@/api'
import { ChartPeriodType, DataPointI } from '@/interfaces'
import { atomPeriodFromToCharts, atomPeriodFromToChartsStats, statsEnergyFromCharts, statsFilterAtom } from '@/atoms/statsAtom'
import { getDevicesFilterParams } from '@/helpers/getStatsFilterParams'
import { ChartDataType } from '@/components/Chart/Chart'
import { 
  Chart, 
  Dashboard, 
  TabsControls, 
  Toggles 
} from '@/components'
import styles from '../StatsChart.module.scss'
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

const OneDayEnergyChart: FC<{ 
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
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [startEnergyFromCharts, setStartEnergyFromCharts] = useAtom(statsEnergyFromCharts)
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
  
  const dateFrom = {
    day: moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
    week: moment().subtract(1, 'week').format('YYYY-MM-DD HH:mm:ss'),
    month: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss')
  }
  const dateNow = moment().subtract(3, 'hour').format('YYYY-MM-DD HH:mm:ss')
  useEffect(() => {
    if(hasAccess(requestsAccessMap.getDevicesLogEnergyLog)) {

      setChartData([])
        
      const filterParams = getDevicesFilterParams(filterState)
      setLoading(true)
      
      const fetchData = async () => {
        if(startDate !== null && endDate !== null) {
            const params: any = {
              where: {
                createdAt: `$Between([\"${moment(startDate).format("YYYY-MM-DD HH:mm:ss")}\",\"${moment(endDate).add(1, 'day').format("YYYY-MM-DD HH:mm:ss")}\"])`,
              },
              select: {
                createdAt: true,
                value: true
              },
              order: {
                createdAt: "ASC"
              },
              limit: 300
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
            try {
              let energy: any = await deviceAPI.getDevicesEnergyCacheDaySum(params)
                setIsFetchingData(true)
                setChartData((prevState: any) => {
                  // const newData = [...prevState, ...energy.rows];
                  const newData = [...prevState, ...energy];
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
                setStartEnergyFromCharts(energy.rows)
              setIsFetchingData(false)
              
            } catch (error) {
              console.error("error", error)
            }
      
          } else {
            const params: any = {
              where: {
                createdAt: `$Between([\"${moment().startOf("day").subtract(3, 'hour').format("YYYY-MM-DD HH:mm:ss")}\",\"${dateNow}\"])`,
              },
              select: {
                createdAt: true,
                value: true
              },
              order: {
                createdAt: "ASC"
              },
              limit: 96
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
            try {
              
              let energy: any = await deviceAPI.getDevicesEnergyCacheDaySum(params)
                setIsFetchingData(true)
                setChartData((prevState: any) => {
                  // const newData = [...prevState, ...energy.rows];
                  const newData = [...prevState, ...energy];
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
  
                setStartEnergyFromCharts(energy.rows)
              setIsFetchingData(false)
            } catch (error) {
              console.error("error", error)
            }
          }
        }
  
        fetchData()
        setLoading(false)
    }

  }, [periodType, filterState, startDate, endDate])

  const chartRef = useRef<any>(null);

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
            createdAt: `$Between([\"${moment(startDate).startOf("day").format("YYYY-MM-DD HH:mm:ss")}\",\"${moment(endDate).add(1, 'day').format("YYYY-MM-DD HH:mm:ss")}\"])`,
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
    await deviceAPI.getDownloadEnergyCacheDay(params)
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
        {!isFetchingData && hasAccess(requestsAccessMap.getDevicesLogEnergyLog) && <Chart
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

export default memo(OneDayEnergyChart)
