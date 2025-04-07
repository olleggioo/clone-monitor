import { Dashboard } from "@/components"
import { LoggingPollI } from "@/containers/Area"
import { FC, useState } from "react"
import LoggingWorkerTable from "../LoggingTable/LoggingWorkerTable"

interface LoggingTableI {
    data: LoggingPollI[]
}

const WrapperLoggingWorker: FC<LoggingTableI> = ({
    data
}) => {
    const [filterPage, setFilterPage] = useState(1)
    
    const handlePageChange = (page: number) => {
        setFilterPage(page);
    }
    return <Dashboard title="Logging Worker">
        <LoggingWorkerTable data={data} page={filterPage} />
    </Dashboard>
}

export default WrapperLoggingWorker