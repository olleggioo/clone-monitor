import { FC } from 'react'
import { StatCardI } from './StatCard'
import styles from './StatCard.module.scss'
import classNames from 'classnames'
import { Dashboard } from '@/components'
import { Heading } from '@/ui'

const StatCard: FC<StatCardI> = ({
  title,
  icon,
  value,
  unit,
  additionalValue,
  additionalUnit,
  appearance,
  isLoading,
  className
}) => {
  const appearanceClass =
    appearance !== 'default' ? styles[`el_${appearance}`] : undefined
  const statCardClass = classNames(
    styles.el,
    appearanceClass,
    {
      [styles.is_loading]: isLoading
    },
    className
  )

  return (
    <Dashboard className={statCardClass}>
      {title && (
        <div className={styles.head}>
          {icon}
          <Heading
            tagName="h2"
            text={title}
            size="sm"
            className={styles.title}
          />
        </div>
      )}
      <div style={{
        display: "flex",
        justifyContent: 'space-between',
        alignItems: "center"
      }}>
        <p className={styles.text}>
          {value}
          {unit && <span className={styles.unit}> {unit}</span>}
          {additionalValue &&
            <span className={styles.text_mini}>
            &nbsp;из {additionalValue}
            {additionalUnit && <span className={styles.unit}>{additionalUnit}</span>}
          </span>
          }
        </p>
        
      </div>
    </Dashboard>
  )
}

export default StatCard
