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
import { hasAccess } from '@/helpers/AccessControl'
import { requestsAccessMap } from '@/helpers/componentAccessMap'

const sortByDate = (data: any[], dateKey: string) => {
  return data.sort((a: any, b: any) => {
    const dateA: number = new Date(a[dateKey]).getTime();
    const dateB: number = new Date(b[dateKey]).getTime();
    return dateA - dateB;
  });
};

const StatsDashboard: FC<{periodType: ChartPeriodType}> = ({ periodType }) => {
  const [valueEnergy, setValueEnergy] = useState({ value: "Загрузка", unit: "..." })
  const [efficiencie, setEfficiencies] = useState({ hashrate: 0, nominalHashrate: 0 })
  const [valueEnergySum, setValueEnergySum] = useState({ value: "Загрузка", unit: "..." })
  const [startEnergyFormCharts] = useAtom(statsEnergyFromCharts)
  const [dateRange] = useAtom(atomPeriodFromToChartsStats)
  const [startDate, endDate] = dateRange
  const [{ count, uptimeData }] = useAtom(statsDataAtom)
  const [filterState] = useAtom(statsFilterAtom)
  const [uptime, setUptime] = useState(0)

  const dateNow = moment().subtract(3, 'hour').format('YYYY-MM-DD HH:mm:ss')
  const dateFrom = useMemo(() => ({
    day: moment().startOf('day').subtract(3, 'hour').format('YYYY-MM-DD HH:mm:ss'),
    week: moment().subtract(1, 'week').format('YYYY-MM-DD HH:mm:ss'),
    month: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss')
  }), [])

  const filterParams = getDevicesFilterParams(filterState)

  const buildParams = (customDates: boolean = false) => {
    const params: any = { 
      where: {},
      order: {
        createdAt: "ASC"
      },
      limit: 5000,
    }
    if (filterParams.areaId) params.where.areaId = filterParams.areaId
    if (filterParams.algorithm) params.where.algorithmId = filterParams.algorithm
    if (filterParams.model) params.where.modelId = filterParams.model
    if (filterParams.status) params.where.statusId = filterParams.status
    if (filterParams.ranges) params.where.rangeipId = filterParams.ranges
    if (filterParams.userId) params.where.userId = filterParams.userId

    if (customDates && startDate && endDate) {
      params.where.createdAt = `$Between([\"${moment(startDate).subtract(3, 'hour').format("YYYY-MM-DD HH:mm")}\",\"${moment(endDate).add(1, 'day').format("YYYY-MM-DD HH:mm")}\"])`
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
        [energy] = await Promise.all([
          deviceAPI.getDevicesEnergyCacheMonth(params),
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
    if(hasAccess(requestsAccessMap.getDevicesLogEnergyLog)) {
      const params = buildParams(true)
      if (periodType === 'day' || periodType === 'month') {
        fetchEnergyAndUptime(params, periodType)
      }
    }
  }, [filterState, periodType, startDate, endDate])

  useEffect(() => {
    if(hasAccess(requestsAccessMap.getDevicesLogEnergyLog) || hasAccess(requestsAccessMap.getDevicesLogEnergyLogAuthedUserId)) {
      const params = buildParams()
      fetchEnergyAndUptime(params, periodType)
    }
  }, [periodType, filterState])

  return (
    <div className={styles.list}>
      <StatCard
        title="Всего устройств"
        value={String(count?.total || "0")}
        unit="шт"
        icon={<IconCpu width={20} height={20} />}
        className={styles.el}
      />
      {(hasAccess(requestsAccessMap.getDevicesLogEnergyLog) || hasAccess(requestsAccessMap.getDevicesLogEnergyLogAuthedUserId)) && <StatCard
        title={periodType === "day" ? "Текущее энергопотребление" : "Среднее энергопотребление"}
        value={(isNaN(Number(valueEnergy?.value)) ? "0" : valueEnergy.value)}
        unit={valueEnergy.unit}
        icon={<IconElectricity width={20} height={20} />}
        className={styles.el}
      />}
      {(hasAccess(requestsAccessMap.getDevicesLogEnergyLog) || hasAccess(requestsAccessMap.getDevicesLogEnergyLogAuthedUserId)) && <StatCard
        title="Общее энергопотребление"
        value={(isNaN(Number(valueEnergySum?.value)) ? "0" : valueEnergySum.value)}
        unit={valueEnergySum.unit}
        icon={<IconElectricity width={20} height={20} />}
        className={styles.el}
      />}
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

export default memo(StatsDashboard)
