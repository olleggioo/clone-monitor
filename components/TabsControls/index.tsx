import { FC, memo } from 'react'
import { TabsControlsI } from './TabsControls'
import styles from './TabsControls.module.scss'
import classNames from 'classnames'
import { formatNumber } from '@/helpers'

interface TabsControlIUpt extends TabsControlsI {
  onChangePage?: any
  items: any
}

const TabsControls: FC<TabsControlIUpt> = ({ items, currentTab, onChange, modelId, onChangeChartData, abortController, onChangePage }) => {
  const handleChange = (value: string, id?: string) => {
    if(onChange) {
      onChange(value, id)
    }
    if(onChangePage) {
      onChangePage(1)
    }
    if(true && onChangeChartData) {
      onChangeChartData([])
    }
  }
  let filterDevices = items;
  if(modelId === "whats-miner-m50-vh20") {
    filterDevices = items.filter((item: any) => item.text !== "Кулеры")
  }

  return (
    <div className={styles.controls}>
      {filterDevices.map((item: any) => (  
        <button
          key={item.text}
          className={classNames(
            styles.control,
            item.mod ? styles[item.mod] : '',
            {
              [styles.control_active]: item.text === currentTab
            }
          )}
          type="button"
          onClick={() => handleChange(item.text, item.id)}
        >
          {item.text}
          {!!item.count && <span>({formatNumber(item.count)})</span>}
        </button>
      ))}
    </div>
  )
}

export default memo(TabsControls)
