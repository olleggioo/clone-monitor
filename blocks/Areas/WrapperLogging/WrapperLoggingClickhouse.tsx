import { Dashboard } from "@/components"
import { LoggingPollI } from "@/containers/Area"
import { FC, useState } from "react"
import LoggingClickhouseTable from "../LoggingTable/LoggingClickhouseTable"

interface LoggingTableI {
    data: LoggingPollI[]
}

const WrapperLoggingClickhouse: FC<LoggingTableI> = ({
    data
}) => {
    const [filterPage, setFilterPage] = useState(1)

    const handlePageChange = (page: number) => {
        setFilterPage(page);
    }
    console.log("Data clickhouse test", data)
    return <Dashboard title="Logging Clickhouse">
        <LoggingClickhouseTable data={data} page={filterPage} />
    </Dashboard>
}

export default WrapperLoggingClickhouse