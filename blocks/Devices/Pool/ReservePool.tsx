import { Dashboard, Table } from "@/components"
import { poolReserveTableHead, poolTableHead } from "../data"
import { getPoolReserveTableData, getPoolTableData } from "../helpers"
import { FC, useEffect, useState } from "react"
import { DevicePoolI, PoolI } from "@/interfaces"
import TestTable from "@/components/Table/TestTable"
import styles from "./Pool.module.scss"
import { get, isEqual } from "lodash"

const ReservePool: FC<{ data: DevicePoolI[]}> = ({
    data
}) => {
    const sortedData = data.sort((a: any, b: any) => a.pool.index - b.pool.index);
    const tableData = getPoolReserveTableData(sortedData)

    return <div>
        <TestTable 
            columns={poolReserveTableHead}
            rows={tableData}
            required={false}
            className={styles.reserveContainer}
            requiredAction={false}
        />
    </div>
}

export default ReservePool