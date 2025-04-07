import { Dashboard } from "@/components"
import styles from "./LoggingTable.module.scss"
import TestTable from "@/components/Table/TestTable"
import { areasTableHead, loggingPollTableHead } from "@/blocks/Devices/data"
import { FC } from "react"
import { LoggingPollI } from "@/containers/Area"
import { getLoggingTableData } from "@/blocks/Devices/helpers"

const INITIAL_PAGE_LIMIT = 100

interface LoggingTableI {
    data: LoggingPollI[]
    page: number
}

const LoggingPollTable: FC<LoggingTableI> = ({
    data,
    page
}) => {
    const tableData = getLoggingTableData(data, page)
    return <TestTable 
        rows={tableData}
        columns={loggingPollTableHead}
        // dropdownItems={tableDropDownItems}
        required={false}
        reqSort={false}
        requiredAction={false}
        className={styles.container_loggingPoll}
    />
}

export default LoggingPollTable