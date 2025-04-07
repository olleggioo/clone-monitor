import { FC, useMemo, useState, useEffect, useRef, memo, useCallback } from 'react'
import { TableCellI, TableI, TableRowI } from '../Table'
import styles from './Test.module.scss'
import Head from './Head'
import { useSnackbar } from 'notistack'
import { useAtom } from 'jotai'
import { devicesUserIdFilterAtom, selectedInputAtom, sortConfigOptionsAtom, sortFilterAtom, sortUserFilterAtom } from '@/atoms/appDataAtom'
import Row from './Row'
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
import Load from '@/components/Load'

interface TableNewI extends TableI {
    whichTable?: string
    toLink?: boolean
    style?: any
    view?: any
    classNameHead?: any
}

const StateTable: FC<TableNewI> = ({ 
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
    // const [rowsArray, setRowsArray] = useState(
    //     rows.map((row) => {
    //       const rowCells: TableCellI[] = [];
    //       orderedColumns.forEach((headCell: any, index) => {
    //         const col = row.columns[columns.findIndex(c => c.accessor === headCell?.accessor)];
    //         rowCells.push({
    //           ...col,
    //           accessor: col?.accessor || headCell?.accessor,
    //           align: col?.align || headCell?.align,
    //           width: col?.width || headCell?.width,
    //           gap: col?.gap || headCell?.gap,
    //         });
    //       });
    //       return {
    //         ...row,
    //         columns: rowCells,
    //       };
    //     }))

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
            case 'area':
                orders.area = {
                    name: direction
                }
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
                return moment(dateStr, 'D MMM HH:mm:ss');
            };
            rowsArray.sort((a, b) => {
                const aValue = a.columns.find(col => col.accessor === key)?.title || '';
                const bValue = b.columns.find(col => col.accessor === key)?.title || '';


                const aDate = parseDate(aValue).valueOf();
                const bDate = parseDate(bValue).valueOf();
        
                if (direction === 'DESC') {
                    return bDate - aDate;
                } else {
                    return aDate - bDate;
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
        // console.log(sortedRos)
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

    const handleMouseEnter = (index: number, id: string) => {
       
    };
    
    return (
        <div>
            <DndProvider backend={HTML5Backend}>
                <div 
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
                            setSelected={handleSelect}
                            sortConfig={sortConfig} 
                            className={classNameHead}
                            moveColumn={moveColumn}
                        />}
                        {rowsArray.length !== 0 ? rowsArray.map((row: any, index:any) => (
                            <Row
                                {...row}
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
                                // onClickCheck={() => handleShiftClick(index, row.id)}
                                selectedRow={selectedRows}
                            />
                        )) : <Load />}
                </div>
            </DndProvider>
    </div>
  )
}

export default memo(StateTable)
