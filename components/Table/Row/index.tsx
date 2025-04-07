import { FC, MouseEvent, useState, useEffect } from 'react'
import styles from './TableRow.module.scss'
import { TableRowI } from '@/components/Table/Table'
import TableCell from '@/components/Table/TableCell'
import { Dropdown } from '@/ui'
import classNames from 'classnames'
import { deviceAPI } from '@/api'
import { DataPointI } from '@/interfaces'

const TableRow: FC<TableRowI> = ({
  id,
  columns,
  isLoading,
  onClick,
  dropdownItems
}) => {
  const [state, setState] = useState([]);
    
  const handleClick = (evt: MouseEvent<HTMLDivElement>) => {
    const targetEl = evt.target as Element
    const isDropdownClick = !!targetEl.closest('[data-dropdown-id]')
    if (!isDropdownClick) {
      onClick && onClick()
    }
  }
  const rowClass = classNames(styles.el, { [styles.hover]: !!onClick })

  return (
    <div className={rowClass} onClick={handleClick}>
      {columns.map((cell) => {
        return (
          <TableCell
            {...cell}
            state={state}
            key={`${cell.accessor}_${cell.title}`}
            isLoading={isLoading}
          />
        )
      })}
      {dropdownItems && (
        <Dropdown items={dropdownItems} id={id} className={styles.dropdown} />
      )}
    </div>
  )
}

export default TableRow
