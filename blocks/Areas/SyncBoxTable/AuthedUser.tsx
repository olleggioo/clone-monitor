import { getAuthedSyncBoxTableData } from "@/blocks/Devices/helpers";
import { Dashboard } from "@/components";
import { AuthedSyncBoxI } from "@/containers/Area";
import { FC } from "react";
import styles from "./SyncBoxTable.module.scss"
import TestTable from "@/components/Table/TestTable";
import { authedSyncBoxTableHead, loggingPollTableHead } from "@/blocks/Devices/data";

interface AuthedUserTableI {
    data: AuthedSyncBoxI[]
}

const AuthedUserTable: FC<AuthedUserTableI> = ({
    data
}) => {
    const tableData = getAuthedSyncBoxTableData(data);

    return <TestTable 
            rows={tableData}
            columns={authedSyncBoxTableHead}
            // dropdownItems={tableDropDownItems}
            required={false}
            reqSort={false}
            requiredAction={false}
            className={styles.authedContainer}
        />
}

export default AuthedUserTable;