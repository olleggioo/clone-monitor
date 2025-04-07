import { Dialog } from "@/components";
import { FC, useEffect, useState } from "react";
import styles from "./Roles.module.scss"
import { Button, Field } from "@/ui";
import { deviceAPI, userAPI } from "@/api";
import { useSnackbar } from "notistack";

interface UpdateAccessI {
    state: string
    onClose: any
    setRoles: any
}

interface AccessDataI {
    // name: string
    description: string
}

const UpdateAccess: FC<UpdateAccessI> = ({
    state,
    onClose,
    setRoles
}) => {
    const [accessData, setAccessData] = useState<AccessDataI | null>(null)
    const [localName, setLocalName] = useState<string>("");
    const [localDescription, setLocalDescription] = useState<string>("");
    const [isModified, setIsModified] = useState<boolean>(false);

    const {enqueueSnackbar} = useSnackbar()

    useEffect(() => {
        deviceAPI.getAccessId(state)
            .then((res) => {
                setAccessData({
                    // name: res.name,
                    description: res.description
                })
                setLocalName(res.name);
                setLocalDescription(res.description);
            })
            .catch(err => console.error(err))
    }, [state])

    const handleChange = (field: "name" | "description", value: string) => {
        if (field === "name") {
            setLocalName(value);
        } else {
            setLocalDescription(value);
        }
        checkIfModified(field, value);
    };

    const checkIfModified = (field: "name" | "description", value: string) => {
        if (field === "description" && value !== accessData?.description) {
            setIsModified(true);
        } else if (
            localDescription === accessData?.description
        ) {
            setIsModified(false);
        }
    };

    const handleSubmit = () => {
        const updatedData: Partial<AccessDataI> = {};
        // if (localName !== accessData?.name) {
        //     updatedData.name = localName;
        // }
        if (localDescription !== accessData?.description) {
            updatedData.description = localDescription;
        }
        deviceAPI.updateAccessById(state, updatedData)
            .then((res) => {
                enqueueSnackbar("Доступы обновлены", {
                    variant: "success",
                    autoHideDuration: 3000
                })
                onClose()
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
                    .then((ress) => {
                        setRoles(ress)
                        // onClose()
                        // enqueueSnackbar("Роль успешно создана", {
                        //     variant: "success",
                        //     autoHideDuration: 3000
                        // })
                    })
                    .catch(err => console.error(err))
                // setTimeout(() => {

                // }, 0)
            })
            .catch(err => console.error(err))
        // deviceAPI.updateAccessId(state, updatedData)
        //     .then(() => {
        //         console.log("Access updated successfully");
        //         onClose();
        //     })
        //     .catch(err => console.error(err));
    };

    return <Dialog
        title="Обновление доступа"
        onClose={onClose}
        closeBtn
        className={styles.el}
    >
            {/* {accessData !== null && <Field 
                placeholder="Название функции"
                type="text"
                wrapClassname={styles.field_small}
                onChange={(e) => handleChange("name", e.target.value)}
                value={localName}
            />} */}
            {accessData !== null && <Field 
                placeholder="Описание"
                type="text"
                wrapClassname={styles.field_small}
                onChange={(e) => handleChange("description", e.target.value)}
                // onChange={(e) => setRoleName(e.target.value)}
                value={localDescription}
            />}
            <Button 
                title="Обновить"
                onClick={handleSubmit}
                disabled={!isModified}
            />
    </Dialog>
}

export default UpdateAccess;