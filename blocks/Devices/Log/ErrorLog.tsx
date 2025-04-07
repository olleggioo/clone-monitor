import { Dashboard } from "@/components";
import { FC } from "react";
import { getDevicesTableData, getLogErrorTableData, getLogTableData } from "../helpers";
import { logErrorTableHead, logTableHead } from "../data";
import Table from "@/components/Table/CopyTable";
import TestTable from "@/components/Table/TestTable";
import styles from "./Table.module.scss"
import { usersAtom } from "@/atoms";
import { useAtom } from "jotai";

const ErrorLog: FC<{listLog: any}> = ({listLog}) => {
    const rows = getLogErrorTableData(listLog)
    return <TestTable 
            columns={logErrorTableHead}
            rows={rows}
            required={false}
            className={styles.logContainer}
            requiredAction={false}
            // dropdownItems={tableDropDownItems}
            // isLoading={isLoading}
        />
    {/* </Dashboard> */}
}

export default ErrorLog