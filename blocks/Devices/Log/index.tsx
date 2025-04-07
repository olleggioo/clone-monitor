import { FC, memo, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { usersAtom } from "@/atoms";
import { Pagination } from "@/components";
import { getLogTableData } from "../helpers";
import { logTableHead } from "../data";
import TestTable from "@/components/Table/TestTable";
import styles from "./Table.module.scss"
import { logListAPI } from "@/api";
import Load from "@/components/Load";
import { isEqual } from "lodash";
import SimpTable from "@/components/Table/SimpTable";
import StateTable from "@/components/Table/TestTable/StateTable";

const INITIAL_PAGE_LIMIT = 50

const Log: FC<{id: any, listLog: any}> = ({
    id,
    listLog
}) => {

    const [log, setLog] = useState<any>()
    const [userList, setUserList] = useAtom(usersAtom)
    const [filterPage, setFilterPage] = useState(1)
    const [rows, setRows] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const newRows = getLogTableData(filterPage, userList, listLog.rows)
    // console.log("")
    // useEffect(() => {
    //     if (log) {
    //         if(!isEqual(rows, newRows)) {
    //             setRows(newRows);
    //         }
    //     }
    // }, [log, filterPage, userList])

    const handlePageChange = (page: number) => {
        setFilterPage(page);
    }
    return <>{loading && rows.length === 0
        ? <Load /> 
        : <div className={styles.box}>
        <StateTable 
            columns={logTableHead}
            rows={newRows}
            required={false}
            className={styles.container}
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

export default memo(Log)