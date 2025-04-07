import { filesystemSyncBoxTableHead } from "@/blocks/Devices/data"
import { Dashboard } from "@/components"
import { FilesystemSyncBoxI } from "@/containers/Area"
import { FC } from "react"
import styles from "./SyncBoxTable.module.scss"
import TestTable from "@/components/Table/TestTable"
import { getFilesystemSyncBoxTableData } from "@/blocks/Devices/helpers"

interface FilesystemTableI {
    data: FilesystemSyncBoxI[]
}

const FilesystemTable: FC<FilesystemTableI> = ({
    data
}) => {
    const tableData = getFilesystemSyncBoxTableData(data)
    return <TestTable 
            rows={tableData}
            columns={filesystemSyncBoxTableHead}
            // dropdownItems={tableDropDownItems}
            required={false}
            reqSort={false}
            requiredAction={false}
            className={styles.filesystemContainer}
        />
}

export default FilesystemTable