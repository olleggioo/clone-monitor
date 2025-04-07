import { Button, Checkbox, Field } from "@/ui";
import { Layout } from "..";
import { useEffect, useState } from "react";
import styles from "./RoleAccess.module.scss"
import { AccessControl } from "@/helpers/AccessControl";
import { requestsAccessTranslation } from "@/helpers/componentAccessMap";
import ProfileUser from "@/components/ProfileUser";
import { Dashboard } from "@/components";
import { deviceAPI, userAPI } from "@/api";
import { RoleDataStateI, RoleRowsDataStateI } from "@/atoms/appDataAtom";
import AccordionComponent from "@/components/Accordion";
import AreasTable from "@/blocks/Areas/AreasTable";
import RolesTable from "@/blocks/Roles/RolesTable";
import { IconEdit3, IconPlus, IconPlus2 } from "@/icons";
import CreateAccessModal from "@/modals/Roles/CreateAccess";
import CreateRole from "@/modals/Roles/CreateRole";
import Alert from "@/modals/Areas/Alert";
import { enqueueSnackbar } from "notistack";
import EditRoleName from "@/modals/Roles/EditRoleName";

const RoleAccessContainer = () => {
    const roleId = localStorage.getItem(`${process.env.API_URL}_role`)

    const [checkboxes, setCheckboxes] = useState(Object.entries(requestsAccessTranslation).map(item => item[1]));
    const [roles, setRoles] = useState<RoleDataStateI | null>(null)

    useEffect(() => {
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
            })
            .catch(err => console.error(err))
    }, [])

    const handleCheckboxChange = (id: any) => {
        setCheckboxes((prevCheckboxes: any) =>
            prevCheckboxes.map((checkbox: any) =>
                checkbox.id === id
                ? { ...checkbox, isChecked: !checkbox.isChecked }
                : checkbox
            )
        );
    };

    const [editAccess, setEditAccess] = useState({
        flag: false,
        value: ""
    })
    const [modal, setModal] = useState<any>(null)
    const [roleIds, setRoleIds] = useState<any>(null)
    const [alertMessage, setAlertMessage] = useState<boolean>(false)
    const [editRoleAlert, setEditRoleAlert] = useState<boolean>(false)

    const softDeleteArea = (id?: string) => {
        if(id) {
            setRoleIds(id);
            setAlertMessage(true)
        }
    }

    const editRoleName = (id?: string) => {
        if(id) {
            setRoleIds(id);
            setEditRoleAlert(true)
        }
    }

    const handleDeleteRole = () => {
        if(roleIds) {
            userAPI.deleteRoleById(roleIds)
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
                            setAlertMessage(false)
                            setRoleIds(null)
                            enqueueSnackbar("Роль удалена", {
                                variant: "success",
                                autoHideDuration: 3000
                            })
                        })
                        .catch(err => console.error(err))
                    // setTimeout(() => {
                    //     window.location.reload()
                    // }, 500)
                })
                .catch(err => {
                    enqueueSnackbar("Произошла ошибка при удалении роли", {
                        variant: "error",
                        autoHideDuration: 3000
                    })
                })
        }
    }

    const closeEditRole = () => {
        setRoleIds(null)
        setEditRoleAlert(false)
    }


    return <Layout header={<ProfileUser title="Роли" />}>
        <Button
            title="Создать роль"
            icon={<IconPlus width={22} height={22} />}
            onClick={() => setModal('create-role')}
            className={styles.btnAdd}
        />
        {modal === "create-role" && <CreateRole setRoles={setRoles} onClose={() => setModal(null)} />}
        {roleIds !== null && roleIds.length !== 0 && editRoleAlert && <EditRoleName roles={roles} setRoles={setRoles} id={roleIds} onClose={closeEditRole} />}
        {alertMessage && roleIds && <Alert 
            title={"Удаление роли"} 
            content={""} 
            open={alertMessage} 
            setOpen={setAlertMessage} 
            handleDeleteClick={handleDeleteRole} 
        />}
        <Dashboard>
            {editAccess && editAccess.flag && editAccess.value !== "" && <CreateAccessModal setRoles={setRoles} state={editAccess} onClose={setEditAccess} />}
            {roles && roles.rows && roles.rows.length !== 0 && roles.rows.map((item: RoleRowsDataStateI, key: number) => (
                <div key={item.id} style={{marginTop: "1rem"}}>
                    <AccordionComponent title={item.name} editable={false} onChange={setRoles}>
                        <div className={styles.connector}>
                            <p>Всего {item.roleAccesses.length} доступов</p>
                            <div className={styles.connector}>
                                <Button 
                                    icon={<IconEdit3 width={22} height={22} />}
                                    title="Редактировать"
                                    onClick={() => editRoleName(item.id)}
                                    className={styles.btn}
                                />
                                <Button 
                                    icon={<IconPlus2 width={22} height={22} /> }
                                    title="Добавить доступ"
                                    onClick={() => setEditAccess({flag: true, value: item.id})}
                                    className={styles.btn}
                                />
                                <Button 
                                    title="Удалить"
                                    className={styles.delete}
                                    onClick={() => softDeleteArea(item.id)}
                                />
                            </div>
                        </div>
                        <div className={styles.combineBlock}>
                            <RolesTable rows={item.roleAccesses} setRoles={setRoles} />
                        </div>
                    </AccordionComponent>
                </div>
            ))}
            </Dashboard>
        {/* <div className={styles.wrapper}> */}
            {/* <Field 
                placeholder="Название роли"
            /> */}
            {/* <AccessControl accessId={componentAccessMap.DisableManyDeviceByQuery}>
                <DisableManyDeviceByQuery />
            </AccessControl>

            <AccessControl accessId={componentAccessMap.DropPoolManyByQuery}>
                <DropPoolManyByQuery />
            </AccessControl> */}
            {/* <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr"}}>
                {checkboxes.map((item) => (
                    <Checkbox
                        key={item}
                        label={item}
                        name={`checkbox-${item}`}
                        isChecked={false}
                        onChange={() => handleCheckboxChange(item)}
                        value={item}
                    />
                ))}
            </div> */}
        {/* </div> */}
    </Layout>
}

export default RoleAccessContainer;