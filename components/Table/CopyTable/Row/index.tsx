import React, { FC, MouseEvent, useState, useEffect, useCallback } from 'react'
import styles from './TableRow.module.scss'
import { TableRowI } from '@/components/Table/Table'
import TableCell from '@/components/Table/CopyTable/TableCell'
import { Checkbox, Dropdown } from '@/ui'
import classNames from 'classnames'
import { deviceAPI } from '@/api'
import { DataPointI } from '@/interfaces'
import { useAtom } from 'jotai'
import { devicesUserIdFilterAtom } from '@/atoms/appDataAtom'

const TableRow: FC<TableRowI> = ({
  id,
  userId,
  columns,
  isLoading,
  onClick,
  dropdownItems,
  selectedAll = false,
  required = true
}) => {
  const roleId = localStorage.getItem(`${process.env.API_URL}_role`)
  const [checked, setChecked] = useState<boolean>(false);
  const [state, setState] = useAtom(devicesUserIdFilterAtom)
  const handleClick = (evt: MouseEvent<HTMLDivElement>) => {
    const targetEl = evt.target as Element
    const isDropdownClick = !!targetEl.closest('[data-dropdown-id]')
    if (!isDropdownClick) {
      onClick && onClick()
    }
  }

  const hasUserId = (userIdToCheck: string) => {
    return state.some(device => device.id === userIdToCheck);
  };
  const handleCheckboxChange = (evt: any) => {
    const newChecked = !checked;
  
    if (newChecked === checked) {
      return;
    }
  
    setState((prevState: any) => {
      const uniqueState = prevState.filter(
        (item: any, index: any, array: any) => array.findIndex((t: any) => t.id === item.id) === index
      );
  
      if (newChecked) {
        return [...uniqueState, { id }];
      } else {
        return uniqueState.filter((device: any) => device.id !== id);
      }
    });
  
    setChecked(newChecked);
  };
  

  useEffect(() => {
    if(selectedAll && !checked) {
      setChecked(selectedAll);
      setState((prevState: any) => [...prevState, { id: id }]);
    } else {
      setChecked(false)
      setState([])
    }
  }, [selectedAll]);

  const rowClass = classNames(styles.el, { [styles.hover]: !!onClick })
  return (
    <div className={rowClass} style={columns[0].gap ? {gap: "20px"}: {}}>
      {columns[0].title.includes("Antminer") ? columns.map((cell) => {
          return <TableCell
            {...cell}
            userId={userId}
            onClick={handleClick}
            url={"http://root:root@"}
            key={`${cell.accessor}_${cell.title}`}
            isLoading={isLoading}
          />
      }) : columns.map((cell) => {
        return <TableCell
          {...cell}
          userId={userId}
          onClick={handleClick}
          url={"https://"}
          key={`${cell.accessor}_${cell.title}`}
          isLoading={isLoading}
        />
    })}
      {dropdownItems && (
        <Dropdown items={dropdownItems} id={id} className={styles.dropdown} />
      )}
        {required && roleId !== "b3c5ce0e-884d-11ee-932b-300505de684f" && <input 
          type='checkbox'
          value={userId}
          checked={checked}
          onChange={handleCheckboxChange}
        />}
    </div>
  )
}

export default TableRow