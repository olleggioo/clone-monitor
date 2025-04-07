import { Dialog } from "@/components";
import { FC, useEffect, useState } from "react";
import styles from "./Roles.module.scss"
import { deviceAPI, userAPI } from "@/api";
import { requestsAccessMap, requestsAccessTranslation } from "@/helpers/componentAccessMap";
import { Button, Checkbox } from "@/ui";
import { useSnackbar } from "notistack";

interface CreateAccessI {
    setRoles: any
    state: {
        flag: boolean
        value: string
    }
    onClose: React.Dispatch<React.SetStateAction<{ flag: boolean; value: string }>>
}

const predefinedCategories = [
    "DeviceControllerApi", 
    "UserControllerApi", 
    "AreaControllerApi", 
    "RoleControllerApi",
    "UserDeviceControllerApi",
    "AccessControllerApi",
    "RangeipControllerApi",
    "PoolControllerApi",
    "DeviceLogControllerApi",
    "DeviceBoardControllerApi",
    "DevicePoolControllerApi",
    "PoolMockControllerApi",
    "DeviceCommentControllerApi",
    "RoleAccessControllerApi",
    "AlgorithmControllerApi",
    "ModelControllerApi",
    "HistoryControllerApi",
    "StatusControllerApi",
    "DevicePoolUserBackupControllerApi",
    "DevicePoolReserveControllerApi",
    "ErrorCodeControllerApi",
];

const CreateAccessModal: FC<CreateAccessI> = ({ setRoles, state, onClose }) => {
    const [selectedAccess, setSelectedAccess] = useState<Record<string, { selected: boolean; id: string }>>({});
    const [filteredAccessMap, setFilteredAccessMap] = useState<Record<string, string>>({});
    // const [categorizedAccess, setCategorizedAccess] = useState<Record<string, Record<string, string>>>({});
    // const [categorizedAccess, setCategorizedAccess] = useState<any>();
    const [categorizedAccess, setCategorizedAccess] = useState<any>({});

    const [access, setAccess] = useState<any>()

    const translatedObj = Object.fromEntries(
        Object.entries(requestsAccessMap).map(([key, value]) => {
            const translatedKey = requestsAccessTranslation[key] || key;
            return [translatedKey, value];
        })
    );

    // useEffect(() => {
    //     setFilteredAccessMap(translatedObj);

    //     const initialState = Object.entries(translatedObj).reduce((acc, [key, id]: any) => {
    //         acc[key] = { selected: false, id };
    //         return acc;
    //     }, {} as Record<string, { selected: boolean; id: string }>);

    //     setSelectedAccess(initialState);

    //     const categorized = Object.entries(translatedObj).reduce((acc, [key, id]: any) => {
    //         let category: string;
    //         if (key.startsWith("Устройства")) category = "Устройства";
    //         else if (key.startsWith("Пулы")) category = "Пулы";
    //         else if (key.startsWith("Площадки")) category = "Площадки";
    //         else if (key.startsWith("Пользователи")) category = "Пользователи";
    //         else if (key.startsWith("Роли")) category = "Роли";
    //         else category = "Прочее";

    //         if (!acc[category]) acc[category] = {};
    //         acc[category][key] = id;

    //         return acc;
    //     }, {} as Record<string, Record<string, string>>);

    //     setCategorizedAccess(categorized);
    // }, []);

    const { enqueueSnackbar } = useSnackbar();

    // useEffect(() => {
    //     console.log("categorizedAccess", access)
    //     if(access && access.length !== 0) {

    //         userAPI
    //             .getUsersRole({
    //                 where: {
    //                     id: state.value,
    //                 },
    //                 relations: {
    //                     roleAccesses: {
    //                         access: true,
    //                     },
    //                 },
    //             })
    //             .then((res) => {
    //                 // console.log("RES", res)
    //                 const roleAccessIds =
    //                     res.rows[0]?.roleAccesses.map((roleAccess: any) => roleAccess.accessId) || [];
    //                 const filteredAccess = access.filter((item: any) => !roleAccessIds.includes(item.id));

    //                 console.log("res", access.length, filteredAccess.length)
    //                 // const filteredMap = Object.entries(translatedObj).reduce((acc, [key, id]: any) => {
    //                 //     if (!roleAccessIds.includes(id)) {
    //                 //         acc[key] = id;
    //                 //     }
    //                 //     return acc;
    //                 // }, {} as Record<string, string>);
                    
    //                 // setFilteredAccessMap(filteredMap);
    
    //                 // const filteredSelectedAccess = Object.entries(filteredMap).reduce((acc, [key, id]) => {
    //                 //     acc[key] = { selected: false, id };
    //                 //     return acc;
    //                 // }, {} as Record<string, { selected: boolean; id: string }>);
    
    //                 // setSelectedAccess(filteredSelectedAccess);
    
    //                 // const categorized = Object.entries(filteredMap).reduce((acc, [key, id]: any) => {
    //                 //     let category: string;
    //                 //     if (key.startsWith("Устройства")) category = "Устройства";
    //                 //     else if (key.startsWith("Пулы")) category = "Пулы";
    //                 //     else if (key.startsWith("Площадки")) category = "Площадки";
    //                 //     else if (key.startsWith("Пользователи")) category = "Пользователи";
    //                 //     else if (key.startsWith("Роли")) category = "Роли";
    //                 //     else category = "Прочее";
        
    //                 //     if (!acc[category]) acc[category] = {};
    //                 //     acc[category][key] = id;
        
    //                 //     return acc;
    //                 // }, {} as Record<string, Record<string, string>>);
        
    //                 // setCategorizedAccess(categorized);
    //             })
    //             .catch((err) => console.error(err));
    //     }
    // }, [state.value]);

    const test = () => {
        const selectedItems = Object.entries(selectedAccess)
            .filter(([_, value]) => value.selected)
            .map(([_, value]) => value);
        if (selectedItems.length > 1) {
            const data = selectedItems.map((item) => ({
                roleId: state.value,
                accessId: item.id,
            }));
            console.log("Data for API (multiple):", data);
            deviceAPI.createManyRoleAccess(data)
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
                            onClose({ flag: false, value: "" });
                            enqueueSnackbar("Доступы добавлены", {
                                variant: "success",
                                autoHideDuration: 3000,
                            });
                        })
                        .catch(err => console.error(err))
                })
                .catch((err) => {
                    enqueueSnackbar("Ошибка при добавлении доступов", {
                        variant: 'error',
                        autoHideDuration: 3000,
                    });
                });
        } else if (selectedItems.length === 1) {
            const data = {
                roleId: state.value,
                accessId: selectedItems[0].id,
            };
            deviceAPI.createRoleAccess(data)
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
                            onClose({ flag: false, value: "" });
                            enqueueSnackbar("Доступы добавлены", {
                                variant: "success",
                                autoHideDuration: 3000,
                            });
                        })
                    .catch(err => console.error(err))
                })
                .catch(err => {
                    enqueueSnackbar("Ошибка при добавлении доступа", {
                        variant: 'error',
                        autoHideDuration: 3000
                    });
                })
            console.log("Data for API (single):", data);
        } else {
            console.error("Ни один доступ не выбран!");
        }
    };

    useEffect(() => {
        deviceAPI.getAccess()
            .then(access => {
                const accessMap = access.rows;
                userAPI
                    .getUsersRole({
                        where: {
                            id: state.value,
                        },
                        relations: {
                            roleAccesses: {
                                access: true,
                            },
                        },
                    })
                        .then(roles => {
                            const roleAccessIds = roles.rows[0]?.roleAccesses.map((roleAccess: any) => roleAccess.accessId) || [];
                            const filteredAccess = accessMap.filter((item: any) => !roleAccessIds.includes(item.id));
                            console.log("res", accessMap.length, filteredAccess.length)
                            setAccess(filteredAccess)
                        })
                        .catch(err => console.error(err))
            })
            .catch(err => console.error(err))
    }, [state.value])

    useEffect(() => {
        if (access && access.length > 0) {
            const categories: any = predefinedCategories.reduce((acc: any, category) => {
                acc[category] = [];
                return acc;
            }, {});

            const others: any = [];

            access.forEach((item: any) => {
                const categoryKey = predefinedCategories.find(category => item.name.startsWith(category));
                if (categoryKey) {
                    categories[categoryKey].push(item);
                } else {
                    others.push(item);
                }
            });

            setCategorizedAccess({ ...categories, others });
        }
    }, [access]);

    console.log("categorid", categorizedAccess)

    const handleCheckboxChange = (id: string) => {
        console.log("id", id)
        setSelectedAccess(prevState => ({
            ...prevState,
            [id]: {
                selected: !prevState[id]?.selected, // Переключение состояния
                id: id,
            },
        }));
    };

    const closeSubmit = () => {
        onClose({ flag: false, value: "" });
    };

    console.log("selectedAccess", selectedAccess)

    return (
        <Dialog
            title="Добавление доступа"
            onClose={closeSubmit}
            closeBtn
            className={styles.el}
            wide
        >
            <div className={styles.checkboxList}>
                {Object.entries(categorizedAccess).map(([category, items]: [string, any]) => (
                    <div key={category} className={styles.category}>
                        <h2 className={styles.categoryTitle}>{category === "others" ? "Прочее" : category}</h2>
                        {items.map((item: any, key: any) => (
                            <div className={styles.checkboxItem} key={item.id}>
                                <input
                                    className={styles.input}
                                    // name={item.name}
                                    id={item.id}
                                    checked={selectedAccess[item.id]?.selected}
                                    onChange={() => handleCheckboxChange(item.id)}
                                    type="checkbox"
                                />
                                    <label className={styles.label} htmlFor={item.id}>
                                        <div className={styles.test}>
                                            <h3>{item.name}</h3>
                                            <h3 className={styles.description}>{item.description}</h3>
                                        </div>
                                    </label>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <Button title="Добавить" onClick={test} />
            {/* <div className={styles.checkboxList}>
                {Object.entries(categorizedAccess).length !== 0 ? Object.entries(categorizedAccess).map(([category, items]) => (
                    <div key={category} className={styles.category}>
                        <h3>{category}</h3>
                        {Object.entries(items).map(([key, id]) => (
                            <div key={key} className={styles.checkboxItem}>
                                <input
                                    type="checkbox"
                                    checked={selectedAccess[key]?.selected || false}
                                    onChange={() => handleCheckboxChange(key)}
                                />
                                <p className={styles.text}>{key}</p>
                            </div>
                        ))}
                    </div>
                )) : <span>Доступных доступов нет</span>}
            </div> */}
            {/* <Button title="Добавить" onClick={test} disabled={!(Object.entries(categorizedAccess).length !== 0)} /> */}
        </Dialog>
    );
};

export default CreateAccessModal;