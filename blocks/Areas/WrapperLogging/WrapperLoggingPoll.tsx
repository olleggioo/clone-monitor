import { FC, useState } from "react"
import { LoggingPollI } from "@/containers/Area"
import { Dashboard, Pagination } from "@/components"
import { INITIAL_PAGE_LIMIT_AREA } from "./WrapperLoggingMap"
import LoggingPollTable from "../LoggingTable/LoggingPollTable"
import { useAtom } from "jotai"
import { atomPagePoll } from "@/atoms/statsAtom"

interface LoggingTableI {
    data: {
        rows: LoggingPollI[]
        total: number
    }
}
// const INITIAL_PAGE_LIMIT = 100

const WrapperLoggingPoll: FC<LoggingTableI> = ({
    data
}) => {
    const [filterPage, setFilterPage] = useAtom(atomPagePoll)

    const handlePageChange = (page: number) => {
        setFilterPage(page);
    }

    return <Dashboard title="Logging Poll">
        {data && data.rows && data.rows.length > 0 && <LoggingPollTable data={data.rows} page={filterPage} />}
        {data && data.total && <Pagination 
            onPageChange={handlePageChange}
            limit={INITIAL_PAGE_LIMIT_AREA}
            offset={INITIAL_PAGE_LIMIT_AREA * (filterPage - 1)}
            total_count={data.total}
        />}
    </Dashboard>
}

export default WrapperLoggingPoll