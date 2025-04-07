import { FC, useMemo, useState, useEffect, useRef, memo, useCallback } from 'react'
import { TableCellI, TableI, TableRowI } from '../Table'
import styles from './TableNew.module.scss'
import { useSnackbar } from 'notistack'
import { useAtom } from 'jotai'
import { checkedAtom, devicesUserIdFilterAtom, selectedInputAtom, sortConfigOptionsAtom, sortFilterAtom, sortUserFilterAtom } from '@/atoms/appDataAtom'
import { Dropdown, IconButton } from '@/ui'
import classNames from 'classnames'
import { inet_aton } from '@/util/iten_atom'
import { ArrowBack, ArrowBackIos, ArrowForwardIos, ArrowLeft, BackHandOutlined } from '@mui/icons-material'
import { Column, Table, AutoSizer } from 'react-virtualized';
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { Container } from '@mui/material'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import moment from 'moment'
import { dir } from 'console'
import { range, uniq } from 'lodash'
import Head from './Head'
import Row from './Row'

interface TableNewI extends TableI {
    whichTable?: string
    toLink?: boolean
    style?: any
    view?: any
    classNameHead?: any
}

const TableNew:FC<TableNewI> = ({ 
    columns, 
    rows, 
    dropdownItems, 
    isLoading, 
    required = true, 
    className, 
    requiredAction = true, 
    whichTable,
    toLink ,
    style,
    view,
    classNameHead,
}) => {
    const elementScrollRefLink = useRef<HTMLDivElement>(null);
    const elementScrollRef = useRef<any>(null);
    let mx = 0;
    let sx = 0;
    const handleMouseDown = (e: any) => {
        sx = elementScrollRef.current.scrollLeft;
        mx = e.pageX - elementScrollRef.current.offsetLeft;
    
        elementScrollRef.current.addEventListener("mousemove", handleMouseMove);
      };
    
    const handleMouseUp = () => {
        mx = 0;
        elementScrollRef.current.removeEventListener("mousemove", handleMouseMove);
    };

    const handleMouseMove = (e: any) => {
        if (e.buttons !== 1) {
            return;
        }
        
        const mx2 = e.pageX - elementScrollRef.current.offsetLeft;
        if (mx) {
          elementScrollRef.current.scrollLeft = sx + mx - mx2;
        }
    };
    const {enqueueSnackbar} = useSnackbar()
    const columnOrder = columns.map((_, index) => index);

    const moveColumn = useCallback((dragIndex: any, hoverIndex: any) => {
        const newOrder = [...columnOrder];
        const [movedItem] = newOrder.splice(dragIndex, 1);
        newOrder.splice(hoverIndex, 0, movedItem);
        // setColumnOrder(newOrder);
    }, [columnOrder, columns]);
    
    const orderedColumns = columnOrder.map(index => columns[index]);

    const [selected, setSelected] = useAtom(selectedInputAtom)
    const [sortConfig, setSortConfig] = useAtom(sortConfigOptionsAtom);
    const rowsArray = useMemo(
        () =>
          rows.map((row) => {
            const rowCells: TableCellI[] = [];
            orderedColumns.forEach((headCell: any, index) => {
              const col = row.columns[columns.findIndex(c => c.accessor === headCell?.accessor)];
              rowCells.push({
                ...col,
                accessor: col?.accessor || headCell?.accessor,
                align: col?.align || headCell?.align,
                width: col?.width || headCell?.width,
                gap: col?.gap || headCell?.gap,
              });
            });
            return {
              ...row,
              columns: rowCells,
            };
          }),
        [orderedColumns, rows, columns, sortConfig]
    );
    
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
            case 'model':
                orders.model = {
                    name: direction
                }
                break
            case 'isBlinking':
                orders.isBlinking = direction
                break
            case 'miningState':
                orders.isDisabled = direction
                break
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
            case 'rejectedPollsProcents': 
                orders.rejectedPollsProcents = direction
                break
            case 'container':
                orders.rangeip = {
                    name: direction
                }
                break
            case 'area':
                orders.area = {
                    name: direction
                }
                // orders.areaId = direction
                break
            case 'lastSeenNormal':
                orders.lastSeenNormal = direction    
            break
            case 'energy':
                orders.currentEnergy = direction
                break
            case 'deviceBoards':
                orders.currentRate = direction
                break
            case 'partNumber':
                orders.partNumber = direction
                break
            case 'role':
                ordersUser.roleId = direction
                break
            case 'owner':
                orders.ownerId = direction
                break
            case 'uptimeElapsed':
                orders.uptimeElapsed = direction
                break
            case 'nominalHashrate':
                orders.nominalHashrate = direction
                break
            case 'user':
                // orders.userFullname = direction
                orders.userDevices = {
                    user: {
                        fullname: direction
                    }
                }
                break
            case 'login':
                ordersUser.login = direction 
                break
            case 'fullname':
                ordersUser.fullname = direction
                // ordersUser.userDevices = direction
                break
            case 'email':
                ordersUser.email = direction
                break
            case 'phone':
                ordersUser.phone = direction
                break
            case 'isGlued':
                orders.isGlued = direction
                break
            case 'isFlushed':
                orders.isFlashed = direction
                break
            case 'contract':
                ordersUser.contract = direction
                break
            case 'sn':
                orders.sn = direction
                break
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
          case 'createdAt': {
            const parseDate = (dateStr: string) => {
                return moment(dateStr, 'D MMM. HH:mm:ss');
            };
            rowsArray.sort((a, b) => {
                const aValue = a.columns.find(col => col.accessor === key)?.title || '';
                const bValue = b.columns.find(col => col.accessor === key)?.title || '';


                const aDate = parseDate(aValue).valueOf();
                const bDate = parseDate(bValue).valueOf();
        
                if (direction === 'DESC') {
                    return aDate - bDate;
                } else {
                    return bDate - aDate;
                }
            });
            break
        }
            default: {
                rowsArray.sort((a, b) => {
                const aValue = String(a.columns.find(col => col.accessor === key)?.title || '');
                const bValue = String(b.columns.find(col => col.accessor === key)?.title || '');
                const numericAValue = !isNaN(Number(aValue)) ? Number(aValue) : null;
                const numericBValue = !isNaN(Number(bValue)) ? Number(bValue) : null;
                if (numericAValue !== null && numericBValue !== null) {
                return direction === 'DESC' ? numericAValue - numericBValue : numericBValue - numericAValue;
                } else {
                const compareResult = aValue.localeCompare(bValue, undefined, { numeric: true, sensitivity: 'base' });
            
                return direction === 'ASC' ? compareResult : -compareResult;
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

    const [selectedRows, setSelectedRows] = useState(new Set());
    const [isSelectingf, setIsSelectingf] = useState(false);
    const [state, setState] = useAtom(devicesUserIdFilterAtom)

    const handleMouseDownCheck = (index: any) => {
        setIsSelectingf(true);
    };

    const handleMouseUpCheck = () => {
        setIsSelectingf(false);
    };

    const handleMouseEnter = (index: number, id: string) => {}
    const checkboxes = new Array(20).fill(null);

    // const [checked, setChecked] = useState<any>([]);
    const [checked, setChecked] = useAtom(checkedAtom)
    const lastChecked = useRef<any>(null);

    const handleSelectAll = useCallback((e: any) => {
        if (e.target.checked) {
          // Выбираем все элементы
          const allIndexes = rowsArray.map((_, index) => index);
          setChecked(allIndexes);
      
          // Добавляем все элементы в состояние
          setState(() => {
            return rowsArray.map((item) => ({ flag: true, id: item.id }));
          });
        } else {
          // Снимаем выбор со всех элементов
          setChecked([]);
          setState([]);
        }
    }, [rowsArray]);

    const handleChange = useCallback((e: any) => {
        const index = Number(e.target.dataset.index);
      
        if (lastChecked.current !== null && e.nativeEvent.shiftKey) {
          setChecked((prev: any) => {
            const start = Math.min(lastChecked.current, index);
            const end = Math.max(lastChecked.current, index);
            return uniq([...prev, ...range(start, end), end]);
          });
      
          setState((prevState: any) => {
            const start = Math.min(lastChecked.current, index);
            const end = Math.max(lastChecked.current, index);
            const uniqueState = prevState.filter(
              (item: any, index: any, array: any) =>
                array.findIndex((t: any) => t.id === item.id) === index
            );
      
            // Добавляем новые элементы только если их еще нет в состоянии
            const newItems = rowsArray
              .filter((_, i) => [...range(start + 1, end), end].includes(i))
              .map((item) => ({ flag: true, id: item.id }))
              .filter(
                (newItem) =>
                  !uniqueState.some((existingItem: any) => existingItem.id === newItem.id)
              );
      
            return [...uniqueState, ...newItems];
          });
          return;
        }
      
        if (e.target.checked) {
          lastChecked.current = index;
          setChecked((prev: any) => [...prev, index]);
          const newElem = rowsArray[index].id;
      
          setState((prevState: any) => {
            const uniqueState = prevState.filter(
              (item: any, index: any, array: any) =>
                array.findIndex((t: any) => t.id === item.id) === index
            );
      
            // Добавляем новый элемент только если его нет в состоянии
            if (!uniqueState.some((item: any) => item.id === newElem)) {
              return [...uniqueState, { flag: true, id: newElem }];
            }
            return uniqueState;
          });
        } else {
          lastChecked.current = null;
          setChecked((prev: any) => prev.filter((i: any) => i !== index));
          const removeId = rowsArray[index].id;
      
          setState((prevState: any) => {
            // Удаляем элемент с соответствующим `id`
            return prevState.filter((item: any) => item.id !== removeId);
          });
        }
    }, [rowsArray]);

    return (
        <div>
            {/* <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={checked.length === rowsArray.length}
            />
            {checkboxes.map((_, i) => (
                <div key={i}>
                    <label>
                        <input
                        checked={checked.includes(i)}
                        data-index={i}
                        type="checkbox"
                        onChange={handleChange}
                        />
                        checkbox {i}
                    </label>
                </div>
            ))} */}
            <DndProvider backend={HTML5Backend}>
                <table 
                    id="main-table"
                    ref={elementScrollRef}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}    
                    className={classNames(styles.container, className)}>
                        {orderedColumns && <Head 
                            items={orderedColumns} 
                            hasDropDown={!!dropdownItems?.length} 
                            whichTable={whichTable}
                            requiredAction={requiredAction} 
                            required={required} 
                            onSort={sortRows} 
                            setSelected={handleSelectAll}
                            sortConfig={sortConfig} 
                            className={classNameHead}
                            moveColumn={moveColumn}
                            handleSelectAll={handleSelectAll}
                            checked={checked.length === rowsArray.length}
                        />}
                        <tbody className={styles.tbody}>

                            {rowsArray.map((row: any, index:any) => (
                                <Row
                                    {...row}
                                    changePoolStatusVerbose={row.changePoolStatusVerbose}
                                    lastSeenNormal={row.lastSeenNormal}
                                    view={view}
                                    index={index}
                                    length={rowsArray.length}
                                    dropdownItems={dropdownItems}
                                    key={row.id || index}
                                    userId={row.userId}
                                    isReserved={row.isReserved}
                                    isLoading={isLoading}
                                    whichTable={whichTable}
                                    selectedAll={selected}
                                    required={required}
                                    style={style}
                                    requiredAction={requiredAction}
                                    startRowIndex={isSelectingf}
                                    handleMouseDown={() => handleMouseDownCheck(index)}
                                    handleMouseUp={handleMouseUpCheck}
                                    handleMouseEnter={() => handleMouseEnter(index, row.id)}
                                    onChangeInput={handleChange}
                                    checkedI={checked.includes(index)}
                                    // onClickCheck={() => handleShiftClick(index, row.id)}
                                    selectedRow={selectedRows}
                                />
                            ))}
                        </tbody>
                </table>
            </DndProvider>
    </div>
  )
}

export default memo(TableNew)
