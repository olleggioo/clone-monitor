import {
    FC,
    useEffect,
    useState
  } from 'react'
  import moment from 'moment'
  import { useAtom } from 'jotai'
  import styles from '@/containers/Statistics/Main.module.scss'
  import {
    StatsDashboard,
    StatsFilter,
    StatsDevicesAlgorithms,
    StatsDevicesStatuses,
  } from '@/blocks'
  import { deviceAPI } from '@/api'
  import {
    atomPeriodFromToCharts,
    statsDataAtom,
    statsFilterAtom,
  } from '@/atoms/statsAtom'
  import { Layout } from '@/containers'
  import { ChartPeriodType } from '@/interfaces'
  import EnergyChart from '@/blocks/Statistics/Chart/Energy'
  import UptimeChart from '@/blocks/Statistics/Chart/Uptime'
  import HashrateChart from '@/blocks/Statistics/Chart/Hashrate'
  import OneDayEnergyChart from '@/blocks/Statistics/Chart/Energy/day'
  import OneDayHashrateChart from '@/blocks/Statistics/Chart/Hashrate/day'
  import OneDayUptimeChart from '@/blocks/Statistics/Chart/Uptime/day'
  import { Button } from '@/ui'
  import { saveAs } from 'file-saver'
import OneDayEnergyChartClients from '@/blocks/Clientura/Statistics/Chart/Energy/day'
import EnergyChartClients from '@/blocks/Clientura/Statistics/Chart/Energy'
import StatsDevicesAlgorithmsClients from '@/blocks/Clientura/Statistics/DevicesAlgorithms'
import LayoutClients from '@/containers/Layout/LayoutClients'
import StatsDashboardClients from '@/blocks/Statistics/Dashboard/DashboardClients'
import OneDayUptimeChartClients from '@/blocks/Clientura/Statistics/Chart/Uptime/day'
import UptimeChartClients from '@/blocks/Clientura/Statistics/Chart/Uptime'
import OneDayHashrateChartClients from '@/blocks/Clientura/Statistics/Chart/Hashrate/day'
import HashrateChartClients from '@/blocks/Clientura/Statistics/Chart/Hashrate'
import ProfileUser from '@/components/ProfileUser'
  
  const StatisticsContainerClients: FC = () => {
    const [_, setLoading] = useState(true)
    const [data, setData] = useAtom(statsDataAtom)
    const [filterState] = useAtom(statsFilterAtom)
    const [currentChart, setCurrentChart] = useState<string>('Энергопотребление')
    const [periodType, setPeriodType] = useState<ChartPeriodType>('day')
  
    const [dateRange] = useAtom(atomPeriodFromToCharts);
    const [startDate, endDate] = dateRange;
    const timeDiff = Math.abs(new Date((startDate)).getTime() - new Date(endDate).getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
  
    useEffect(() => {
      if(diffDays === 0) {
        setPeriodType("day")
      }
      if(diffDays <= 1 && diffDays > 0) {
        setPeriodType("day")
      }
      else if(diffDays > 1 && diffDays < 8) {
        setPeriodType("week")
      } else if(diffDays > 8) {
        setPeriodType("month")
      }
    }, [startDate, endDate])

    useEffect(() => {
      deviceAPI.getDevicesStatusCount({
        where: {
          areaId: filterState.area || null,
          algorithmId: filterState.algorithm || null,
          modelId: filterState.model || null,
          rangeipId: filterState.ranges || null,
        }
      }).then((res) => {
        console.log("res", res)
        setData((prevState: any) => {
          return {
            ...prevState,
            count: res,
            // ranges: ranges.rows
          }
        })
      }).catch((err) => console.error(err))
    }, [filterState, periodType])
    useEffect(() => {
      const dateFrom = {
        day: moment().subtract(1, 'day').format('YYYY-MM-DD hh:mm:ss'),
        week: moment().subtract(1, 'week').format('YYYY-MM-DD hh:mm:ss'),
        month: moment().subtract(1, 'month').format('YYYY-MM-DD hh:mm:ss')
      }
  
      Promise.all([
        deviceAPI.getDevicesAlgorithm(),
        deviceAPI.getDevicesArea(),
        deviceAPI.getDevicesStatus(),
        // deviceAPI.getDevicesStatusCount({
        //   where: {
        //     areaId: filterState.area || null,
        //     algorithmId: filterState.algorithm || null,
        //     modelId: filterState.model || null,
        //     rangeipId: filterState.ranges || null,
        //   }
        // }),
        deviceAPI.getDeviceModel({
          limit: 999
        }),
        // deviceAPI.getRangesIp()
      ])
        .then((res) => {
          const [
            algorithms,
            area,
            status,
            // count,
            model,
            // ranges
          ] = res
          const promises = status.rows.map((row: any) => {
            return deviceAPI.getDevicesStatusCount({ 
              where: { 
                statusId: row.id, 
                areaId: filterState.area, 
                algorithmId: filterState.algorithm,
                modelId: filterState.model 
            } 
          });
          });
  
          Promise.all(promises)
            .then((counts) => {
                const updatedStatusCounts: any = [];
  
                counts.forEach((count, index) => {
                    updatedStatusCounts[index] = {
                        count: count.total,
                        name: status.rows[index].name,
                        color: status.rows[index].color,
                        id: status.rows[index].id
                    }
                });
  
                setData((prevState: any) => {
                  return {
                    ...prevState,
                    statusStats: updatedStatusCounts
                  }
                });
            })
            .catch((error) => {
                console.error(error)
            });
          setData((prevState: any) => {
            return {
              ...prevState,
              users: [],
              area: area.rows,
              devices: [],
              uptimeData: {
                uptime: 0,
                algorithm: null,
              },
              efficiencyData: {
                efficiency: 0,
                algorithm: null,
              },
              algorithms: algorithms.rows,
              // count,
              model: model.rows,
              status: status.rows,
              // ranges: ranges.rows
            }
          })
        })
        .catch((error) => {
          console.log("GOVNO")
          setData({
            ...data,
  
            devices: [],
            uptimeData: {
              uptime: 0,
              algorithm: null
            },
            efficiencyData: {
              efficiency: 0,
              algorithm: null
            },
            statusStats: []
          })
  
          console.log(error)
        })
        .finally(() => {
          setLoading(false)
        })
    }, [filterState, periodType])
  
    return (
      <LayoutClients header={<ProfileUser title='Статистика' />}>
        <div className={styles.grid}>
          <StatsFilter 
            className={styles.filter_col_4}
            periodType={periodType}
            setPeriodType={setPeriodType}
          />
          <StatsDashboardClients periodType={periodType} />
          <StatsDevicesStatuses />
          <StatsDevicesAlgorithmsClients periodType={periodType} className={styles.filter_col_3} />
          {currentChart === "Энергопотребление"
            ? periodType === "day"
              ? <OneDayEnergyChartClients 
                currentChart={currentChart} 
                periodType={periodType} 
                className={styles.filter_col_4} 
                setCurrentChart={setCurrentChart}
                setPeriodType={setPeriodType}
                />
              : <EnergyChartClients 
                  currentChart={currentChart} 
                  periodType={periodType} 
                  className={styles.filter_col_4} 
                  setCurrentChart={setCurrentChart}
                  setPeriodType={setPeriodType}
                />
            : currentChart === "Uptime"
              ? periodType === "day"
                ? <OneDayUptimeChartClients 
                    currentChart={currentChart} 
                    periodType={periodType} 
                    className={styles.filter_col_4} 
                    setCurrentChart={setCurrentChart}
                    setPeriodType={setPeriodType}
                  />
                : <UptimeChartClients
                    currentChart={currentChart} 
                    periodType={periodType} 
                    className={styles.filter_col_4} 
                    setCurrentChart={setCurrentChart}
                    setPeriodType={setPeriodType}
                  />
              : periodType === "day"
                ? <OneDayHashrateChartClients 
                    currentChart={currentChart} 
                    periodType={periodType} 
                    className={styles.filter_col_4} 
                    setCurrentChart={setCurrentChart}
                    setPeriodType={setPeriodType}
                  />
                : <HashrateChartClients 
                currentChart={currentChart} 
                periodType={periodType} 
                className={styles.filter_col_4} 
                setCurrentChart={setCurrentChart}
                setPeriodType={setPeriodType}
              />
          }
          {/* <StatsChart className={styles.filter_col_4} /> */}
        </div>
      </LayoutClients>
    )
  }
  
  export default StatisticsContainerClients
  