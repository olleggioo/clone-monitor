import { FC, useMemo, useState, useEffect } from 'react'
import { TableCellI, TableI, TableRowI } from '../Table'
import styles from './CopyTable.module.scss'
import classNames from 'classnames'
import TableRow from './Row'
import { deviceAPI, userAPI } from '@/api'
import TableHead from './TableHead'
import { useAtom } from 'jotai'
import { deviceUpdateManyPool, devicesFilterAtom, devicesUserIdFilterAtom, sortFilterAtom, sortUserFilterAtom } from '@/atoms/appDataAtom'
import { Button, CustomSelect } from '@/ui'
import { useDeviceForm } from '@/hooks'
import { FieldsType, clientPlaceholder, deviceUserFormField, locationPlaceholder } from '@/data/devicesForms'
import { devicesAlgorithmOptions, devicesModelOptions } from '@/blocks/Devices/data'
import { useDeviceUserForm } from '@/hooks/useDeviceForm'
import FormFieldsets from '@/blocks/Devices/FormFieldsets'
import FormFieldDeviceUser from '@/blocks/Devices/FormFieldsets/FormField'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { getDevicesReq } from '@/blocks/Devices/helpers'

const initialState = {
  client: clientPlaceholder
}

const Table: FC<TableI> = ({ columns, rows, dropdownItems, isLoading, required = true }) => {
  const {enqueueSnackbar} = useSnackbar()
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
            width: col.width || headCell.width,
            gap: col.gap || headCell.gap
          })
        })
        return {
          ...row,
          columns: rowCells
        }
      }),
    [columns, rows]
  )
  
  const [selected, setSelected] = useState(false)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null); 
  
  const [_, setSortFilter] = useAtom(sortFilterAtom)
  const [__, setSortUserFilter] = useAtom(sortUserFilterAtom)
  const sortRows = (key: string) => {
    let direction = 'ASC';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ASC') {
      direction = 'DESC';
    }
    setSortConfig({ key, direction });
      const orders: any = {}
      const ordersUser: any = {}
      switch(key) {
        case 'devicePool':
          orders.devicePools = {
            pool: {
              name: direction
            }
          }
          break
        case 'deviceWorker': 
          orders.devicePools = {
            pool: {
              user: direction
            }
          }
          break
        case 'ipaddr':
          orders.ipaddr = direction
          break
        case 'area':
          orders.area = {
            name: direction
          }
          break
        case 'uptimeElapsed':
          orders.uptimeElapsed = direction
          break
        case 'nominalHashrate':
          orders.nominalHashrate = direction
          break
        case 'user':
          orders.userFullname = direction
          break
        case 'login':
          ordersUser.login = direction
          break
        case 'fullname':
          ordersUser.fullname = direction
          break
        case 'email':
          ordersUser.email = direction
          break
        case 'isGlued':
          orders.isGlued = direction
          break
        case 'phone':
          ordersUser.phone = direction
          break
        case 'contract':
          ordersUser.contract = direction
        case 'sn':
          orders.sn = direction
          break
        default: {
          rowsArray.sort((a, b) => {
            const aValue = String(a.columns.find(col => col.accessor === key)?.title || '');
            const bValue = String(b.columns.find(col => col.accessor === key)?.title || '');
            const numericAValue = !isNaN(Number(aValue)) ? Number(aValue) : null;
            const numericBValue = !isNaN(Number(bValue)) ? Number(bValue) : null;
        
            if (numericAValue !== null && numericBValue !== null) {
              return direction === 'asc' ? numericAValue - numericBValue : numericBValue - numericAValue;
            } else {
              const compareResult = aValue.localeCompare(bValue, undefined, { numeric: true, sensitivity: 'base' });
        
              return direction === 'asc' ? compareResult : -compareResult;
            }
          });
        }
      }
      setSortFilter(orders)
      setSortUserFilter(ordersUser)
  };

  const handleSelect = () => {
    setSelected((prevState: boolean) => !prevState)
  }
  const tableClass = classNames(styles.el)
  return (
    <div className={tableClass}>
      <TableHead items={columns} hasDropDown={!!dropdownItems?.length} required={required} onSort={sortRows} selected={selected} setSelected={handleSelect} />
      {rowsArray.map((row) => {
        return (
          <TableRow
            {...row}
            dropdownItems={dropdownItems}
            key={row.id}
            userId={row.userId}
            isLoading={isLoading}
            selectedAll={selected}
            required={required}
          />
        )
      })}
    </div>
  )
}

export default Table
