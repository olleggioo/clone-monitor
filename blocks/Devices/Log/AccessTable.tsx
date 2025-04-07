import { Dashboard } from "@/components";
import { FC } from "react";
import { getAccessTableData, getDevicesTableData, getLogAntminerData, getLogErrorTableData, getLogTableData } from "../helpers";
import { accessTableHead, logAntminerTableHead, logErrorTableHead, logTableHead } from "../data";
import Table from "@/components/Table/CopyTable";
import TestTable from "@/components/Table/TestTable";
import styles from "./Table.module.scss"
import { usersAtom } from "@/atoms";
import { useAtom } from "jotai";

const AccessTable: FC<{data: any}> = ({data}) => {
    const rows = getAccessTableData(data)
    return <TestTable 
            columns={accessTableHead}
            rows={rows}
            required={false}
            className={styles.antminerLog}
            requiredAction={false}
            // dropdownItems={tableDropDownItems}
            // isLoading={isLoading}
        />
    {/* </Dashboard> */}
}

export default AccessTable