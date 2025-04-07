import { CoolerCard, Dashboard } from '@/components'
import { FC } from 'react'
import styles from './Coolers.module.scss'
import { FanI } from '@/interfaces'
import TestTable from '@/components/Table/TestTable'
import { coolersTableHead } from '../data'
import { getCollersTableData, getPoolTableData } from '../helpers'
import classNames from 'classnames'
import CoolersBlock from './Coolers'

const Coolers: FC<{ 
  modelId: string | undefined, 
  data: FanI[],
  className?: any 
}> = ({ modelId, data, className }) => {
  const coolersClass = classNames(styles.el, className)
  
  return (
    <Dashboard title="Охлаждение" className={coolersClass}>
      {/* <TestTable 
        columns={coolersTableHead}
        rows={getCollersTableData(data)}
        required={false}
        className={styles.container}
        requiredAction={false}
      /> */}
      <CoolersBlock fans={data} />
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
