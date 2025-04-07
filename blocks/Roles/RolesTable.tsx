import { accessIdAtom, RoleAccessesStateI } from "@/atoms/appDataAtom";
import { Dashboard } from "@/components";
import TestTable from "@/components/Table/TestTable";
import { FC, useState } from "react";
import { getAreaTableData, getRoleAccessTableData } from "../Devices/helpers";
import { accessesTableHead } from "../Devices/data";
import styles from "./RolesTable.module.scss"
import { DropdownItemI } from "@/ui/Dropdown/Dropdown";
import { IconEdit2, IconTrash } from "@/icons";
import { useAtom } from "jotai";
import Alert from "@/modals/Areas/Alert";
import { deviceAPI } from "@/api";
import { useSnackbar } from "notistack";

interface RolesTableI {
    rows: RoleAccessesStateI[]
}

const RolesTable: FC<RolesTableI> = ({
    rows
}) => {
    const {enqueueSnackbar} = useSnackbar()

    const tableData = getRoleAccessTableData(rows)

    const [alertMessage, setAlertMessage]= useState(false)
    const [accessId, setAccessId] = useAtom(accessIdAtom)

    const handleAlertClick = (id?: string) => {
        setAlertMessage(true)
        if(id) {
            setAccessId(id)
        }
    }

    const deleteRoleAccess = () => {
        if(accessId) {
            deviceAPI.deleteRoleAccessById(accessId)
                .then((res) => {
                    enqueueSnackbar("Доступ успешно удалён", {
                        variant: "success",
                        autoHideDuration: 3000
                    })
                })

                .catch(err => {
                    setAlertMessage(false)
                    enqueueSnackbar("Прозишла ошибка при удалении доступа роли", {
                        variant: "error",
                        autoHideDuration: 3000
                    })
                })
        }
    }

    const tableDropDownItems: DropdownItemI[] = [
        {
            text: 'Удалить',
            icon: <IconTrash width={20} height={20} />,
            onClick: handleAlertClick,
            mod: 'red'
        }
    ]

    return <Dashboard>
        {alertMessage && 
            <Alert 
                title={"Удаление доступа для роли"} 
                content={""} 
                open={alertMessage} 
                setOpen={setAlertMessage} 
                handleDeleteClick={deleteRoleAccess} 
            />
        }
        <TestTable 
            rows={tableData}
            columns={accessesTableHead}
            dropdownItems={tableDropDownItems}
            required={false}
            reqSort={true}
            className={styles.container}
        />
    </Dashboard>
}

export default RolesTable;