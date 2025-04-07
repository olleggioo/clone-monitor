import TestTable from "@/components/Table/TestTable"
import { getCommentTableData } from "../helpers"
import { commentsTableHead } from "../data"
import styles from "./Comment.module.scss"
import { DropdownItemI } from "@/ui/Dropdown/Dropdown"
import { IconTrash } from "@/icons"
import { useState } from "react"
import Alert from "@/modals/Areas/Alert"
import { deviceAPI } from "@/api"
import { useAtom } from "jotai"
import { atomDataDevice } from "@/atoms/statsAtom"
import TableNew from "@/components/Table/TableNew"
import { hasAccess } from "@/helpers/AccessControl"
import { requestsAccessMap } from "@/helpers/componentAccessMap"

const CommentTable = ({rows}: any) => {
    const [modalDelete, setModalDelete] = useState(false)
    const [commentId, setCommentId] = useState("")
    const [row, setRows] = useState(rows)
    const tableData = getCommentTableData(rows)
    const [data, setData] = useAtom(atomDataDevice)


    const alertDeleteMessage = (id?: string) => {
        if(id) {
            setModalDelete(true)
            setCommentId(id)
        }
    }

    const handleDeleteClick = (id?: string) => {
        if(id) {
            deviceAPI.deleteComment(id)
                .then((res) => {
                    deviceAPI.getComments({
                        where: {
                            deviceId: id
                        },
                        order: {
                            createdAt: "DESC"
                        }
                    }).then((res) => {
                        setData((prevState: any) => {
                            return {
                                ...prevState,
                                deviceComments: res.rows
                            }
                        })
                    }).catch(err => console.error(err))
                })
                    
                .catch(err => console.error(err))
        }
    }

    const tableDropDownItems: DropdownItemI[] = []

    if(hasAccess(requestsAccessMap.deleteComment)) {
        tableDropDownItems.push({
            text: 'Удалить',
            icon: <IconTrash width={20} height={20} />,
            onClick: handleDeleteClick,
            mod: "red"
        })
    }

    return <>
        {modalDelete && <Alert 
            title={"Удаление комментарий"} 
            content={"Вы уверены что хотите удалить комментарий?"} 
            open={modalDelete} 
            setOpen={setModalDelete} 
            handleDeleteClick={handleDeleteClick} 
        />}
        <TableNew 
            rows={tableData}
            columns={commentsTableHead}
            required={false}
            reqSort={false}
            dropdownItems={tableDropDownItems.length > 0 ? tableDropDownItems : undefined}
            // requiredAction={false}
            className={styles.container}
            whichTable="comments"
        />
    </>
}

export default CommentTable