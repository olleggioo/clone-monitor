import { FC, useState } from 'react'
import { Button } from '@/ui'
import styles from './TableHead.module.scss'
import Sort from '@/icons/Sort'
import classNames from 'classnames'
import { TableHeadCellI } from '@/components/Table/Table'
import SortArrow from '@/icons/SortArrow'
import SortAction from './Sort'

const TableHead: FC<{ items: TableHeadCellI[]; hasDropDown?: boolean, onSort?: any, req?: boolean}> = ({
  items,
  hasDropDown,
  onSort,
  req = false
}) => {
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
            style={{
              width: width ? `${width}%` : undefined
            }}
            onClick={() => onSort && onSort(item.accessor)}
            key={item.title}
          >
            {onSort && <SortAction />}
            {item.onClick ? (
              <Button
                title={item.title}
                appearance="table"
                onClick={item.onClick}
              />
            ) : (
              <span style={{borderBottom: '1px solid #878787', cursor: 'pointer'}}>{item.title}</span>
            )}
          </div>
        )
      })}
      {hasDropDown && <span className={styles.spacer} />}
    </div>
  )
}

export default TableHead
