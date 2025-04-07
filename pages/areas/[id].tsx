import { deviceAPI } from "@/api";
import { atomPageMap, atomPagePoll } from "@/atoms/statsAtom";
import AreaContainer, { LoggingPollI } from "@/containers/Area";
import { hasAccess } from "@/helpers/AccessControl";
import { requestsAccessMap } from "@/helpers/componentAccessMap";
import getEnergyUnit from "@/helpers/getEnergyUnit";
import withAuth from "@/hoc/withAuth";
import { useAtom } from "jotai";
import { sum } from "lodash";
import moment from "moment";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router"
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";

const emptyValues = {
    isNormal: 0,
    isWarning: 0, 
    isNotConfigured: 0,
    isNotOnline: 0, 
    isError: 0,
    uptime: {
        total: 0
    },
    energy: 0,
}

interface LoggingPoll {
    rows: LoggingPollI[] | []
    total: number
}

const AreaPage: NextPage = () => {
    const router = useRouter()
    const id = router.query.id as string | undefined;

    const dateFrom = {
        day: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        week: moment().subtract(1, 'week').format('YYYY-MM-DD HH:mm:ss'),
        month: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss')
    }
    
    const dateNow = moment().format('YYYY-MM-DD HH:mm:ss')
    const {enqueueSnackbar} = useSnackbar()

    const [areas, setAreas] = useState<any>([])
    const [loggingPoll, setLoggingPoll] = useState<LoggingPoll | null>(null)
    const [loggingMap, setLoggingMap] = useState<LoggingPoll | null>(null)
    const [syncBoxInfo, setSyncBoxInfo] = useState<any>(null)
    const [loggingClickhouse, setLoggingClickhouse] = useState<any>([])
    const [loggingWorker, setLoggingWorker] = useState<any>([])

    const [filterPageMap] = useAtom(atomPageMap)
    const [filterPagePoll] = useAtom(atomPagePoll)
    
    useEffect(() => {
        if(hasAccess(requestsAccessMap.getDeviceArea) && id) {
            deviceAPI.getDeviceArea(id, {
                relations: {
                    rangeips: true
                },
            }).then((anRes) => {
                const emptyUpdates = {
                    ...anRes,
                    ...emptyValues,
                }
                // const emptyUpdates = anRes.rows.map((area, index) => {
                //     return {
                //         ...area,
                //         ...emptyValues
                //     };
                // })
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
            
                            const promisesEnergy = deviceAPI.getDevicesEnergySumDay({
                                    where: {
                                        createdAt: `$Between([\"${dateFrom.day}\",\"${dateNow}\"])`,
                                        areaId: res.id
                                    },
                                })
            
                            const promises = Promise.all([
                                ...statusess.rows.map((row: any) => {
                                    return deviceAPI.getDevicesStatusCount({
                                        where: { statusId: row.id, areaId: res.id }
                                    }).then(count => ({ statusId: row.id, count: count.total }));
                                }),
                                promisesEnergy // добавляем промис в массив
                            ]).then((resProm: any) => {
                                const statuses = resProm.slice(0, resProm.length - 1);

                                const energy = resProm.slice(resProm.length - 1, resProm.length);

                                const statusOrder = {
                                    isNormal: 0,
                                    isWarning: 0,
                                    isRepair: 0,
                                    isNotOnline: 0,
                                    isError: 0,
                                    // isArchived: 0
                                };
                                const counts = statuses.map((item: any, index: any) => {
                                    statuses.forEach((status: any) => {
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
                                })
                                
                                const sumEnergy = energy[0].reduce((prev: any, curr: any) => prev + Number(curr.value), 0) || 0
                                const updateArea = {
                                    ...res,
                                    ...statusOrder,
                                    energy: getEnergyUnit(sumEnergy),
                                    uptime: "0"
                                }
                                setAreas(updateArea)

                            })
                            .catch(err => console.log("err", err))
                        })
                        .catch(err => console.error(err))
                }
            }).catch(err => console.error(err)).catch(err => console.error("ERRRPR", err))
        }

    }, [id])

    useEffect(() => {
        const fetchData = () => {
            deviceAPI.getBoxJournal({
                where: {
                    appId: id,
                    argv: "$Like(\"polling\")"
                },
                order: {
                    createdAt: "DESC"
                },
                page: filterPagePoll - 1,
                limit: 100
            }).then((res: LoggingPoll) => {
                console.log("res", res)
                setLoggingPoll(res)
            }).catch(err => {
                console.error(err)
            })
        }
        fetchData();
        const interval = setInterval(fetchData, 20000);
    
        return () => clearInterval(interval);
    }, [id, filterPagePoll])

    useEffect(() => {
        const fetchData = () => {
            deviceAPI.getBoxJournal({
                where: {
                    appId: id,
                    argv: "$Like(\"mapping\")"
                },
                order: {
                    createdAt: "DESC"
                },
                page: filterPageMap - 1,
                limit: 100,
            }).then((res: LoggingPoll) => {
                console.log("res", res)
                setLoggingMap(res)
            }).catch(err => {
                console.error(err)
            })
        }
        fetchData();
        const interval = setInterval(fetchData, 20000);
    
        return () => clearInterval(interval);
    }, [id, filterPageMap])

    console.log("loggingPoll", loggingPoll)

    useEffect(() => {
        if(id) {
            deviceAPI.getSyncBoxById(id)
                .then(res => {
                    setSyncBoxInfo(res)
                })
                .catch(err => {
                    console.error(err)
                })
        }
    }, [id])

    useEffect(() => {
        if (id) {
            deviceAPI.getLoggingClickhouse({
                where: {
                    areaId: id
                },
                limit: 100,
                select: {
                    createdAt: true,
                    message: true,
                    type: true,
                    areaId: true
                },
                order: {
                    createdAt: "DESC"
                }
            }).then((res) => {
                setLoggingClickhouse(res)
            }).catch(err => {
                console.error(err)
            })
        }
    }, [id])

    useEffect(() => {
        if (id) {
            deviceAPI.getLoggingWorker({
                where: {
                    areaId: id
                },
                limit: 100,
                select: {
                    createdAt: true,
                    message: true,
                    type: true,
                    areaId: true
                },
                order: {
                    createdAt: "DESC"
                }
            }).then((res) => {
                setLoggingWorker(res)
            }).catch(err => {
                console.error(err)
            })
        }
    }, [id])

    return <>
        <Head>
            <title>{`Площадка ${id}`}</title>
        </Head>
        {areas && <AreaContainer 
            {...areas} 
            loggingPoll={loggingPoll}
            loggingMap={loggingMap} 
            syncBoxInfo={syncBoxInfo}
            loggingClickhouse={loggingClickhouse}
            loggingWorker={loggingWorker}
            // cpuCoreData={cpuCoreData}
        />}
    </>
}

export default withAuth(AreaPage)