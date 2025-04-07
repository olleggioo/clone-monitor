import { Dashboard, Table } from "@/components"
import { poolTableHead } from "../data"
import { getPoolTableData } from "../helpers"
import { FC, useEffect, useState } from "react"
import { DevicePoolI, PoolI } from "@/interfaces"
import TestTable from "@/components/Table/TestTable"
import styles from "./Pool.module.scss"
import { get, isEqual } from "lodash"

const Pools: FC<{ data: DevicePoolI[]}> = ({
    data
}) => {
    const tableData = getPoolTableData(data)

    return <Dashboard title="Пулы устройства">
        {/* <Table
            columns={poolTableHead}
            rows={getPoolTableData(data)}
        /> */}
        <TestTable 
            columns={poolTableHead}
            rows={tableData}
            required={false}
            className={styles.container}
            requiredAction={false}
        />
    </Dashboard>
}

export default Pools