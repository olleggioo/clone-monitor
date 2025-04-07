import { FC, memo, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { usersAtom } from "@/atoms";
import { Pagination } from "@/components";
import { getLogByUserTableData, getLogTableData } from "../helpers";
import { logByUserTableHead, logTableHead } from "../data";
import TestTable from "@/components/Table/TestTable";
import styles from "./Table.module.scss"
import { logListAPI } from "@/api";
import Load from "@/components/Load";
import { isEqual } from "lodash";
import SimpTable from "@/components/Table/SimpTable";
import StateTable from "@/components/Table/TestTable/StateTable";

const INITIAL_PAGE_LIMIT = 50

const LogByUser: FC<{id: any, listLog: any}> = ({
    id,
    listLog
}) => {

    const [log, setLog] = useState<any>()
    const [userList, setUserList] = useAtom(usersAtom)
    const [filterPage, setFilterPage] = useState(1)
    const [rows, setRows] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const newRows = getLogByUserTableData(filterPage, listLog.rows)

    const handlePageChange = (page: number) => {
        setFilterPage(page);
    }

    return <>{loading && rows.length === 0
        ? <Load /> 
        : <div className={styles.box}>
        <StateTable 
            columns={logByUserTableHead}
            rows={newRows}
            required={false}
            className={styles.containerByUser}
            requiredAction={false}
            // dropdownItems={tableDropDownItems}
            // isLoading={isLoading}
        />
        {/* <Pagination 
                        onPageChange={handlePageChange}
                        limit={INITIAL_PAGE_LIMIT}
                        offset={INITIAL_PAGE_LIMIT * (filterPage - 1)}
                        total_count={logList.length}
                    /> */}
        {log && log.length > INITIAL_PAGE_LIMIT && <Pagination 
            onPageChange={handlePageChange}
            limit={INITIAL_PAGE_LIMIT}
            offset={INITIAL_PAGE_LIMIT * (filterPage - 1)}
            total_count={log.length}
        />}
    </div>     
    }</>
}

export default memo(LogByUser)