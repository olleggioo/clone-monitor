import { deviceAPI } from "@/api"
import { areaRangesIp, deviceUpdateRanges } from "@/atoms/appDataAtom"
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
import { useEffect, useMemo, useState } from "react"
import styles from "./Table.module.scss"
import SimpTable from "@/components/Table/SimpTable"
import { deviceAtom } from "@/atoms"
import SortAction from "@/components/Table/TableHead/Sort"

const AreasTableManager = ({rows, onDeleteDevie}: any) => {
    const [currentRow, setCurrentRow] = useState(rows)
    // const [modalUpdateRanges, setModelUpdateRanges] = useAtom(deviceUpdateRanges)
    const [modalUpdateRanges, setModelUpdateRanges] = useState(false)
    const [alertMessage, setAlertMessage]= useState(false)
    const [currentRange, setCurrentRange] = useState<any>(undefined)
    const [rangesIp, setRangesIp] = useAtom(areaRangesIp)

    useEffect(() => {
        if(rows) {
            setCurrentRow(rows)
        }
    }, [rows])

    const tableData = getAreaTableData(rows)

    // const tableData = useMemo(() => {
    //     return {
    //       columns: areasTableHead,
    //       rows: getAreaTableData(currentRow)
    //     }
    // }, [currentRow, currentRange])

    const handleAlertClick = (id?: string) => {
        setAlertMessage(true)
        if(id) {
            setRangesIp(id)
        }
    }
    const {enqueueSnackbar} = useSnackbar()
    const handleDeleteClick = () => {
        if(rangesIp) {
            deviceAPI.deleteRangeIpById(rangesIp).then(res => {
                setCurrentRow((prevState: any) => prevState.filter((item: any) => item.id !== rangesIp))
                setAlertMessage(false)
                enqueueSnackbar("Диапазон успешно удалён", {
                    variant: "success",
                    autoHideDuration: 3000
                })
            })
        }
    }

    const handleEditClick = (id?: string) => {
        // setCurrentRange(() => rows.find((item: any) => item.id === id))
        // setModelUpdateRanges(true);

        if(id) {
            setRangesIp(id)
            setModelUpdateRanges(true);
        }
    }
    
    const tableDropDownItems: DropdownItemI[] = [
        {
            text: 'Редактировать',
            icon: <IconEdit2 width={20} height={20} />,
            onClick: handleEditClick
        },
    ]

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
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ASC' })

    const handleSort = (key: string) => {
        let direction = 'ASC'
        if (sortConfig.key === key && sortConfig.direction === 'ASC') {
            direction = 'DESC'
        }
        setSortConfig({ key, direction })
    }


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
    } className={styles.dashboard}>
    {modalUpdateRanges && <RangesEditModal state={rangesIp} onClose={() => setModelUpdateRanges(false)} /> }
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

export default AreasTableManager