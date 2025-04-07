import { Dialog } from "@/components";
import styles from "./Roles.module.scss"
import { Button, Field } from "@/ui";
import { useState } from "react";
import { deviceAPI, userAPI } from "@/api";
import { useSnackbar } from "notistack";

const CreateRole = ({
    setRoles,
    onClose
}: any) => {
    const {enqueueSnackbar} = useSnackbar()
    const [roleName, setRoleName] = useState("")

    const handleSubmit = () => {
        if(roleName.length !== 0) {
            userAPI.createRole({
                name: roleName
            })
                .then((res) => {
                    console.log("RES create role", res)
                    deviceAPI.createRoleAccess({
                        roleId: res.id,
                        accessId: "277ffc4c-c70d-40f8-8c66-dff6ad692fda"
                    }).then((resAcs) => {
                        userAPI.getUsersRole({
                            where: {
                                id: `$Not($In(["${process.env.ROLE_ROOT_ID}"]))`
                            },
                            relations: {
                                roleAccesses: {
                                    access: true
                                }
                            }
                        })
                            .then((res) => {
                                console.log("RES", res)
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
                  onChange={(e) => setRoleName(e.target.value)}
                  value={roleName}
              />
              <Button 
                  title="Создать"
                  onClick={handleSubmit}
              />
        </Dialog>
      )
}

export default CreateRole;