import { Dialog } from "@/components";
import { Button, Checkbox, Field } from "@/ui";
import styles from "./Roles.module.scss"
import { FC, useEffect, useState } from "react";
import { userAPI } from "@/api";
import { useSnackbar } from "notistack";

interface EditRoleNameI {
    id: string
    roles: any
    setRoles: any
    onClose: any
}

const EditRoleName: FC<EditRoleNameI> = ({
    id,
    roles,
    setRoles,
    onClose
}) => {
    const [editState, setEditState] = useState({
        name: "",
        isTeam: false
    })
    const [defaultValue, setDefaultValue] = useState<any>(null)
    // const [areas, setAreas] = useAtom(areasAtom)
    useEffect(() => {
        if(id) {
            const findValue = roles.rows.filter((item: any) => item.id === id)[0]
            console.log("f", findValue)
            setEditState({
                name: findValue.name,
                isTeam: findValue.isTeam
            })
            setDefaultValue({
                name: findValue.name,
                isTeam: findValue.isTeam
            })
        }
    }, [id])


    const {enqueueSnackbar} = useSnackbar()

    const handleSubmit = () => {
        const updateData: any = {}
        if(defaultValue.name !== editState.name && editState.name.length > 0) {
            updateData.name = editState.name
        }
        if(defaultValue.isTeam !== editState.isTeam) {
            updateData.isTeam = editState.isTeam
            console.log(defaultValue.isTeam, editState.isTeam)
        }
        updateData.accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
        if(Object.keys(updateData).length > 0) {
            userAPI.updateRoleById(id, updateData)
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
                            enqueueSnackbar("Сохранено", {
                                variant: "success",
                                autoHideDuration: 3000
                            })
                            onClose()
                        })
                        .catch(err => console.error(err))
                })
                .catch(err => {
                    enqueueSnackbar("Произошла ошибка при обновлении роли", {
                        variant: "error",
                        autoHideDuration: 3000
                    })
                    onClose()
                })
        }
        // if(editState.name.length !== 0) {
        // }
    }

    const handleChangeName = (e: any) => {
        setEditState((prevState) => {
            return {
                ...prevState,
                name: e.target.value
            }
        })
    }

    const handleChangeIsTeam = (e: any) => {
        console.log(e.target)
        setEditState((prevState) => {
            return {
                ...prevState,
                isTeam: !prevState.isTeam
            }
        })
    }

    return (
        <Dialog
          title="Редактирование роли"
          onClose={onClose}
          closeBtn
          className={styles.el}
        >
            <Field 
                placeholder="Название роли"
                type="text"
                wrapClassname={styles.field_small}
                onChange={handleChangeName}
                value={editState.name}
            />
            <Checkbox 
                label="В разделе команда"
                name="isTeam"
                isChecked={editState.isTeam}
                onChange={handleChangeIsTeam}
                value=""
                // isDisabled={blockCheckbox}
            />
            <Button 
                  title="Сохранить"
                  onClick={handleSubmit}
              />
        </Dialog>
    )
}

export default EditRoleName;