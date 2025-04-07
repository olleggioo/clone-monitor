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
import {
  getDevicesAlgorithmsList,
  getDevicesAlgorithmsTableData
} from '../helpers'
import { tableHead } from './tableData'
import moment from 'moment'
import Load from '@/components/Load'
import TestTable from '@/components/Table/TestTable'
import styles from "./DevicesAlgorithms.module.scss"
import { table } from 'console'
import { filter } from 'lodash'

const sortTable = (a: any,b: any) => {
  const aValue = String(a.columns.find((col: any) => col.accessor === "devices")?.title || '');
  const bValue = String(b.columns.find((col: any) => col.accessor === "devices")?.title || '');
  const numericAValue: any = !isNaN(Number(aValue)) ? Number(aValue) : null;
  const numericBValue: any = !isNaN(Number(bValue)) ? Number(bValue) : null;
  return numericBValue - numericAValue;
}

const StatsDevicesAlgorithms: FC<{ className?: string, periodType: ChartPeriodType }> = ({ className, periodType }) => {
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
      const abortController = new AbortController();
    
      (async () => {
        try {
          setLoading(true);
          
          // Передаём signal для возможности отмены запросов
          const algorithmss: DeviceAlgorithmI[] = await getDevicesAlgorithmsList(devices, periodType, filterState, algorithms);
          
          const res: any = await Promise.all(
            algorithmss.map((algorithm) =>
              deviceAPI.getDevicesHashrateCacheDaySum({
                where: {
                  algorithmId: algorithm.id,
                  createdAt: `$Between([\"${moment().subtract(5, 'minutes').subtract(3, 'hour').format('YYYY-MM-DD HH:mm:ss')}\",\"${moment().subtract(3, 'hour').format('YYYY-MM-DD HH:mm:ss')}\"])`
                },
                select: {
                  createdAt: true,
                  value: true
                },
                order: {
                  createdAt: "ASC"
                }
              },
              { signal: abortController.signal } // Передаём signal в запрос
              )
            )
          );
    
          const count = await Promise.all(
            algorithmss.map((algorithm) => 
              deviceAPI.getDevicesStatusCount({
                where: {
                  userId: filterState.client || null,
                  algorithmId: algorithm.id,
                  areaId: filterState.area || null,
                  modelId: filterState.model || null,
                  rangeipId: null,
                }
              },
              { signal: abortController.signal } // Передаём signal в запрос
              )
            )
          );
    
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
    
          setLoading(false);
        } catch (error: any) {
          if (error.name === 'AbortError') {
            console.log('Запрос был отменён');
          } else {
            console.error(error);
          }
        }
      })();
    
      return () => {
        abortController.abort();
      };
    }, [devices, algorithms, filterState]);

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

export default memo(StatsDevicesAlgorithms)
