import { FC, useEffect, useState, useMemo, useRef } from 'react'
import styles from '../StatsChart.module.scss'
import { Chart, Dashboard, TabsControls, Toggles } from '@/components'
import classNames from 'classnames'
import { ChartPeriodType, DataPointI } from '@/interfaces'
import { ChartDataType } from '@/components/Chart/Chart'
import moment from 'moment'
import { cancelTokenSource, deviceAPI } from '@/api'
import { useAtom } from 'jotai'
import { StatsFilterStateI, atomPeriodFromToCharts, statsEnergyFromCharts, statsFilterAtom } from '@/atoms/statsAtom'
import { getDevicesFilterParams } from '@/helpers/getStatsFilterParams'
import axios from 'axios'
import { Button } from '@/ui'
import { saveAs } from 'file-saver'
import { userAtom } from '@/atoms'

const ChartTypeMap: { [x: string]: string } = {
  Хэшрейт: 'hashrate',
  Энергопотребление: 'consumption',
  Uptime: 'uptime'
}

const tabsControls = [{ text: 'Энергопотребление' }, { text: 'Uptime' }]

const OneDayEnergyChartClients: FC<{ 
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
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [startEnergyFromCharts, setStartEnergyFromCharts] = useAtom(statsEnergyFromCharts)
  const [dateRange, setDateRange] = useAtom(atomPeriodFromToCharts);
  const [startDate, endDate] = dateRange;
  const [downLoading, setDownLoading] = useState(false)

  const currentTabsControls = useMemo(
    () =>
      filterState.algorithm
        ? [...tabsControls, { text: 'Хэшрейт' }]
        : tabsControls,
    [filterState.algorithm]
  )
  let abortController = new AbortController()
  const chartClass = classNames(styles.el, className)
  
  const dateFrom = {
    day: moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm'),
    week: moment().subtract(1, 'week').format('YYYY-MM-DD HH:mm'),
    month: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm')
  }
  const dateNow = moment().format('YYYY-MM-DD HH:mm')
  useEffect(() => {
    setChartData([])
      abortController.abort()
      const newAbortController = new AbortController();
      abortController = newAbortController;
      
    const filterParams = getDevicesFilterParams(filterState)
    setLoading(true)
    
    const fetchData = async() => {
      if(startDate !== null && endDate !== null) {
          const params = {
            where: {
              createdAt: `$Between([\"${moment(startDate).format("YYYY-MM-DD HH:mm")}\",\"${moment(endDate).add(1, 'day').format("YYYY-MM-DD HH:mm")}\"])`,
              areaId: filterParams.areaId || null,
              algorithmId: filterParams.algorithm || null,
              modelId: filterParams.model || null,
              statusId: filterParams.status || null,
              rangeipId: filterParams.ranges || null,
              userId: userInfo?.id
            },
            order: {
              createdAt: "ASC"
            },
            limit: 300
          }
    
          let energy = await deviceAPI.getDevicesEnergySingleDay(params)
            setIsFetchingData(true)
            setChartData((prevState: any) => {
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
              // setStartEnergyFromCharts(res.rows)
            // setLoading(false)
            setStartEnergyFromCharts(energy)
          setIsFetchingData(false)
    
        } else {
          const params = {
            where: {
              createdAt: `$Between([\"${moment().startOf("day").format("YYYY-MM-DD HH:mm")}\",\"${dateNow}\"])`,
              areaId: filterParams.areaId || null,
              algorithmId: filterParams.algorithm || null,
              modelId: filterParams.model || null,
              statusId: filterParams.status || null,
              rangeipId: filterParams.ranges || null,
              userId: userInfo?.id
            },
            order: {
              createdAt: "ASC"
            },
            limit: 96
          }
    
          let energy = await deviceAPI.getDevicesEnergySingleDay(params)
            setIsFetchingData(true)
            setChartData((prevState: any) => {
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
              // setStartEnergyFromCharts(res.rows)
            // setLoading(false)
            setStartEnergyFromCharts(energy)
          setIsFetchingData(false)
        }
      }

    const fetchHourlyData = async (startHour: number, endHour: number) => {
      // const hourlyData = []
  
      // for (let i = startHour; i <= endHour; i+=2) {
      //   const from = moment(dateFrom.day).add(i, 'hours').format('YYYY-MM-DD HH:mm')
      //   const to = moment(from).add(2, 'hours').format('YYYY-MM-DD HH:mm')
      //   hourlyData.push(res)
      // }
      const res = await fetchData()
  
      // return hourlyData
    }

      const startHour = 0;
      const endHour = 23;

      fetchHourlyData(startHour, endHour)
      setLoading(false)

    return () => {
        newAbortController.abort();
    };

  }, [periodType, filterState, startDate, endDate])

  const chartRef = useRef<any>(null);

  const downloadData = async (e: any) => {
    const params = {
      where: {},
      order: {
        createdAt: "ASC"
      }
    }
    const filterParams = getDevicesFilterParams(filterState)
    if(startDate !== null && endDate !== null) {
      params.where = {
            createdAt: `$Between([\"${moment(startDate).startOf("day").format("YYYY-MM-DD HH:mm")}\",\"${moment(endDate).add(1, 'day').format("YYYY-MM-DD HH:mm")}\"])`,
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
    setDownLoading(true)
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
      setDownLoading(false)
    })
  }

  return (
    <Dashboard className={chartClass}>
        <Button 
          onClick={downloadData}
          title="Скачать"
          loading={downLoading}
          
        />
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

export default OneDayEnergyChartClients
