import { Dialog } from "@/components";
import styles from "./Roles.module.scss"
import { Button, Checkbox, Field } from "@/ui";
import { useState } from "react";
import { deviceAPI, userAPI } from "@/api";
import { useSnackbar } from "notistack";

const CreateRole = ({
    setRoles,
    onClose
}: any) => {
    const {enqueueSnackbar} = useSnackbar()
    const [roleName, setRoleName] = useState({
        name: "",
        isTeam: false
    })

    const handleSubmit = () => {
        if(roleName.name.length !== 0) {
            userAPI.createRole({
                name: roleName.name,
                isTeam: roleName.isTeam,
            })
                .then((res) => {
                    deviceAPI.createRoleAccess({
                        roleId: res.id,
                        accessId: "277ffc4c-c70d-40f8-8c66-dff6ad692fda"
                    }).then((resAcs) => {
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
                                onClose()
                                enqueueSnackbar("Роль успешно создана", {
                                    variant: "success",
                                    autoHideDuration: 3000
                                })
                            })
                            .catch(err => console.error(err))
                        // setTimeout(() => {
                        //     window.location.reload()
                        // }, 1000)
                    }).catch(err => console.error())
                })
                .catch(err => {
                    enqueueSnackbar("Прозишла ошибка при создании роли", {
                        variant: "error",
                        autoHideDuration: 3000
                    })
                })
        }
    }

    const handleChangeName = (e: any) => {
        setRoleName((prevState) => {
            return {
                ...prevState,
                name: e.target.value
            }
        })
    }

    const handleChangeIsTeam = (e: any) => {
        setRoleName((prevState) => {
            return {
                ...prevState,
                isTeam: !prevState.isTeam
            }
        })
    }

    return (
        <Dialog
          title="Создание роли"
          onClose={onClose}
          closeBtn
          className={styles.el}
        >
            <Field 
                placeholder="Название роли"
                type="text"
                wrapClassname={styles.field_small}
                onChange={handleChangeName}
                value={roleName.name}
            />
            <Checkbox 
                label="В разделе команда"
                name="isTeam"
                isChecked={roleName.isTeam}
                onChange={handleChangeIsTeam}
                value=""
                // isDisabled={blockCheckbox}
            />
            <Button 
                title="Создать"
                onClick={handleSubmit}
            />
        </Dialog>
      )
}

export default CreateRole;