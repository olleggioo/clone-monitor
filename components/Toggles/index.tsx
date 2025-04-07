import { FC } from 'react'
import { TogglesI, TogglesItemI } from './Toggles'
import classNames from 'classnames'
import styles from './Toggles.module.scss'
import { useAtom } from 'jotai'
import { dateCharts } from '@/atoms/statsAtom'
import { Button } from '@/ui'

const defaultToggles: TogglesItemI[] = [
  { title: 'День', type: 'day' },
  // { title: 'Неделя', type: 'week' },
  { title: 'Месяц', type: 'month' }
]

interface TogglesNewI extends TogglesI {
  downloadData?: any
}

const Toggles: FC<TogglesNewI> = ({
  items = defaultToggles,
  onToggleClick,
  activeType,
  className,
  downloadData,
}) => {
  const [date, setDate] = useAtom(dateCharts)
  return (
    <div className={styles.main}>
      <div className={classNames(styles.el, className)}>
        {items.map((item) => (
          <button
            key={item.type}
            className={classNames(styles.toggle, {
              [styles.toggle_active]: item.type === activeType
            })}
            type="button"
            onClick={() => {
              setDate({from: null})
              onToggleClick(item.type)
            }}
          >
            {item.title}
          </button>
        ))}
      </div>
        {downloadData && <Button
            onClick={downloadData}
            title="Скачать статистику, XLSX"
            // loading={downLoading}
        />}
    </div>
  )
}
export default Toggles
