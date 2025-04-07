import { Dashboard } from "@/components"
import styles from "./LoggingTable.module.scss"
import TestTable from "@/components/Table/TestTable"
import { areasTableHead, loggingPollTableHead } from "@/blocks/Devices/data"
import { FC } from "react"
import { LoggingPollI } from "@/containers/Area"
import { getLoggingTableData } from "@/blocks/Devices/helpers"

interface LoggingTableI {
    data: LoggingPollI[]
    page: number
}

const LoggingMapTable: FC<LoggingTableI> = ({
    data,
    page
}) => {
    const tableData = getLoggingTableData(data, page)
    console.log("tableData", tableData)
    return <TestTable 
        rows={tableData}
        columns={loggingPollTableHead}
        // dropdownItems={tableDropDownItems}
        required={false}
        reqSort={false}
        requiredAction={false}
        className={styles.container_loggingMap}
    />
}

export default LoggingMapTable