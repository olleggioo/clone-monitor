import {
  FC,
  useState,
  useEffect,
  useMemo,
  memo
} from 'react'
import { useAtom } from 'jotai'
import type { ChartPeriodType, DeviceAlgorithmI } from '@/interfaces'
import { deviceAPI } from '@/api'
import {
  statsDataAtom,
  statsFilterAtom,
} from '@/atoms/statsAtom'
import {
  Dashboard,
} from '@/components'
// import {
//   getDevicesAlgorithmsList,
//   getDevicesAlgorithmsTableData
// } from '../helpers'
import { tableHead } from './tableData'
import moment from 'moment'
import Load from '@/components/Load'
import TestTable from '@/components/Table/TestTable'
import styles from "./DevicesAlgorithms.module.scss"
import { table } from 'console'
import { filter } from 'lodash'
import { getDevicesAlgorithmsList, getDevicesAlgorithmsTableData } from '@/blocks/Statistics/helpers'

const sortTable = (a: any,b: any) => {
  const aValue = String(a.columns.find((col: any) => col.accessor === "devices")?.title || '');
  const bValue = String(b.columns.find((col: any) => col.accessor === "devices")?.title || '');
  const numericAValue: any = !isNaN(Number(aValue)) ? Number(aValue) : null;
  const numericBValue: any = !isNaN(Number(bValue)) ? Number(bValue) : null;
  return numericBValue - numericAValue;
}

const StatsDevicesAlgorithmsClients: FC<{ className?: string, periodType: ChartPeriodType }> = ({ className, periodType }) => {
  const [{ devices, algorithms }, setStatsDataAtom] = useAtom(statsDataAtom)
  const [filterState] = useAtom(statsFilterAtom)
  const [algorithmsWithHashrate, setAlgorithmsWithHashrate] = useState<any[]>([]);
  const [loading, setLoading] = useState(true)
  const tableData = useMemo(() => {
    return {
      columns: tableHead,
      rows: getDevicesAlgorithmsTableData(tableHead, algorithmsWithHashrate).sort(sortTable)
    }
  }, [algorithmsWithHashrate])

    const dateFrom = {
      day: moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
      week: moment().subtract(1, 'week').format('YYYY-MM-DD HH:mm:ss'),
      month: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss')
    }
    const dateNow = moment().format('YYYY-MM-DD HH:mm:ss')

    useEffect(() => {
      
      (async () => {
        try {
        setLoading(true)
          const algorithmss: DeviceAlgorithmI[] = await getDevicesAlgorithmsList(devices, periodType, filterState, algorithms)
          const res: any = await Promise.all(algorithmss.map((algorithm) =>
            deviceAPI.getDevicesHashrateCacheDaySum({
              where: {
                  // areaId: filterState.area || "",
                  // modelId: filterState.model || "",
                  // statusId: filterState.status || "",
                  // userId: filterState.client || "",
                  // rangeipId: "",
                  algorithmId: algorithm.id,
                  createdAt: `$Between([\"${moment().subtract(5, 'minutes').format('YYYY-MM-DD HH:mm:ss')}\",\"${moment().format('YYYY-MM-DD HH:mm:ss')}\"])`
              },
              select: {
                createdAt: true,
                value: true
              },
              order: {
                createdAt: "ASC"
              }
            })
          ));
          const count = await Promise.all(algorithmss.map((algorithm) => 
          deviceAPI.getDevicesStatusCount({
              where: {
                userId: filterState.client || null,
                algorithmId: algorithm.id,
                areaId: filterState.area || null,
                modelId: filterState.model || null,
                rangeipId: null,
              }
          })
        ))
              setAlgorithmsWithHashrate(
                algorithmss.map((algorithm, index) => ({
                  ...algorithm,
                  hashrate: res[index][0]?.value || 0,
                  devices: count[index].total
                }))
              );
      
              setStatsDataAtom((prevState: any) => {
                return {
                  ...prevState,
                  sumEnergy: algorithmss.map((algorithm, index) => ({
                    ...algorithm,
                    hashrate: res[index].total,
                  }))
                };
              });
              setLoading(false)
        } catch (error) {
          console.log(error);
        }
      })()

    }, [devices, algorithms, filterState])
  return (
    <Dashboard title="Устройства по алгоритмам" sizeTitle={"sm"} titleTagName='h4' className={className}>
      {loading 
      ? <div style={{
        margin: 'auto'
      }}>
          <Load />
        </div>
      : <TestTable 
        {...tableData}
        className={styles.container}
        requiredAction={false}
        required={false} 
        reqSort={false}
        classNameHead={styles.headCol}
      />
    }
    </Dashboard>
  )
}

export default memo(StatsDevicesAlgorithmsClients)
