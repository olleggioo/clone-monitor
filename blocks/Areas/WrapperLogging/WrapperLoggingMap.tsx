import { FC, useState } from "react"
import { LoggingPollI } from "@/containers/Area"
import { Dashboard, Pagination } from "@/components"
import LoggingMapTable from "../LoggingTable/LoggingMapTable"
import { useAtom } from "jotai"
import { atomDataDevice, atomPageMap } from "@/atoms/statsAtom"

interface LoggingTableI {
    data: {
        rows: LoggingPollI[]
        total: number
    }
}
export const INITIAL_PAGE_LIMIT_AREA = 100

const WrapperLoggingMap: FC<LoggingTableI> = ({
    data
}) => {
    const [filterPage, setFilterPage] = useAtom(atomPageMap)

    const handlePageChange = (page: number) => {
        setFilterPage(page);
    }

    return <Dashboard title="Logging Map">
        {data && data.rows && data.rows.length > 0 && <LoggingMapTable data={data.rows} page={filterPage} />}
        {data && data.total && <Pagination 
            onPageChange={handlePageChange}
            limit={INITIAL_PAGE_LIMIT_AREA}
            offset={INITIAL_PAGE_LIMIT_AREA * (filterPage - 1)}
            total_count={data.total}
        />}
    </Dashboard>
}

export default WrapperLoggingMap