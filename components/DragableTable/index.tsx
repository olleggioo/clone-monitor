import { FC, useMemo, useRef, useState } from "react";
import Head from "./Head";
import { useSnackbar } from "notistack";
import { TableCellI, TableI } from "../Table/Table";
import { useAtom } from "jotai";
import { selectedInputAtom, sortFilterAtom, sortUserFilterAtom } from "@/atoms/appDataAtom";

const DragableTable:FC<TableI> = ({ columns, rows, dropdownItems, isLoading, required = true, className, requiredAction = true }) => {
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
    
    const [selected, setSelected] = useAtom(selectedInputAtom)
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
            case 'model':
                orders.model = {
                    name: direction
                }
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
    const containerRef = useRef<HTMLDivElement>(null);

    const scrollToEnd = () => {
        if (containerRef.current) {
        const container = containerRef.current;
        container.scrollTo({
            left: container.scrollWidth - container.clientWidth,
            behavior: "smooth"
        });
        }
    };
    const scrollToStart = () => {
        if (containerRef.current) {
          const container = containerRef.current;
          container.scrollTo({
            left: 0,
            behavior: "smooth"
          });
        }
    };

    return (
      <div
        
        ref={elementScrollRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
         <table className="table">
      <Head 
        items={columns} hasDropDown={!!dropdownItems?.length} requiredAction={requiredAction} required={required} onSort={sortRows} selected={selected} setSelected={handleSelect}
      />
      <tbody>
        {/* <tr>
          <th scope="row">1</th>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
        </tr>
        <tr>
          <th scope="row">2</th>
          <td>Jacob</td>
          <td>Thornton</td>
          <td>@fat</td>
        </tr>
        <tr>
          <th scope="row">3</th>
          <td>Larry</td>
          <td>the Bird</td>
          <td>@twitter</td>
        </tr> */}
      </tbody>
      </table>
      </div>
    );
  };
  
  export default DragableTable;