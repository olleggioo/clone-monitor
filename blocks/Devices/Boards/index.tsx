import { FC } from 'react'
import { BoardI } from '@/interfaces'
import { Dashboard, Table } from '@/components'
import { boardsTableHead } from '@/blocks/Devices/data'
import { getBoardsTableData } from '@/blocks/Devices/helpers'
import TestTable from '@/components/Table/TestTable'
import styles from "./Boards.module.scss"

const Boards: FC<{ data: BoardI[]; algorithm?: string }> = ({
  data,
  algorithm
}) => {
  const rows = getBoardsTableData(data, algorithm)
  return (
    <Dashboard title="Платы">
      <TestTable 
        columns={boardsTableHead}
        rows={rows}
        required={false}
        className={styles.container}
        requiredAction={false}
      />
    </Dashboard>
  )
}
export default Boards
