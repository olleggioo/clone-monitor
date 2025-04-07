import { FC } from 'react'
import { useRouter } from 'next/router'
import { useAtom } from 'jotai'
import { TableHeadCellI } from '@/components/Table/Table'
import { statsDataAtom } from '@/atoms/statsAtom'
import { getDevicesStatuseTableData } from '../helpers'
import { Dashboard, Table } from '@/components'
import { deviceTabsControlsAtom } from '@/atoms/appDataAtom'
import TestTable from '@/components/Table/TestTable'
import styles from "./DeviceStatuses.module.scss"
import FlexTable from '@/components/Table/FlexTable'

function getOrderIndex(title: string) {
  switch(title) {
      case "В норме":
          return 0;
      case "Предупреждение":
          return 1;
      case "Проблема":
          return 2;
      case "Не в сети":
          return 3;
      case "В ремонте":
          return 4;
      default:
          return 5;
  }
}

const StatsDevicesStatuses: FC<{ className?: string }> = ({ className }) => {
  const router = useRouter()
  const [_, setCurrentTabTest] = useAtom(deviceTabsControlsAtom)

  const [{ statusStats }] = useAtom(statsDataAtom)

  const handleStatusClick = (id: string, title: string) => {
    setCurrentTabTest({
      id: id,
      value: title
    })
    router.push(`/devices`)
  }

  const columns: TableHeadCellI[] = [
    {
      title: 'Статус',
      accessor: 'status'
    },
    {
      title: 'Устройства',
      accessor: 'devices',
      align: 'right'
    }
  ]
  const rows = getDevicesStatuseTableData(statusStats, handleStatusClick).sort((a, b) => {
    const titleA = a.columns[0].title;
    const titleB = b.columns[0].title;

    const orderIndexA = getOrderIndex(titleA);
    const orderIndexB = getOrderIndex(titleB);

    return orderIndexA - orderIndexB;
  });

  return (
    <Dashboard title="Устройства по статусам" sizeTitle={"sm"} titleTagName='h4' className={className}>
      <FlexTable 
        columns={columns}
        rows={rows}
      />
      {/* <TestTable
        columns={columns}
        rows={rows}
        className={styles.container}
        requiredAction={false}
        required={false} 
        reqSort={false}
      /> */}
    </Dashboard>
  )
}

export default StatsDevicesStatuses
