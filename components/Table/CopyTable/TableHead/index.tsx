import { FC, useState } from 'react'
import { Button, Checkbox } from '@/ui'
import styles from './TableHead.module.scss'
import Sort from '@/icons/Sort'
import classNames from 'classnames'
import { TableHeadCellI } from '@/components/Table/Table'
import SortArrow from '@/icons/SortArrow'
import { devicesFilterAtom } from '@/atoms/appDataAtom'
import { useAtom } from 'jotai'
import SortAction from '../../TableHead/Sort'
import { deviceAtom } from '@/atoms'

const TableHead: FC<{ items: TableHeadCellI[]; hasDropDown?: boolean, selected?: boolean, setSelected?: any, required: boolean, onSort: any }> = ({
  items,
  hasDropDown,
  selected,
  setSelected,
  required = true,
  onSort
}) => {
  const roleId = localStorage.getItem(`${process.env.API_URL}_role`)
  const [flashed, setFlashed] = useState(false)
  const [filter, setFilter] = useAtom(devicesFilterAtom)
  const [device] = useAtom(deviceAtom)
  const onClickFlashed = () => {
    setFlashed(prevState => !prevState)
    setFilter((prevState: any) => {
      return {
          ...prevState,
          isFlashed: flashed === true ? true : "false"
      }
  })
  }

  return (
    <div className={styles.block}>
      {items.map((item, i) => {
        const alignClass =
          item.align !== 'left' ? styles[`align_${item.align}`] : undefined
        const cellClass = classNames(styles.cell, alignClass)
        let width
        if (item.width) {
          width = item.width > 100 ? 100 : item.width < 5 ? 5 : item.width
        }
        return (
          <div
            className={cellClass}
            style={device !== "mobile" ? {
              color: '#878787',
              width: width ? `${width}%` : undefined,
              cursor: 'pointer'
            } : {
              color: '#878787',
              width: 'auto',
              cursor: 'pointer'
            }}
            onClick={item.accessor !== "isFlashed" ? () => onSort && onSort(item.accessor) : () => {}}
            key={item.title}
          >
            {onSort && <SortAction />}
            {item.onClick ? (
              <Button
                title={item.title}
                appearance="table"
                onClick={item.onClick}
              />
            ) : item.accessor === "isFlushed"
                ? <Button title={item.title} appearance='table' onClick={onClickFlashed} />
                : <span className={styles.cellTitle} style={{borderBottom: '1px solid #878787'}}>{item.title}</span>
            }
          </div>
        )
      })}
      {hasDropDown && <span className={styles.spacer} />}
      {required && roleId !== "b3c5ce0e-884d-11ee-932b-300505de684f" &&  <input 
        style={{
          position: 'absolute',
          right: 0
        }}
        type='checkbox'
        checked={selected}
        onChange={setSelected}
      />}
    </div>
  )
}

export default TableHead
