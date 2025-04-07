import { Dashboard } from "@/components";
import { FC } from "react";
import { getDevicesTableData, getLogTableData, getLogUserTableData } from "../helpers";
import { logTableHead, logUserTableHead } from "../data";
import Table from "@/components/Table/CopyTable";
import TestTable from "@/components/Table/TestTable";
import styles from "./Table.module.scss"
import { usersAtom } from "@/atoms";
import { useAtom } from "jotai";

const UserLog: FC<{page: number, listLog: any}> = ({page, listLog}) => {
    const rows = getLogUserTableData(page, listLog)
    return <TestTable 
            columns={logUserTableHead}
            rows={rows}
            required={false}
            className={styles.containerUser}
            requiredAction={false}
            // dropdownItems={tableDropDownItems}
            // isLoading={isLoading}
        />
    {/* </Dashboard> */}
}

export default UserLog