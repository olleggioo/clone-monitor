import { memo, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { deviceAPI } from "@/api";
import { deviceAtom } from "@/atoms";
import { Button } from "@/ui";

import { areasAtom } from "@/atoms/appDataAtom";
import AreasTable from "@/blocks/Areas/AreasTable";
import AccordionComponent from "@/components/Accordion";
import AreasNameEditModal from "@/modals/Areas/Edit";
import AreasHeader from "@/blocks/Users/Header/AreasHeader";
import Alert from "@/modals/Areas/Alert";
import AreasRangeEditModal from "@/modals/Areas/EditRange";
import AreasHeaderMobile from "@/blocks/Users/Header/AreasHeaderMobile";
import { IconEdit3, IconPlus, IconPlus2 } from "@/icons";

import Layout from "../Layout"
import styles from "./Area.module.scss"
import TechInfoArea from "./TechInfoArea";
import moment from "moment";
import getEnergyUnit from "@/helpers/getEnergyUnit";
import AddArea from "@/modals/Areas/AddArea";
import { Dashboard } from "@/components";
import { useSnackbar } from "notistack";
import { hasAccess } from "@/helpers/AccessControl";
import { requestsAccessMap } from "@/helpers/componentAccessMap";
import Link from "next/link";

export const emptyValues = {
    isNormal: 0,
    isWarning: 0, 
    isNotConfigured: 0,
    isNotOnline: 0, 
    isError: 0,
    uptime: {
        total: 0
    },
    energy: 0
}

const AreasContainer = () => {
    const [areas, setAreas] = useAtom(areasAtom)
    const [editArea, setEditArea] = useState({
        flag: false,
        value: ""
    })
    const [editRange, setEditRange] = useState({
        flag: false,
        value: ""
    })
    const [areaIds, setAreaIds] = useState<any>(null)
    const [alertMessage, setAlertMessage] = useState(false)
    const [device] = useAtom(deviceAtom)

    const dateFrom = {
        day: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        week: moment().subtract(1, 'week').format('YYYY-MM-DD HH:mm:ss'),
        month: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss')
    }
    
    const dateNow = moment().format('YYYY-MM-DD HH:mm:ss')
    const {enqueueSnackbar} = useSnackbar()

    console.log("areas", areas)

    useEffect(() => {
        if(hasAccess(requestsAccessMap.getDevicesArea)) {
            deviceAPI.getDevicesArea({
                relations: {
                    rangeips: true
                },
            }).then((anRes) => {
                const emptyUpdates = anRes.rows.map((area, index) => {
                    return {
                        ...area,
                        ...emptyValues
                    };
                })
                setAreas(emptyUpdates)
                return anRes;
            })
            
            .then((res: any) => {
                if(hasAccess(requestsAccessMap.getDevicesStatus)) {
                    deviceAPI.getDevicesStatus({
                        where: {
                            id: `$Not($In(["1eda7201-913e-11ef-8367-bc2411b3fd76"]))`
                        }
                    })
                        .then((statusess) => {
            
                            const promisesEnergy = res.rows.map((item: any) => {
                                return deviceAPI.getDevicesEnergySumDay({
                                    where: {
                                        createdAt: `$Between([\"${dateFrom.day}\",\"${dateNow}\"])`,
                                        areaId: item.id
                                    },
                                })
                            })
            
                            const promises = res.rows.map((item: any) => {
                                return Promise.all(statusess.rows.map((row: any) => {
                                    return deviceAPI.getDevicesStatusCount({
                                        where: { statusId: row.id, areaId: item.id }
                                    }).then(count => ({ statusId: row.id, count: count.total }))
                                }))
                            })
            
                            Promise.all([...promises, ...promisesEnergy]) // Объединяем все массивы промисов
                                .then((resPromise: any) => {
                                    const statuses = resPromise.slice(0, res.rows.length);
                                    console.log("statuses", statuses, resPromise)
                                    const oldStatuses = {
                                        ...statusess.rows,
                                        statuses
                                    }
                                    const energy = resPromise.slice(res.rows.length, res.rows.length * 2);
                                    // const energy = resPromise.slice(res.rows.length * 2); // Последний сегмент относится к promisesEnergy
                                    const updatedAreas = res.rows.map((area: any, index: number) => {
                                        const statusOrder = {
                                            isNormal: 0,
                                            isWarning: 0,
                                            isRepair: 0,
                                            isNotOnline: 0,
                                            isError: 0,
                                            // isArchived: 0
                                        };
                                        statuses[index].forEach((status: any) => {
                                            switch (status.statusId) {
                                                case '82cddea0-861f-11ee-932b-300505de684f':
                                                    statusOrder.isNormal = status.count;
                                                    break;
                                                case '82cde049-861f-11ee-932b-300505de684f':
                                                    statusOrder.isWarning = status.count;
                                                    break;
                                                case '9a8471f1-861f-11ee-932b-300505de684f':
                                                    statusOrder.isNotOnline = status.count;
                                                    break;
                                                case '9a847375-861f-11ee-932b-300505de684f':
                                                    statusOrder.isError = status.count;
                                                    break;
                                                // case '1eda7201-913e-11ef-8367-bc2411b3fd76':
                                                //     statusOrder.isArchived = status.count;
                                                //     break;
                                                case 'dc434af8-8f45-11ef-8367-bc2411b3fd76':
                                                    statusOrder.isRepair = status.count;
                                                    break;
                                                default:
                                                    break;
                                            }
                                        })
            
                                        const sumEnergy = energy[index].reduce((prev: any, curr: any) => prev + Number(curr.value), 0) || 0
                                        return {
                                            ...area,
                                            ...statusOrder,
                                            uptime: "0",
                                            energy: getEnergyUnit(sumEnergy)
                                        };
                                    });
                                    setAreas(updatedAreas);
                                })
                                .catch(err => console.error(err))
                        })
                        .catch(err => console.error(err))
                }
            }).catch(err => console.error(err)).catch(err => console.error("ERRRPR", err))
        }

    }, [setAreas])

    const buttons = (
        <div className={styles.buttons}>
            <Button
                title="Добавить площадку"
                appearance="icon"
                className={styles.btn}
            />
        </div>
    )

    const softDeleteArea = (id?: string) => {
        if(id) {
            setAreaIds(id);
            setAlertMessage(true)
        }
    }

    const handleDeleteClick = () => {
        if(areaIds !== null && areaIds !== undefined) {
            deviceAPI.deleteAreaById(areaIds)
            .then(res => {
                setAlertMessage(false)
                deviceAPI.getDevicesArea({
                    relations: {
                        rangeips: true
                    },
                }).then((anRes) => {
                    const emptyUpdates = anRes.rows.map((area, index) => {
                        return {
                            ...area,
                            ...emptyValues
                        };
                    })
                    console.log("emptyUpdates", emptyUpdates)
                    setAreas(emptyUpdates)
                    return anRes;
                })
                .then((res: any) => {
                    if(hasAccess(requestsAccessMap.getDevicesStatus)) {
                        deviceAPI.getDevicesStatus({
                            where: {
                                id: `$Not($In(["1eda7201-913e-11ef-8367-bc2411b3fd76"]))`
                            }
                        })
                            .then((statusess) => {
                
                                const promisesEnergy = res.rows.map((item: any) => {
                                    return deviceAPI.getDevicesEnergySumDay({
                                        where: {
                                            createdAt: `$Between([\"${dateFrom.day}\",\"${dateNow}\"])`,
                                            areaId: item.id
                                        },
                                    })
                                })
                
                                const promises = res.rows.map((item: any) => {
                                    return Promise.all(statusess.rows.map((row: any) => {
                                        return deviceAPI.getDevicesStatusCount({
                                            where: { statusId: row.id, areaId: item.id }
                                        }).then(count => ({ statusId: row.id, count: count.total }))
                                    }))
                                })
                
                                Promise.all([...promises, ...promisesEnergy]) // Объединяем все массивы промисов
                                    .then((resPromise: any) => {
                                        const statuses = resPromise.slice(0, res.rows.length);
                                        console.log("statuses", statuses, resPromise)
                                        const oldStatuses = {
                                            ...statusess.rows,
                                            statuses
                                        }
                                        const energy = resPromise.slice(res.rows.length, res.rows.length * 2);
                                        // const energy = resPromise.slice(res.rows.length * 2); // Последний сегмент относится к promisesEnergy
                                        const updatedAreas = res.rows.map((area: any, index: number) => {
                                            const statusOrder = {
                                                isNormal: 0,
                                                isWarning: 0,
                                                isRepair: 0,
                                                isNotOnline: 0,
                                                isError: 0,
                                                // isArchived: 0
                                            };
                                            statuses[index].forEach((status: any) => {
                                                switch (status.statusId) {
                                                    case '82cddea0-861f-11ee-932b-300505de684f':
                                                        statusOrder.isNormal = status.count;
                                                        break;
                                                    case '82cde049-861f-11ee-932b-300505de684f':
                                                        statusOrder.isWarning = status.count;
                                                        break;
                                                    case '9a8471f1-861f-11ee-932b-300505de684f':
                                                        statusOrder.isNotOnline = status.count;
                                                        break;
                                                    case '9a847375-861f-11ee-932b-300505de684f':
                                                        statusOrder.isError = status.count;
                                                        break;
                                                    // case '1eda7201-913e-11ef-8367-bc2411b3fd76':
                                                    //     statusOrder.isArchived = status.count;
                                                    //     break;
                                                    case 'dc434af8-8f45-11ef-8367-bc2411b3fd76':
                                                        statusOrder.isRepair = status.count;
                                                        break;
                                                    default:
                                                        break;
                                                }
                                            })
                
                                            const sumEnergy = energy[index].reduce((prev: any, curr: any) => prev + Number(curr.value), 0) || 0
                                            return {
                                                ...area,
                                                ...statusOrder,
                                                uptime: "0",
                                                energy: getEnergyUnit(sumEnergy)
                                            };
                                        });
                                        console.log("TEST TEST TEST TEST TEST")
                                        setAreas(updatedAreas);
                                    })
                                    .catch(err => console.error(err))
                            })
                            .catch(err => console.error(err))
                    }
                }).catch(err => console.error(err)).catch(err => console.error("ERRRPR", err))
            })
            .catch(err => {
                console.error("Ошибка при удалении области", err);
                enqueueSnackbar("Ошибка при удалении площадки: " + err.response?.data?.message || "Произошла ошибка", {
                    variant: 'error',
                    autoHideDuration: 3000,
                });
            })
        }
    }

    const [modal, setModal] = useState<any>(null)
    
    return device !== "mobile" ? <Layout header={<AreasHeader />}>
        {hasAccess(requestsAccessMap.createArea) && <Button
            title="Добавить площадку"
            icon={<IconPlus width={22} height={22} />}
            onClick={() => setModal('add-area')}
            className={styles.btnAdd}
        />}
        {modal === 'add-area' && <AddArea onClose={() => setModal(null)} />}
        {hasAccess(requestsAccessMap.updateAreaName) && editArea && editArea.flag && editArea.value !== "" && <AreasNameEditModal state={editArea} onClose={setEditArea} />}
        {editRange && editRange.flag && editRange.value !== "" && <AreasRangeEditModal state={editRange} onClose={setEditRange} />}
        {alertMessage && <Alert 
            title={"Удаление площадки"} 
            content={"Предупреждение: данное действие удалит связанные аппараты"} 
            open={alertMessage} 
            setOpen={setAlertMessage} 
            handleDeleteClick={handleDeleteClick} 
        />}
        <Dashboard>

            {areas.length !== 0 && areas.map((item: any, key: number) => (
                <div key={item.id} style={{marginTop: "1rem"}}>
                    <AccordionComponent title={item.name} editable={false} onChange={setEditArea}>
                        <div className={styles.connector}>
                            <p>Всего {item.rangeips.length} диапазонов</p>
                            <div className={styles.connector}>
                                <Link href={`/areas/${item.id}`}>
                                    Информация о коробке
                                </Link>
                                {hasAccess(requestsAccessMap.updateAreaName) && <Button 
                                    icon={<IconEdit3 width={22} height={22} />}
                                    title="Переименовать"
                                    onClick={() => setEditArea({flag: true, value: item.name})}
                                    className={styles.btn}
                                />}
                                {hasAccess(requestsAccessMap.createRangeIp) && <Button 
                                    icon={<IconPlus2 width={22} height={22} /> }
                                    title="Добавить диапазоны"
                                    onClick={() => setEditRange({flag: true, value: item.id})}
                                    className={styles.btn}
                                />}
                                {hasAccess(requestsAccessMap.deleteAreaById) && <Button 
                                    title="Удалить"
                                    className={styles.delete}
                                    onClick={() => softDeleteArea(item.id)}
                                />}
                            </div>
                        </div>
                        <div className={styles.combineBlock}>
                            <TechInfoArea 
                                isNormal={item.isNormal}
                                isError={item.isError}
                                isWarning={item.isWarning}
                                isNotOnline={item.isNotOnline}
                                isRepair={item.isRepair}
                                isArchived={item.isArchived}
                                rangeLen={item.rangeips.length}
                                uptime={item.uptime}
                                energy={item.energy}
                            />
                            <div className={styles.divider} />
                            <AreasTable rows={item.rangeips} />
                        </div>
                    </AccordionComponent>
                </div>
            ))}
        </Dashboard>
    </Layout> : <Layout pageTitle="Площадки" header={<AreasHeader />}>
        <AreasHeaderMobile />
        {editArea && editArea.flag && editArea.value !== "" && <AreasNameEditModal state={editArea} onClose={setEditArea} />}
        {editRange && editRange.flag && editRange.value !== "" && <AreasRangeEditModal state={editRange} onClose={setEditRange} />}
        {alertMessage && <Alert 
            title={"Удаление площадки"} 
            content={"Предупреждение: данное действие удалит связанные аппараты"} 
            open={alertMessage} 
            setOpen={setAlertMessage} 
            handleDeleteClick={handleDeleteClick} 
        />}
        <Dashboard>

            {areas.length !== 0 && areas.map((item: any, key: number) => (
                <div key={item.id} style={{marginTop: "1rem"}}>
                    <AccordionComponent title={item.name} editable={false} onChange={setEditArea}>
                        <div className={styles.connector}>
                            <p>Всего {item.rangeips.length} диапазонов</p>
                            <div className={styles.connector}>
                                {hasAccess(requestsAccessMap.updateAreaName) && <Button 
                                    icon={<IconEdit3 width={22} height={22} />}
                                    title="Переименовать"
                                    onClick={() => setEditArea({flag: true, value: item.name})}
                                    className={styles.btn}
                                />}
                                {hasAccess(requestsAccessMap.createRangeIp) && <Button 
                                    icon={<IconPlus2 width={22} height={22} /> }
                                    title="Добавить диапазоны"
                                    onClick={() => setEditRange({flag: true, value: item.id})}
                                    className={styles.btn}
                                />}
                                {hasAccess(requestsAccessMap.deleteAreaById) && <Button 
                                    title="Удалить"
                                    className={styles.delete}
                                    onClick={() => softDeleteArea(item.id)}
                                />}
                            </div>
                        </div>
                        <div className={styles.combineBlock}>
                            <TechInfoArea 
                                isNormal={item.isNormal}
                                isError={item.isError}
                                isWarning={item.isWarning}
                                isNotOnline={item.isNotOnline}
                                isNotConfigured={item.isNotConfigured}
                                rangeLen={item.rangeips.length}
                                uptime={item.uptime}
                                energy={item.energy}
                            />
                            <div className={styles.divider} />
                            <AreasTable rows={item.rangeips} />
                        </div>
                    </AccordionComponent>
                </div>
            ))}
        </Dashboard>
    </Layout>
}

export default memo(AreasContainer)