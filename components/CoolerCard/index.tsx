import { FC } from 'react'
import { CoolerCardI } from './CoolerCard'
import styles from './CoolerCard.module.scss'
import { IconAperture } from '@/icons'
import { formatNumber } from '@/helpers'
import classNames from 'classnames'

const CoolerCard: FC<CoolerCardI> = ({ modelId, title, rpm, percent, className }) => {
  return (
    <div className={classNames(styles.el, className)}>
      <h3 className={styles.name}>
        <IconAperture width={20} height={20} />
        {title}
      </h3>

      {modelId !== "whats-miner-m50-vh20"
        ? <p className={styles.rpm}>{formatNumber(rpm)} RPM</p>
        : <></>
      }

      <div className={styles.load}>
        <div className={styles.progress}>
          <div
            className={styles.progressInner}
            style={{ width: `${percent}%` }}
          ></div>
        </div>

        <p className={styles.percent}>{percent}%</p>
      </div>
    </div>
  )
}
export default CoolerCard
