import { FC, useMemo, useState, useEffect, useRef, memo } from 'react'
import { TableCellI, TableI, TableRowI } from '../Table'
import styles from './../TestTable/Test.module.scss'
import { useSnackbar } from 'notistack'
import { useAtom } from 'jotai'
import { selectedInputAtom, sortConfigOptionsAtom, sortFilterAtom, sortUserFilterAtom } from '@/atoms/appDataAtom'
import { Dropdown, IconButton } from '@/ui'
import classNames from 'classnames'
import { inet_aton } from '@/util/iten_atom'
import { ArrowBack, ArrowBackIos, ArrowForwardIos, ArrowLeft, BackHandOutlined } from '@mui/icons-material'
import { Column, Table, AutoSizer } from 'react-virtualized';
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { Container } from '@mui/material'
import Row from '../TestTable/Row'

interface TableNewI extends TableI {
    whichTable?: string
    toLink?: boolean
    style?: any
    view?: any
    onSort?: any
    sortConfigures?: any
}

const SimpTable:FC<TableNewI> = ({ 
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
    onSort,
    sortConfigures
}) => {
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
            return; // Если левая кнопка мыши не нажата, просто выходим из функции
        }
        
        const mx2 = e.pageX - elementScrollRef.current.offsetLeft;
        if (mx) {
          elementScrollRef.current.scrollLeft = sx + mx - mx2;
        }
    };
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
    const [sortedRows, setSortedRows] = useState(rowsArray);

    const [selected, setSelected] = useAtom(selectedInputAtom)
    const [sortConfig, setSortConfig] = useAtom(sortConfigOptionsAtom); 
    
    const [_, setSortFilter] = useAtom(sortFilterAtom)
    const [__, setSortUserFilter] = useAtom(sortUserFilterAtom)
    useEffect(() => {
        if (sortConfigures) {
            let key = sortConfigures.key;
            let direction = sortConfigures.direction;
            let sortedArray = [...rowsArray]; // Создаем копию массива для сортировки
            
            switch (key) {
                case 'from':
                    sortedArray.sort((a, b) => {
                        const aValue = a.columns.find(col => col.accessor === key)?.title || '';
                        const bValue = b.columns.find(col => col.accessor === key)?.title || '';
                        const numericAValue = inet_aton(aValue);
                        const numericBValue = inet_aton(bValue);
                        return direction === 'DESC' ? numericBValue - numericAValue : numericAValue - numericBValue;
                    });
                    break;
                case 'to':
                    sortedArray.sort((a, b) => {
                        const aValue = a.columns.find(col => col.accessor === key)?.title || '';
                        const bValue = b.columns.find(col => col.accessor === key)?.title || '';
                        const numericAValue = inet_aton(aValue);
                        const numericBValue = inet_aton(bValue);
                        return direction === 'DESC' ? numericBValue - numericAValue : numericAValue - numericBValue;
                    });
                    break;
                default:
                    sortedArray.sort((a, b) => {
                        const aValue = String(a.columns.find(col => col.accessor === key)?.title || '');
                        const bValue = String(b.columns.find(col => col.accessor === key)?.title || '');
                        const numericAValue = !isNaN(Number(aValue)) ? Number(aValue) : null;
                        const numericBValue = !isNaN(Number(bValue)) ? Number(bValue) : null;
                        if (numericAValue !== null && numericBValue !== null) {
                            return direction === 'DESC' ? numericBValue - numericAValue : numericAValue - numericBValue;
                        } else {
                            const compareResult = aValue.localeCompare(bValue, undefined, { numeric: true, sensitivity: 'base' });
                            return direction === 'ASC' ? compareResult : -compareResult;
                        }
                    });
                    break;
            }
    
            setSortedRows(sortedArray); // Обновляем состояние отсортированным массивом
        }
    }, [sortConfigures, rowsArray]);

    const handleSelect = () => {
        setSelected((prevState: boolean) => !prevState)
    }
    
    return (
        <div>
            <div 
            id="main-table"
            ref={elementScrollRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp} 
            className={classNames(styles.container, className)}>
                {sortedRows.map((row: any, index:any) => (
                    <Row
                        {...row}
                        view={view}
                        index={index}
                        length={rowsArray.length}
                        dropdownItems={dropdownItems}
                        key={row.id}
                        userId={row.userId}
                        isReserved={row.isReserved}
                        isLoading={isLoading}
                        whichTable={whichTable}
                        selectedAll={selected}
                        required={required}
                        style={style}
                        requiredAction={requiredAction}
                    />
                ))}
            </div>
        </div>
  )
}

export default memo(SimpTable)
