import { CoolerCard, Dashboard } from '@/components'
import { FC } from 'react'
import styles from './Coolers.module.scss'
import { FanI } from '@/interfaces'
import TestTable from '@/components/Table/TestTable'
import { coolersTableHead } from '../data'
import { getCollersTableData, getPoolTableData } from '../helpers'

const Coolers: FC<{ modelId: string | undefined, data: FanI[] }> = ({ modelId, data }) => {
  return (
    <Dashboard title="Кулеры" className={styles.el}>
      <TestTable 
        columns={coolersTableHead}
        rows={getCollersTableData(data)}
        required={false}
        className={styles.container}
        requiredAction={false}
      />
      {/* <div className={styles.list}>
        {data.map((fan, index) => {
          return (
            <CoolerCard
              title={`Кулер ${index + 1}`}
              rpm={fan.value}
              percent={Number(fan.pwm)}
              modelId={modelId}
              className={styles.item}
              key={index}
            />
          )
        })}
      </div> */}
    </Dashboard>
  )
}
export default Coolers
