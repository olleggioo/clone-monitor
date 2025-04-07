import { FC, useMemo, useState, useEffect } from 'react'
import { TableCellI, TableI, TableRowI } from './Table'
import styles from './Table.module.scss'
import classNames from 'classnames'
import TableHead from './TableHead'
import TableRow from './Row'
import { deviceAPI } from '@/api'
import {inet_aton} from "@/util/iten_atom"
import { useAtom } from 'jotai'
import { areaFiltersTable, sortFilterAtom } from '@/atoms/appDataAtom'

const Table: FC<TableI> = ({ columns, rows, dropdownItems, isLoading, reqSort = false }) => {
  const rowsArray = useMemo(
    () =>
      rows.map((row) => {
        const rowCells: TableCellI[] = []
        columns.forEach((headCell, index) => {
          const col = row.columns[index]
          rowCells.push({
            ...col,
            accessor: col.accessor || headCell.accessor,
            align: col.align || headCell.align,
            width: col.width || headCell.width
          })
        })
        return {
          ...row,
          columns: rowCells
        }
      }),
    [columns, rows]
  )

  const tableClass = classNames(styles.el)
  const [_, setSortFilter] = useAtom(areaFiltersTable)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null); 

  const sortRows = (key: string) => {
    let direction = 'ASC';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ASC') {
      direction = 'DESC';
    }
    setSortConfig({ key, direction });
      const orders: any = {}
      const ordersUser: any = {}
      switch(key) {
        case 'from':
          rowsArray.sort((a, b) => {
            const aValue = a.columns.find(col => col.accessor === key)?.title || '';
            const bValue = b.columns.find(col => col.accessor === key)?.title || '';
      
            const numericAValue = inet_aton(aValue);
            const numericBValue = inet_aton(bValue);
      
            if (direction === 'DESC') {
              return numericAValue - numericBValue;
            } else {
              return numericBValue - numericAValue;
            }
          });
          break;
        case 'to':
          rowsArray.sort((a, b) => {
            const aValue = a.columns.find(col => col.accessor === key)?.title || '';
            const bValue = b.columns.find(col => col.accessor === key)?.title || '';
      
            const numericAValue = inet_aton(aValue);
            const numericBValue = inet_aton(bValue);
      
            if (direction === 'DESC') {
              return numericAValue - numericBValue;
            } else {
              return numericBValue - numericAValue;
            }
          });
          break;
        default: {
          rowsArray.sort((a, b) => {
            const aValue = String(a.columns.find(col => col.accessor === key)?.title || '');
            const bValue = String(b.columns.find(col => col.accessor === key)?.title || '');
            const numericAValue = !isNaN(Number(aValue)) ? Number(aValue) : null;
            const numericBValue = !isNaN(Number(bValue)) ? Number(bValue) : null;
        
            if (numericAValue !== null && numericBValue !== null) {
              return direction === 'ASC' ? numericAValue - numericBValue : numericBValue - numericAValue;
            } else {
              const compareResult = aValue.localeCompare(bValue, undefined, { numeric: true, sensitivity: 'base' });
        
              return direction === 'ASC' ? compareResult : -compareResult;
            }
          });
        }
      }
      setSortFilter(orders)
      // setSortUserFilter(ordersUser)
  };

  // const sortRows = (key: string) => {
  //   let direction = 'asc';
  //   if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
  //     direction = 'desc';
  //   }
  //   setSortConfig({ key, direction });

  //   // Сортировка массива rowsArray
  //   rowsArray.sort((a, b) => {
  //     const aValue = a.columns.find(col => col.accessor === key)?.title || '';
  //     const bValue = b.columns.find(col => col.accessor === key)?.title || '';

  //     const numericAValue = inet_aton(aValue);
  //     const numericBValue = inet_aton(bValue);

  //     if (direction === 'asc') {
  //       return numericAValue - numericBValue;
  //     } else {
  //       return numericBValue - numericAValue;
  //     }
  //   });
  // };

  return (
    <div className={tableClass}>
      <TableHead items={columns} hasDropDown={!!dropdownItems?.length} req={reqSort} onSort={sortRows} />
      {rowsArray.map((row) => {
        return (
          <TableRow
            {...row}
            dropdownItems={dropdownItems}
            key={row.id}
            isLoading={isLoading}
          />
        )
      })}
    </div>
  )
}

export default Table
