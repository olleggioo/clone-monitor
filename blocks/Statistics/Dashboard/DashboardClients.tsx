// import { FC, useEffect, useMemo, useState } from 'react'
// import styles from './StatDashboard.module.scss'
// import { StatCard } from '@/components'
// import { IconClock, IconCpu, IconElectricity, IconStatistics } from '@/icons'
// import { useAtom } from 'jotai'
// import { atomPeriodFromToCharts, statsDataAtom, statsEnergyFromCharts, statsFilterAtom, sumEnergyFromCharts } from '@/atoms/statsAtom'
// import moment from 'moment'
// import { getDevicesFilterParams } from '@/helpers/getStatsFilterParams'
// import { deviceAPI } from '@/api'
// import getEnergyUnit from '@/helpers/getEnergyUnit'
// import { ChartPeriodType } from '@/interfaces'

// const StatsDashboardClients: FC<{periodType: ChartPeriodType}> = ({ periodType }) => {
//   const [{ count, devices, uptimeData, efficiencyData, statusStats, sumEnergy }] = useAtom(statsDataAtom)
//   const [filterState] = useAtom(statsFilterAtom)
//   const [startEnergyFormCharts] = useAtom(statsEnergyFromCharts)
//   const [valueEnergy, setValueEnergy] = useState<{value: string, unit: string}>({
//     value: "Загрузка",
//     unit: "..."
//   });
//   const [valueEnergySum, setValueEnergySum] = useState<{value: string, unit: string}>({
//     value: "Загрузка",
//     unit: "..."
//   });
//   const [uptime, setUptime] = useState<Number>(0)
//   const [efficiencie, setEfficiencies] = useState<{hashrate: number, nominalHashrate: number}>({
//     hashrate: 0,
//     nominalHashrate: 0
//   })
//   const [dateRange, setDateRange] = useAtom(atomPeriodFromToCharts);
//   const [startDate, endDate] = dateRange;
//   const [loading, setLoading] = useState(false)
//   const timeDiff = Math.abs(new Date((startDate)).getTime() - new Date(endDate).getTime());
//   const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

//   const dateFrom = {
//     day: moment().startOf('day').format('YYYY-MM-DD HH:mm'),
//     week: moment().subtract(1, 'week').format('YYYY-MM-DD HH:mm'),
//     month: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm')
//   }

//   const dateNow = moment().format('YYYY-MM-DD HH:mm')

//   const filterParams = getDevicesFilterParams(filterState)
//   useEffect(() => {
//     if(periodType === "day") {
//       setValueEnergy(getEnergyUnit(startEnergyFormCharts[startEnergyFormCharts.length - 1]?.value))
//     }
//   }, [startEnergyFormCharts, periodType])

//   useEffect(() => {
//     if(startDate !== null && endDate !== null && periodType === "day") {
//       setUptime(0)
//       Promise.all([
//         deviceAPI.getDevicesUptimeDayAvg({
//           where: {
//             createdAt: `$Between([\"${moment(startDate).startOf('day').format("YYYY-MM-DD HH:mm")}\",\"${moment(endDate).add(1, 'day').format("YYYY-MM-DD HH:mm")}\"])`,
//             areaId: filterState.area || "",
//             modelId: filterState.model || "",
//             statusId: filterState.status || "",
//             algorithmId: filterState.algorithm || "",
//             rangeipId: filterParams.ranges || "",
//           },
//         }),
//         deviceAPI.getDevicesEnergySumDay({
//           where: {
//             createdAt:`$Between([\"${moment(startDate).startOf('day').format("YYYY-MM-DD HH:mm")}\",\"${moment(endDate).add(1, 'day').format("YYYY-MM-DD HH:mm")}\"])`,
//             areaId: filterState.area || "",
//             modelId: filterState.model || "",
//             statusId: filterState.status || "",
//             algorithmId: filterState.algorithm || "",
//             rangeipId: filterParams.ranges || "",
//           },
//         })
//       ]).then(res => {
//         const [
//           uptimes, 
//           energy
//         ] = res
//         setValueEnergySum(getEnergyUnit(energy.total / 4))
//         const avg = (energy.total)
//         setValueEnergy(getEnergyUnit(avg))
//         setUptime(uptimes.total)
//         setEfficiencies((prevState) => {
//           return {
//             ...prevState,
//             hashrate: 0, // nominalHashrates.total,
//             nominalHashrate: 0 // nominalHashrates.total
//           }
//         })
//       }).catch((error) => console.log("error", error))
//     } else if (startDate !== null && endDate !== null && periodType === "week") {
//       setUptime(0)
//       Promise.all([
//         deviceAPI.getDevicesEnergySingleWeek({
//           where: {
//             createdAt:`$Between([\"${moment(startDate).subtract(8, 'hours').format("YYYY-MM-DD HH:mm")}\",\"${moment(endDate).add(1, 'day').format("YYYY-MM-DD HH:mm")}\"])`,
//             areaId: filterState.area || null,
//             modelId: filterState.model || null,
//             statusId: filterState.status || null,
//             algorithmId: filterState.algorithm || null,
//             rangeipId: filterParams.ranges || null,
//           },
//         }),
//         deviceAPI.getDevicesUptimeWeekAvg({
//           where: {
//             createdAt: `$Between([\"${moment(startDate).subtract(8, 'hours').format("YYYY-MM-DD HH:mm")}\",\"${moment(endDate).add(1, 'day').format("YYYY-MM-DD HH:mm")}\"])`,
//             areaId: filterState.area || null,
//             modelId: filterState.model || null,
//             statusId: filterState.status || null,
//             algorithmId: filterState.algorithm || null,
//             rangeipId: filterParams.ranges || null,
//           },
//         }),
//         deviceAPI.getDevicesEnergySumWeek({
//           where: {
//             createdAt: `$Between([\"${moment(startDate).format("YYYY-MM-DD HH:mm")}\",\"${moment(endDate).add(1, 'day').format("YYYY-MM-DD HH:mm")}\"])`,
//             areaId: filterState.area || null,
//             modelId: filterState.model || null,
//             statusId: filterState.status || null,
//             algorithmId: filterState.algorithm || null,
//             rangeipId: filterParams.ranges || null,
//           },
//         })
//       ]).then(res => {
//         const [
//           energy, 
//           uptimes, 
//           sumEnergy
//           // efficiencies, 
//           // nominalHashrates
//         ] = res
//         const sum = energy.rows.reduce((prevValue, currentValue) => prevValue + Number(currentValue.value) , 0)
//         setValueEnergySum(getEnergyUnit(sumEnergy.total * 8))
//         const avg = (sum / energy.rows.length)
//         setValueEnergy(getEnergyUnit(avg))
//         setUptime(uptimes.total)
//         setEfficiencies((prevState) => {
//           return {
//             ...prevState,
//             hashrate: 0, // Number(efficiencies.rows[0]?.value)
//             nominalHashrate: 0 // nominalHashrates.total
//           }
//         })
//       }).catch((error) => console.log("error", error))
//     } else if (startDate !== null && endDate !== null && periodType === "month") {
//       setValueEnergy({
//         value: "",
//         unit: ""
//       })
//       setUptime(0)
//       Promise.all([
//         deviceAPI.getDevicesEnergySingleMonth({
//           where: {
//               createdAt:`$Between([\"${moment(startDate).format("YYYY-MM-DD HH:mm")}\",\"${moment(endDate).add(1, 'day').format("YYYY-MM-DD HH:mm")}\"])`,
//               areaId: filterParams.areaId || null,
//               algorithmId: filterParams.algorithm || null,
//               modelId: filterParams.model || null,
//               statusId: filterParams.status || null,
//               rangeipId: filterParams.ranges || null,
//           },
//           order: {
//             createdAt: "ASC"
//           }
//         }),
//         deviceAPI.getDevicesUptimeMonthAvg({
//           where: {
//             createdAt: `$Between([\"${moment(startDate).format("YYYY-MM-DD HH:mm")}\",\"${moment(endDate).add(1, 'day').format("YYYY-MM-DD HH:mm")}\"])`,
//             areaId: filterState.area || null,
//             modelId: filterState.model || null,
//             statusId: filterState.status || null,
//             algorithmId: filterState.algorithm || null,
//             rangeipId: filterParams.ranges || null,
//           },
//         }),
//         deviceAPI.getDevicesEnergySumMonth({
//           where: {
//             createdAt: `$Between([\"${moment(startDate).format("YYYY-MM-DD HH:mm")}\",\"${moment(endDate).add(1, 'day').format("YYYY-MM-DD HH:mm")}\"])`,
//             areaId: filterState.area || null,
//             modelId: filterState.model || null,
//             statusId: filterState.status || null,
//             algorithmId: filterState.algorithm || null,
//             rangeipId: filterParams.ranges || null,
//           },
//         })
//       ]).then(res => {
//         const [
//           energy, 
//           uptimes, 
//           sumEnergy,
//           // efficiencies, 
//           // nominalHashrates
//         ] = res
//         const sum = energy.rows.reduce((prevValue, currentValue) => prevValue + Number(currentValue.value) , 0)
//         setValueEnergySum(getEnergyUnit(sum * 24))
//         const avg = (sum / energy.rows.length)
//         setValueEnergy(getEnergyUnit(avg))
//         setUptime(uptimes.total)
//         setEfficiencies((prevState) => {
//           return {
//             ...prevState,
//             hashrate: 0, // Number(efficiencies.rows[0]?.value)
//             nominalHashrate: 0 // nominalHashrates.total
//           }
//         })
//       }).catch((error) => console.log("error", error))
//     }
//   }, [filterState, periodType, startDate, endDate])

//   useEffect(() => {
//     if(periodType === "day" && startDate === null && endDate === null) {
//       Promise.all([
//         deviceAPI.getDevicesUptimeDayAvg({
//           where: {
//             createdAt: `$Between([\"${dateFrom[periodType]}\",\"${dateNow}\"])`,
//             areaId: filterState.area || null,
//             modelId: filterState.model || null,
//             statusId: filterState.status || null,
//             algorithmId: filterState.algorithm || null,
//             rangeipId: filterParams.ranges || null,
//           },
//         }),
//         deviceAPI.getDevicesEnergySumDay({
//           where: {
//             createdAt: `$Between([\"${dateFrom[periodType]}\",\"${dateNow}\"])`,
//             areaId: filterState.area || null,
//             modelId: filterState.model || null,
//             statusId: filterState.status || null,
//             algorithmId: filterState.algorithm || null,
//             rangeipId: filterParams.ranges || null,
//           },
//         })
//       ])
//       .then(res => {
//           const [
//             uptimes, 
//             energy
//           ] = res
//           setValueEnergySum(getEnergyUnit(energy.total / 4))
//           const avg = (energy.total)
//           // setValueEnergy(getEnergyUnit(avg))
//           setUptime(uptimes.total)
//           setEfficiencies((prevState) => {
//             return {
//               ...prevState,
//               hashrate: 0, // nominalHashrates.total,
//               nominalHashrate: 0 // nominalHashrates.total
//             }
//           })
//         }).catch((error) => console.log("error", error))
//     } else if(periodType === "week" && startDate === null && endDate === null) {
//       // setValueEnergy({
//       //   value: "",
//       //   unit: ""
//       // })
//       setUptime(0)
//       Promise.all([
//         deviceAPI.getDevicesUptimeWeekAvg({
//           where: {
//             createdAt: `$Between([\"${dateFrom[periodType]}\",\"${dateNow}\"])`,
//             areaId: filterState.area || null,
//             modelId: filterState.model || null,
//             statusId: filterState.status || null,
//             algorithmId: filterState.algorithm || null,
//             rangeipId: filterParams.ranges || null,
//           },
//         }),
//         deviceAPI.getDevicesEnergySingleWeek({
//           where: {
//              createdAt: `$Between([\"${dateFrom[periodType]}\",\"${dateNow}\"])`,
//               areaId: filterParams.areaId || null,
//               algorithmId: filterParams.algorithm || null,
//               modelId: filterParams.model || null,
//               statusId: filterParams.status || null,
//               rangeipId: filterParams.ranges || null,
//           },
//           order: {
//             createdAt: "DESC"
//           }
//         }),
//       ])
//       .then(res => {
//           const [
//             uptimes,
//             energy, 
//           ] = res
//           const sum = energy.rows.reduce((prevValue, currentValue) => prevValue + Number(currentValue.value) , 0)
//           setValueEnergySum(getEnergyUnit(sum * 8))
//           const avg = (sum / energy.rows.length)
//           setValueEnergy(getEnergyUnit(avg))
//           setUptime(uptimes.total)
//           setEfficiencies((prevState) => {
//             return {
//               ...prevState,
//               hashrate: 0, // Number(efficiencies.rows[0]?.value)
//               nominalHashrate: 0 // nominalHashrates.total
//             }
//           })
//         }).catch((error) => console.log("error", error))
//     } else if (periodType === "month" && startDate === null && endDate === null) {
//       setValueEnergy({ 
//         value: "",
//         unit: ""
//       })
//       setUptime(0)
//       Promise.all([
//         deviceAPI.getDevicesUptimeMonthAvg({
//           where: {
//               createdAt: `$Between([\"${dateFrom[periodType]}\",\"${dateNow}\"])`,
//               areaId: filterParams.areaId || null,
//               algorithmId: filterParams.algorithm || null,
//               modelId: filterParams.model || null,
//               statusId: filterParams.status || null,
//               rangeipId: filterParams.ranges || null,
//           },
//         }),
//         deviceAPI.getDevicesEnergySumMonth({
//           where: {
//             areaId: filterState.area || null,
//             modelId: filterState.model || null,
//             statusId: filterState.status || null,
//             algorithmId: filterState.algorithm || null,
//             createdAt: `$Between([\"${dateFrom[periodType]}\",\"${dateNow}\"])`,
//             rangeipId: filterParams.ranges || null,
//           },
//         }),
//       ])
//       .then(res => {
//           const [
//             energy, 
//             uptimes,
//           ] = res
//           // const sum = energy.rows.reduce((prevValue, currentValue) => prevValue + Number(currentValue.value) , 0)
//           setValueEnergySum(getEnergyUnit(energy.total * 24))
//           // const avg = (sum / energy.rows.length)
//           setValueEnergy(getEnergyUnit(energy.total / 22))
//           setUptime(uptimes.total)
//           setEfficiencies((prevState) => {
//             return {
//               ...prevState,
//               hashrate: 0, // Number(efficiencies.rows[0]?.value)
//               nominalHashrate: 0 // nominalHashrates.total
//             }
//           })
//         }).catch((error) => console.log("error", error))
//     }
//   }, [periodType, filterState, startDate, endDate])
//   return (
//     <>
    
//     {<div className={styles.list}>
//       <StatCard
//         title="Всего устройств"
//         value={String(count && count.total)}
//         unit="шт"
//         icon={<IconCpu width={20} height={20} />}
//         className={styles.el}
//       />
//       <StatCard
//         title={periodType === "day" ? "Текущее энергопотребление" : "Среднее энергопотребление"}
//         value={isNaN(Number(valueEnergy?.value)) ? "0" : valueEnergy.value.toString()}
//         unit={valueEnergy.unit}
//         // additionalValue='250'
//         // additionalUnit='kw'
//         icon={<IconElectricity width={20} height={20} />}
//         className={styles.el}
//       />
//       <StatCard
//         title={"Общее энергопотребление"}
//         value={isNaN(Number(valueEnergySum?.value)) ? "0" : valueEnergySum.value.toString()}
//         unit={valueEnergySum.unit}
//         icon={<IconElectricity width={20} height={20} />}
//         className={styles.el}
//       />
      
//       <StatCard
//         title={uptimeData.algorithm === null ? "Общий UpTime" : `UpTime ${uptimeData.algorithm}`}
//         value={uptime.toFixed(2).toString()}
//         unit="%"
//         icon={<IconClock width={20} height={20} />}
//         className={styles.el}
//       />
//     </div>}
//     </>
//   )
// }

// export default StatsDashboardClients


import { FC, memo, useEffect, useMemo, useState } from 'react'
import styles from './StatDashboard.module.scss'
import { StatCard } from '@/components'
import { IconClock, IconCpu, IconElectricity } from '@/icons'
import { useAtom } from 'jotai'
import { 
  atomPeriodFromToChartsStats, 
  statsDataAtom, 
  statsEnergyFromCharts, 
  statsFilterAtom 
} from '@/atoms/statsAtom'
import moment from 'moment'
import { getDevicesFilterParams } from '@/helpers/getStatsFilterParams'
import { deviceAPI } from '@/api'
import getEnergyUnit from '@/helpers/getEnergyUnit'
import { ChartPeriodType } from '@/interfaces'

const sortByDate = (data: any[], dateKey: string) => {
  return data.sort((a: any, b: any) => {
    const dateA: number = new Date(a[dateKey]).getTime();
    const dateB: number = new Date(b[dateKey]).getTime();
    return dateA - dateB;
  });
};

const StatsDashboardClients: FC<{periodType: ChartPeriodType}> = ({ periodType }) => {
  const [{ count, uptimeData }] = useAtom(statsDataAtom)
  const [filterState] = useAtom(statsFilterAtom)
  const [startEnergyFormCharts] = useAtom(statsEnergyFromCharts)
  const [valueEnergy, setValueEnergy] = useState({ value: "Загрузка", unit: "..." })
  const [valueEnergySum, setValueEnergySum] = useState({ value: "Загрузка", unit: "..." })
  const [uptime, setUptime] = useState(0)
  const [efficiencie, setEfficiencies] = useState({ hashrate: 0, nominalHashrate: 0 })
  const [dateRange] = useAtom(atomPeriodFromToChartsStats)
  const [startDate, endDate] = dateRange

  const dateNow = moment().format('YYYY-MM-DD HH:mm:ss')
  const dateFrom = useMemo(() => ({
    day: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    week: moment().subtract(1, 'week').format('YYYY-MM-DD HH:mm:ss'),
    month: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss')
  }), [])

  const filterParams = getDevicesFilterParams(filterState)

  const buildParams = (customDates: boolean = false) => {
    const params: any = { where: {} }
    if (filterParams.areaId) params.where.areaId = filterParams.areaId
    if (filterParams.algorithm) params.where.algorithmId = filterParams.algorithm
    if (filterParams.model) params.where.modelId = filterParams.model
    if (filterParams.status) params.where.statusId = filterParams.status
    if (filterParams.ranges) params.where.rangeipId = filterParams.ranges
    if (filterParams.userId) params.where.userId = filterParams.userId

    if (customDates && startDate && endDate) {
      params.where.createdAt = `$Between([\"${moment(startDate).format("YYYY-MM-DD HH:mm")}\",\"${moment(endDate).add(1, 'day').format("YYYY-MM-DD HH:mm")}\"])`
    } else {
      params.where.createdAt = `$Between([\"${dateFrom[periodType]}\",\"${dateNow}\"])`
    }

    return params
  }

  const fetchEnergyAndUptime = async (params: any, periodType: string) => {
    try {
      let energy, uptimes

      if (periodType === 'day') {
        [
          // uptimes, 
          energy
        ] = await Promise.all([
          // deviceAPI.getDevicesUptimeCacheDayAvg(params),
          deviceAPI.getDevicesEnergyCacheDaySum(params)
        ])
      } else {
        [energy, uptimes] = await Promise.all([
          deviceAPI.getDevicesEnergyCacheMonth(params),
          deviceAPI.getDevicesUptimeCacheMonthAvg(params)
        ])
      }
      sortByDate(energy, 'createdAt')
      const currentEnergy = energy[energy.length - 1].value;
      const sumEnergy = energy.reduce((prev, curr) => prev + Number(curr.value), 0) || 0
      setValueEnergySum(getEnergyUnit(sumEnergy / 12))
      setValueEnergy(getEnergyUnit(currentEnergy))
      // setUptime(uptimes.total)
      setEfficiencies(prev => ({ ...prev, hashrate: 0, nominalHashrate: 0 }))
    } catch (error) {
      console.error("Error fetching data", error)
    }
  }

  useEffect(() => {
    const params = buildParams(true)
    if (periodType === 'day' || periodType === 'month') {
      fetchEnergyAndUptime(params, periodType)
    }
  }, [filterState, periodType, startDate, endDate])

  useEffect(() => {
    const params = buildParams()
    fetchEnergyAndUptime(params, periodType)
  }, [periodType, filterState])

  console.log("count", count)

  return (
    <div className={styles.list}>
      <StatCard
        title="Всего устройств"
        value={String(count?.total || "0")}
        unit="шт"
        icon={<IconCpu width={20} height={20} />}
        className={styles.el}
      />
      <StatCard
        title={periodType === "day" ? "Текущее энергопотребление" : "Среднее энергопотребление"}
        value={(isNaN(Number(valueEnergy?.value)) ? "0" : valueEnergy.value)}
        unit={valueEnergy.unit}
        icon={<IconElectricity width={20} height={20} />}
        className={styles.el}
      />
      <StatCard
        title="Общее энергопотребление"
        value={(isNaN(Number(valueEnergySum?.value)) ? "0" : valueEnergySum.value)}
        unit={valueEnergySum.unit}
        icon={<IconElectricity width={20} height={20} />}
        className={styles.el}
      />
      {/* <StatCard
        title={uptimeData.algorithm ? `UpTime ${uptimeData.algorithm}` : "Общий UpTime"}
        value={uptime.toFixed(2)}
        unit="%"
        icon={<IconClock width={20} height={20} />}
        className={styles.el}
      /> */}
    </div>
  )
}

export default memo(StatsDashboardClients)
