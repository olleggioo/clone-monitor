import TestTable from "@/components/Table/TestTable"
import { ModelI, ModelReqI } from "@/containers/Models"
import { FC, useState } from "react"
import { getModelTableData } from "../Devices/helpers"
import { modelsTableHead } from "../Devices/data"
import styles from "./Models.module.scss"
import { DropdownItemI } from "@/ui/Dropdown/Dropdown"
import { IconEdit2, IconTrash } from "@/icons"
import EditModels from "@/modals/Models/EditModels"
import Alert from "@/modals/Areas/Alert"
import { deviceAPI } from "@/api"
import { useSnackbar } from "notistack"
import { modelInfoAtom } from "@/atoms/appDataAtom"
import { useAtom } from "jotai"

const ModelsTable: FC<{rows: ModelI[]}> = ({
    rows
}) => {
    const roleId = localStorage.getItem(`${process.env.API_URL}_role`)
    const tableData = getModelTableData(rows)
    const [models, setModels] = useAtom(modelInfoAtom)
    const [modalEdit, setModalEdit] = useState(false)
    const [modalDelete, setModalDelete] = useState(false)
    const [modelId, setModelId] = useState("")

    const {enqueueSnackbar} = useSnackbar()

    const editModel = (id?: string) => {
        if(id) {
            setModelId(id)
            setModalEdit(true)
        }
    }

    const warnDeleteModel = (id?: string) => {
        if(id) {
            setModelId(id)
            setModalDelete(true)
        }
    }

    const handleDeleteClick = () => {
        if(modelId) {
            deviceAPI
                .deleteModelById(modelId)
                    .then(() => {
                        enqueueSnackbar("Модель успешно удалена", {
                            autoHideDuration: 3000,
                            variant: "success"
                        })
                        deviceAPI.getDeviceModel()
                            .then((res: ModelReqI) => setModels(res))
                            .catch(err => console.error(err))
                    })
                    .catch(error => console.error(error))
        }
    }

    const tableDropDownItems: DropdownItemI[] = [
        {
            text: 'Редактировать',
            icon: <IconEdit2 width={20} height={20} />,
            onClick: editModel
        }
    ]

    // const tableDropDownItems: DropdownItemI[] = [
        // {
        //     text: 'Редактировать',
        //     icon: <IconEdit2 width={20} height={20} />,
        //     onClick: editModel
        // },
        // {
        //     text: 'Удалить',
        //     icon: <IconTrash width={20} height={20} />,
        //     onClick: warnDeleteModel,
        //     mod: 'red'
        // },
    // ]

    if(roleId === process.env.ROLE_ROOT_ID) {
        tableDropDownItems.push({
            text: 'Удалить',
            icon: <IconTrash width={20} height={20} />,
            onClick: warnDeleteModel,
            mod: 'red'
        })
    }

    return (
        <>
            {modalEdit && <EditModels id={modelId} onClose={() => setModalEdit(false)} />}
            {modalDelete && <Alert 
                title={"Удаление модели"} 
                content={"Предупреждение: данное действие удалит связанные аппараты."} 
                open={modalDelete} 
                setOpen={setModalDelete} 
                handleDeleteClick={handleDeleteClick} 
            />}
            <TestTable 
                rows={tableData}
                columns={modelsTableHead}
                dropdownItems={tableDropDownItems}
                // requiredAction={roleId === process.env.ROLE_ROOT_ID ? true : false}
                reqSort={false}
                required={false}
                requiredAction={roleId !== process.env.ROLE_MANAGER_ID ? true : false}
                className={roleId !== process.env.ROLE_MANAGER_ID ? styles.container : styles.containerManager}
            />
        </>
    )
}

export default ModelsTable