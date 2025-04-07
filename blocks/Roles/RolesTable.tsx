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
import { deviceAPI, userAPI } from "@/api";
import { useSnackbar } from "notistack";
import UpdateAccess from "@/modals/Roles/UpdateAccess";

interface RolesTableI {
    rows: RoleAccessesStateI[]
    setRoles: any
}

const RolesTable: FC<RolesTableI> = ({
    rows,
    setRoles
}) => {
    const {enqueueSnackbar} = useSnackbar()

    const tableData = getRoleAccessTableData(rows)

    const [alertMessage, setAlertMessage]= useState(false)
    const [accessId, setAccessId] = useAtom(accessIdAtom)
    const [rowId, setRowId] = useState("")
    const [editAccessFlag, setEditAccessFlag] = useState(false)

    const handleAlertClick = (id?: string) => {
        setAlertMessage(true)
        if(id) {
            setAccessId(id)
            setEditAccessFlag(true)
        }
    }

    const deleteRoleAccess = () => {
        if(accessId) {
            deviceAPI.deleteRoleAccessById(accessId)
                .then((res) => {
                    
                    userAPI.getUsersRole({
                        where: {
                            id: `$Not($In(["${process.env.ROLE_ROOT_ID}", "${process.env.ROLE_BOX_ID}"]))`
                        },
                        relations: {
                            roleAccesses: {
                                access: true
                            }
                        }
                    })
                        .then((res) => {
                            setRoles(res)
                            enqueueSnackbar("Доступ успешно удалён", {
                                variant: "success",
                                autoHideDuration: 3000
                            })
                        })
                        .catch(err => console.error(err))
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

    const handleEditAccess = (accessId?: string) => {
        if(accessId) {
            setRowId(accessId)
            setEditAccessFlag(true)
        }
    }

    const tableDropDownItems: DropdownItemI[] = [
        {
            text: "Редактировать доступ",
            icon: <IconEdit2 width={20} height={20} />,
            onClick: handleEditAccess
        },
        {
            text: 'Удалить',
            icon: <IconTrash width={20} height={20} />,
            onClick: handleAlertClick,
            mod: 'red'
        }
    ]

    const onCloseUpdateModal = () => {
        setRowId("")
        setEditAccessFlag(false)
    }

    return <Dashboard>
        {editAccessFlag && rowId && rowId.length !== 0 && <UpdateAccess 
            state={rowId}
            onClose={onCloseUpdateModal}
            setRoles={setRoles}
        />}
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