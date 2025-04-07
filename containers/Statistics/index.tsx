import {
  FC,
  Profiler,
  memo,
  useEffect,
  useState
} from 'react'
import { useAtom } from 'jotai'
import {
  StatsDashboard,
  StatsFilter,
  StatsDevicesAlgorithms,
  StatsDevicesStatuses,
} from '@/blocks'
import { deviceAPI, userAPI } from '@/api'
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
import styles from './Main.module.scss'
import ProfileUser from '@/components/ProfileUser'
import { deviceAtom } from '@/atoms'
import { hasAccess } from '@/helpers/AccessControl'
import { requestsAccessMap } from '@/helpers/componentAccessMap'

const StatisticsContainer: FC = () => {
  const [_, setLoading] = useState(true)
  const [data, setData] = useAtom(statsDataAtom)
  const [filterState] = useAtom(statsFilterAtom)
  const [currentChart, setCurrentChart] = useState<string>('Энергопотребление')
  const [periodType, setPeriodType] = useState<ChartPeriodType>('day')

  const [dateRange, setDateRange] = useAtom(atomPeriodFromToCharts);
  const [startDate, endDate] = dateRange;
  const timeDiff = Math.abs(new Date((startDate)).getTime() - new Date(endDate).getTime());
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
  const [device] = useAtom(deviceAtom)

  useEffect(() => {
    setDateRange([null, null])
  }, [])

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

  // useEffect(() => {
  //   deviceAPI.getAccess().then((res) => console.log("RES, :",res)).catch(err => console.error(err))
  // }, [])

  useEffect(() => {
    if(hasAccess(requestsAccessMap.getDevicesAlgorithm)) {
      deviceAPI.getDevicesAlgorithm()
        .then((res) => {
          setData((prevState) => {
            return {
              ...prevState,
              algorithms: res.rows
            }
          })
        })
        .catch(err => {
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
          console.error('Error', err)
        })
    }
  }, [])

  useEffect(() => {
    if(hasAccess(requestsAccessMap.getDevicesArea)) {
      deviceAPI.getDevicesArea()
        .then((res) => {
          setData((prevState: any) => {
            return {
              ...prevState,
              area: res.rows,
            }
          })
        })
        .catch(err => {
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
          console.error('Error', err)
        })
    }
  }, [])

  // useEffect(() => {
  //   Promise.all([
  //     deviceAPI.getDevicesAlgorithm(),
  //     deviceAPI.getDevicesArea(),
  //   ]).then((res) => {
  //     const [
  //       algorithms,
  //       area,
  //     ] = res
  //     setData((prevState: any) => {
  //       return {
  //         ...prevState,
  //         area: area.rows,
  //         algorithms: algorithms.rows,
  //       }
  //     })
      
  //   }).catch((err) => {
  //     setData({
  //       ...data,

  //       devices: [],
  //       uptimeData: {
  //         uptime: 0,
  //         algorithm: null
  //       },
  //       efficiencyData: {
  //         efficiency: 0,
  //         algorithm: null
  //       },
  //       statusStats: []
  //     })
  //     console.error('Error', err)
  //   })
  // }, [])

  useEffect(() => {
    userAPI.getUsers({
      limit: 999,
      select: {
        id: true,
        fullname: true
      }
    })
      .then((res) => {
        setData((prevState: any) => {
          return {
            ...prevState,
            users: res.rows,
          }
        })
      })
      .catch(err => {

      })
  }, [])

  useEffect(() => {
    if(hasAccess(requestsAccessMap.getDevicesStatus) && (hasAccess(requestsAccessMap.getDevices) || hasAccess(requestsAccessMap.getDevicesAuthedUserId))) {
      deviceAPI.getDevicesStatus({
          
      })
        .then((res) => {
          const promises = res.rows.map((row: any) => {
            return deviceAPI.getDevicesStatusCount({ 
              where: { 
                statusId: row.id, 
                // userId: filterState.client,
                userDevices: {
                  userId: filterState. client || null
                },
                areaId: filterState.area, 
                algorithmId: filterState.algorithm,
                modelId: filterState.model 
              },
              select: {
                userDevices: true
              } 
            });
          });

          Promise.all(promises)
          .then((counts) => {
              const updatedStatusCounts: any = [];

              counts.forEach((count, index) => {
                  updatedStatusCounts[index] = {
                      count: count.total,
                      name: res.rows[index].name,
                      color: res.rows[index].color,
                      id: res.rows[index].id
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
        })

        
        .catch(err => {
          console.error("Error status", err)
        })
    }
  }, [filterState])

  useEffect(() => {
    if(hasAccess(requestsAccessMap.getDevices) || hasAccess(requestsAccessMap.getDevicesAuthedUserId)) {
      deviceAPI.getDevicesStatusCount({
        where: {
          userDevices: {
            userId: filterState. client || null
          },
          // userId: filterState. client || null,
          areaId: filterState.area || null,
          algorithmId: filterState.algorithm || null,
          modelId: filterState.model || null,
          rangeipId: filterState.ranges || null,
          statusId: `$Not($In(["1eda7201-913e-11ef-8367-bc2411b3fd76"]))`
        },
        select: {
          userDevices: true
        }
      })
        .then((res) => {
          setData((prevState: any) => {
            return {
              ...prevState,
              count: res
            }
          })
          
        })
        .catch(err => {
          console.error("Count error", err)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [filterState])

  useEffect(() => {
    if(hasAccess((requestsAccessMap.getDeviceModel))) {
      deviceAPI.getDeviceModel({
        limit: 999
      })
        .then((res) => {
          setData((prevState: any) => {
            return {
              ...prevState,
              model: res.rows
            }
          })
        })
        .catch(err => {
          console.error("Model error", err)
        })
    }
  }, [])
  
  // useEffect(() => {

  //   Promise.all([
  //     // deviceAPI.getDevicesAlgorithm(),
  //     // deviceAPI.getDevicesArea(),
  //     deviceAPI.getDevicesStatus({
        
  //     }),
  //     deviceAPI.getDevicesStatusCount({
  //       where: {
  //         userId: filterState. client || null,
  //         areaId: filterState.area || null,
  //         algorithmId: filterState.algorithm || null,
  //         modelId: filterState.model || null,
  //         rangeipId: filterState.ranges || null,
  //         statusId: `$Not($In(["1eda7201-913e-11ef-8367-bc2411b3fd76"]))`
  //       }
  //     }),
  //     deviceAPI.getDeviceModel({
  //       limit: 999
  //     }),
      
  //   ])
  //     .then((res) => {
  //       const [
  //         // algorithms,
  //         // area,
  //         status,
  //         count,
  //         model,
  //       ] = res
  //       const promises = status.rows.map((row: any) => {
  //         return deviceAPI.getDevicesStatusCount({ 
  //           where: { 
  //             statusId: row.id, 
  //             userId: filterState.client,
  //             areaId: filterState.area, 
  //             algorithmId: filterState.algorithm,
  //             modelId: filterState.model 
  //         } 
  //       });
  //       });

  //       Promise.all(promises)
  //         .then((counts) => {
  //             const updatedStatusCounts: any = [];

  //             counts.forEach((count, index) => {
  //                 updatedStatusCounts[index] = {
  //                     count: count.total,
  //                     name: status.rows[index].name,
  //                     color: status.rows[index].color,
  //                     id: status.rows[index].id
  //                 }
  //             });

  //             setData((prevState: any) => {
  //               return {
  //                 ...prevState,
  //                 statusStats: updatedStatusCounts
  //               }
  //             });
  //         })
  //         .catch((error) => {
  //             console.error(error)
  //         });
  //       setData((prevState: any) => {
  //         return {
  //           ...prevState,
  //           devices: [],
  //           uptimeData: {
  //             uptime: 0,
  //             algorithm: null,
  //           },
  //           efficiencyData: {
  //             efficiency: 0,
  //             algorithm: null,
  //           },
  //           count,
  //           model: model.rows,
  //           status: status.rows,
  //         }
  //       })
  //     })
  //     .catch((error) => {
  //       setData({
  //         ...data,

  //         devices: [],
  //         uptimeData: {
  //           uptime: 0,
  //           algorithm: null
  //         },
  //         efficiencyData: {
  //           efficiency: 0,
  //           algorithm: null
  //         },
  //         statusStats: []
  //       })

  //       console.log(error)
  //     })
  //     .finally(() => {
  //       setLoading(false)
  //     })
  // }, [filterState])


  return device !== "mobile" ? <Layout header={<ProfileUser title='Статистика' />}>
      <div className={styles.grid}>
        <StatsFilter 
          className={styles.filter_col_4}
          periodType={periodType}
          setPeriodType={setPeriodType}
        />
        <StatsDashboard periodType={periodType} />
        {hasAccess(requestsAccessMap.getDevicesStatus) && <StatsDevicesStatuses className={styles.heightDashboard} />}
        {((hasAccess(requestsAccessMap.getDevicesLogEnergyLog) || hasAccess(requestsAccessMap.getDevicesLogEnergyLogAuthedUserId)) &&
        (hasAccess(requestsAccessMap.getDevicesHashRateLogAuthedUserId) || hasAccess(requestsAccessMap.getDevicesHashRateLog)) && 
        hasAccess(requestsAccessMap.getDevicesAlgorithm)
      ) && <StatsDevicesAlgorithms periodType={periodType} className={styles.algorithmsTable} />}
        {currentChart === "Энергопотребление"
          ? periodType === "day"
            ? <OneDayEnergyChart 
              currentChart={currentChart} 
              periodType={periodType} 
              className={styles.filter_col_4} 
              setCurrentChart={setCurrentChart} 
              setPeriodType={setPeriodType}
              />
            : <EnergyChart 
                currentChart={currentChart} 
                periodType={periodType} 
                className={styles.filter_col_4} 
                setCurrentChart={setCurrentChart}
                setPeriodType={setPeriodType}
              />
          : currentChart === "Uptime"
            ? periodType === "day"
              ? <OneDayUptimeChart 
                  currentChart={currentChart} 
                  periodType={periodType} 
                  className={styles.filter_col_4} 
                  setCurrentChart={setCurrentChart}
                  setPeriodType={setPeriodType}
                />
              : <UptimeChart 
                  currentChart={currentChart} 
                  periodType={periodType} 
                  className={styles.filter_col_4} 
                  setCurrentChart={setCurrentChart}
                  setPeriodType={setPeriodType}
                />
            : periodType === "day"
              ? <OneDayHashrateChart 
                  currentChart={currentChart} 
                  periodType={periodType} 
                  className={styles.filter_col_4} 
                  setCurrentChart={setCurrentChart}
                  setPeriodType={setPeriodType}
                />
              : <HashrateChart 
              currentChart={currentChart} 
              periodType={periodType} 
              className={styles.filter_col_4} 
              setCurrentChart={setCurrentChart}
              setPeriodType={setPeriodType}
            />
        }
      </div>
    </Layout>
    : <Layout pageTitle='Статистика' header={<ProfileUser title='Статистика' />}>
    <div className={styles.grid}>
      <StatsFilter 
        className={styles.filter_col_4}
        periodType={periodType}
        setPeriodType={setPeriodType}
      />
      <StatsDashboard periodType={periodType} />
      <StatsDevicesStatuses className={styles.heightDashboard} />
      <StatsDevicesAlgorithms periodType={periodType} className={styles.algorithmsTable} />
      {currentChart === "Энергопотребление"
        ? periodType === "day"
          ? <OneDayEnergyChart 
            currentChart={currentChart} 
            periodType={periodType} 
            className={styles.filter_col_4} 
            setCurrentChart={setCurrentChart}
            setPeriodType={setPeriodType}
            />
          : <EnergyChart 
              currentChart={currentChart} 
              periodType={periodType} 
              className={styles.filter_col_4} 
              setCurrentChart={setCurrentChart}
              setPeriodType={setPeriodType}
            />
        : currentChart === "Uptime"
          ? periodType === "day"
            ? <OneDayUptimeChart 
                currentChart={currentChart} 
                periodType={periodType} 
                className={styles.filter_col_4} 
                setCurrentChart={setCurrentChart}
                setPeriodType={setPeriodType}
              />
            : <UptimeChart 
                currentChart={currentChart} 
                periodType={periodType} 
                className={styles.filter_col_4} 
                setCurrentChart={setCurrentChart}
                setPeriodType={setPeriodType}
              />
          : periodType === "day"
            ? <OneDayHashrateChart 
                currentChart={currentChart} 
                periodType={periodType} 
                className={styles.filter_col_4} 
                setCurrentChart={setCurrentChart}
                setPeriodType={setPeriodType}
              />
            : <HashrateChart 
            currentChart={currentChart} 
            periodType={periodType} 
            className={styles.filter_col_4} 
            setCurrentChart={setCurrentChart}
            setPeriodType={setPeriodType}
          />
      }
    </div>
  </Layout>
}

export default memo(StatisticsContainer)
