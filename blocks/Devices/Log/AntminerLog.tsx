import { Dashboard } from "@/components";
import { FC } from "react";
import { getDevicesTableData, getLogAntminerData, getLogErrorTableData, getLogTableData } from "../helpers";
import { logAntminerTableHead, logErrorTableHead, logTableHead } from "../data";
import Table from "@/components/Table/CopyTable";
import TestTable from "@/components/Table/TestTable";
import styles from "./Table.module.scss"
import { usersAtom } from "@/atoms";
import { useAtom } from "jotai";

const AntminerLog: FC<{page: number, listLog: any}> = ({page, listLog}) => {
    const rows = getLogAntminerData(page, listLog)
    return <TestTable 
            columns={logAntminerTableHead}
            rows={rows}
            required={false}
            className={styles.antminerLog}
            requiredAction={false}
            // dropdownItems={tableDropDownItems}
            // isLoading={isLoading}
        />
    {/* </Dashboard> */}
}

export default AntminerLog