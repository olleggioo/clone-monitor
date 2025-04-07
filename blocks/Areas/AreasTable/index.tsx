import { deviceAPI } from "@/api"
import { areaRangesIp, areasAtom, deviceUpdateRanges } from "@/atoms/appDataAtom"
import { areasTableHead } from "@/blocks/Devices/data"
import { getAreaTableData, getLogTableData } from "@/blocks/Devices/helpers"
import { Dashboard, Table } from "@/components"
import TestTable from "@/components/Table/TestTable"
import { IconEdit2, IconTrash } from "@/icons"
import RangesEditModal from "@/modals/Areas"
import Alert from "@/modals/Areas/Alert"
import { DropdownItemI } from "@/ui/Dropdown/Dropdown"
import { useAtom } from "jotai"
import { useSnackbar } from "notistack"
import { memo, useEffect, useMemo, useState } from "react"
import styles from "./Table.module.scss"
import getEnergyUnit from "@/helpers/getEnergyUnit"
import moment from "moment"
import SimpTable from "@/components/Table/SimpTable"
import { deviceAtom } from "@/atoms"
import { inet_aton } from "@/util/iten_atom"
import SortAction from "@/components/Table/TableHead/Sort"
import { hasAccess } from "@/helpers/AccessControl"
import { requestsAccessMap } from "@/helpers/componentAccessMap"
import { emptyValues } from "@/containers/Areas"

const AreasTable = ({rows, onDeleteDevie}: any) => {
    const [currentRow, setCurrentRow] = useState(rows)
    // const [modalUpdateRanges, setModelUpdateRanges] = useAtom(deviceUpdateRanges)
    const [modalUpdateRanges, setModelUpdateRanges] = useState(false)

    const [alertMessage, setAlertMessage]= useState(false)
    const [rangesIp, setRangesIp] = useAtom(areaRangesIp)
    const [areas, setAreas] = useAtom(areasAtom)
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ASC' })
    

    useEffect(() => {
        if(rows) {
            setCurrentRow(rows)
        }
    }, [])

    const tableData = getAreaTableData(rows)


    // const tableData = useMemo(() => {
    //     return {
    //       columns: areasTableHead,
    //       rows: getAreaTableData(currentRow)
    //     }
    // }, [currentRow])

    const handleAlertClick = (id?: string) => {
        setAlertMessage(true)
        if(id) {
            setRangesIp(id)
        }
    }
    const {enqueueSnackbar} = useSnackbar()

    const dateFrom = {
        day: moment().startOf('day').format('YYYY-MM-DD HH:mm'),
        week: moment().subtract(1, 'week').format('YYYY-MM-DD HH:mm'),
        month: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm')
      }
    
    const dateNow = moment().format('YYYY-MM-DD HH:mm')

    const handleDeleteClick = () => {
        if(rangesIp) {
            deviceAPI.deleteRangeIpById(rangesIp)
                .then(res => {
                    // setCurrentRow((prevState: any) => prevState.filter((item: any) => item.id !== rangesIp))
                    deviceAPI.getDevicesArea({
                        relations: {
                            rangeips: true
                        },
                    }).then((anRes) => {
                        const emptyUpdates = anRes.rows.map((area, index) => {
                            return {
                                ...area,
                                ...emptyValues
                            };
                        })
                        console.log("emptyUpdates", emptyUpdates)
                        setAreas(emptyUpdates)
                        return anRes;
                    })
                    .then((res: any) => {
                        if(hasAccess(requestsAccessMap.getDevicesStatus)) {
                            deviceAPI.getDevicesStatus({
                                where: {
                                    id: `$Not($In(["1eda7201-913e-11ef-8367-bc2411b3fd76"]))`
                                }
                            })
                                .then((statusess) => {
                    
                                    const promisesEnergy = res.rows.map((item: any) => {
                                        return deviceAPI.getDevicesEnergySumDay({
                                            where: {
                                                createdAt: `$Between([\"${dateFrom.day}\",\"${dateNow}\"])`,
                                                areaId: item.id
                                            },
                                        })
                                    })
                    
                                    const promises = res.rows.map((item: any) => {
                                        return Promise.all(statusess.rows.map((row: any) => {
                                            return deviceAPI.getDevicesStatusCount({
                                                where: { statusId: row.id, areaId: item.id }
                                            }).then(count => ({ statusId: row.id, count: count.total }))
                                        }))
                                    })
                    
                                    Promise.all([...promises, ...promisesEnergy]) // Объединяем все массивы промисов
                                        .then((resPromise: any) => {
                                            const statuses = resPromise.slice(0, res.rows.length);
                                            console.log("statuses", statuses, resPromise)
                                            const oldStatuses = {
                                                ...statusess.rows,
                                                statuses
                                            }
                                            const energy = resPromise.slice(res.rows.length, res.rows.length * 2);
                                            // const energy = resPromise.slice(res.rows.length * 2); // Последний сегмент относится к promisesEnergy
                                            const updatedAreas = res.rows.map((area: any, index: number) => {
                                                const statusOrder = {
                                                    isNormal: 0,
                                                    isWarning: 0,
                                                    isRepair: 0,
                                                    isNotOnline: 0,
                                                    isError: 0,
                                                    // isArchived: 0
                                                };
                                                statuses[index].forEach((status: any) => {
                                                    switch (status.statusId) {
                                                        case '82cddea0-861f-11ee-932b-300505de684f':
                                                            statusOrder.isNormal = status.count;
                                                            break;
                                                        case '82cde049-861f-11ee-932b-300505de684f':
                                                            statusOrder.isWarning = status.count;
                                                            break;
                                                        case '9a8471f1-861f-11ee-932b-300505de684f':
                                                            statusOrder.isNotOnline = status.count;
                                                            break;
                                                        case '9a847375-861f-11ee-932b-300505de684f':
                                                            statusOrder.isError = status.count;
                                                            break;
                                                        // case '1eda7201-913e-11ef-8367-bc2411b3fd76':
                                                        //     statusOrder.isArchived = status.count;
                                                        //     break;
                                                        case 'dc434af8-8f45-11ef-8367-bc2411b3fd76':
                                                            statusOrder.isRepair = status.count;
                                                            break;
                                                        default:
                                                            break;
                                                    }
                                                })
                    
                                                const sumEnergy = energy[index].reduce((prev: any, curr: any) => prev + Number(curr.value), 0) || 0
                                                return {
                                                    ...area,
                                                    ...statusOrder,
                                                    uptime: "0",
                                                    energy: getEnergyUnit(sumEnergy)
                                                };
                                            });
                                            console.log("TEST TEST TEST TEST TEST")
                                            setAreas(updatedAreas);
                                        })
                                        .catch(err => console.error(err))
                                })
                                .catch(err => console.error(err))
                        }
                    }).catch(err => console.error(err)).catch(err => console.error("ERRRPR", err))
                })
                .catch(err => console.error(err))
        }
    }

    const handleEditClick = (id?: string) => {
        if(id) {
            setRangesIp(id)
            setModelUpdateRanges(true);
        }
    }
    
    const tableDropDownItems: DropdownItemI[] = [
    ]

    if(hasAccess(requestsAccessMap.updateOneRangesIp)) {
        tableDropDownItems.push({
            text: 'Редактировать',
            icon: <IconEdit2 width={20} height={20} />,
            onClick: handleEditClick
        })
    }

    if(hasAccess(requestsAccessMap.deleteRangeIpById)) {
        tableDropDownItems.push({
            text: 'Удалить',
            icon: <IconTrash width={20} height={20} />,
            onClick: handleAlertClick,
            mod: 'red'
        })
    }

      const handleSort = (key: string) => {
        let direction = 'ASC'
        if (sortConfig.key === key && sortConfig.direction === 'ASC') {
            direction = 'DESC'
        }
        setSortConfig({ key, direction })
    }

    const [device] = useAtom(deviceAtom)

    const columnHead = [
        {
            accessor: "from",
            title: "Диапазон от"
        },
        {
            accessor: "to",
            title: "Диапазон до"
        },
        {
            accessor: "name",
            title: "Имя"
        },
    ]

    return <Dashboard
    headerTable={
    <div className={styles.headingTable}>
        {device !== "mobile" && columnHead.map((item) => {
            const isSortingColumn = sortConfig && sortConfig.key === item.accessor;
            const sortDirection = sortConfig && sortConfig.direction;
            return <div className={styles.flexHead}>
                {isSortingColumn && <SortAction isSort={isSortingColumn} direction={sortDirection} />}
                <span key={item.accessor} className={styles.headingColum} onClick={() => handleSort(item.accessor)}>{item.title}</span>
            </div>
        })}
    </div>
    } 
    className={styles.dashboard}>
    {modalUpdateRanges && <RangesEditModal itModal state={rangesIp} onClose={() => setModelUpdateRanges(false)} /> }
    {alertMessage && 
        <Alert 
            title={"Удаление IP-диапазона"} 
            content={"Предупреждение: данное действие удалит связанные аппараты."} 
            open={alertMessage} 
            setOpen={setAlertMessage} 
            handleDeleteClick={handleDeleteClick} 
        />
    }
        {device !== "mobile" ? <SimpTable 
            rows={tableData}
            columns={areasTableHead}
            dropdownItems={tableDropDownItems}
            required={false}
            reqSort={true}
            className={styles.container}
            onSort={handleSort}
            sortConfigures={sortConfig}
        /> : <TestTable 
            rows={tableData}
            columns={areasTableHead}
            dropdownItems={tableDropDownItems}
            required={false}
            reqSort={true}
            className={styles.container}
        />}
    </Dashboard>
}

export default memo(AreasTable)