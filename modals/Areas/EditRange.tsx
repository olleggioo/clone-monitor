import { Dialog } from "@/components"
import styles from "./Areas.module.scss"
import { Button, Field } from "@/ui"
import { IconSave } from "@/icons"
import { useEffect, useState } from "react"
import { useAtom } from "jotai"
import { areaRangesIp, areasAtom } from "@/atoms/appDataAtom"
import { deviceAPI } from "@/api"
import { useSnackbar } from "notistack"
import getEnergyUnit from "@/helpers/getEnergyUnit"
import moment from "moment"
import { hasAccess } from "@/helpers/AccessControl"
import { requestsAccessMap } from "@/helpers/componentAccessMap"
import { emptyValues } from "@/containers/Areas"

const initialFieldsetState = {
  from: '',
  to: '',
  name: ''
}

const AreasRangeEditModal = ({state, onClose}: any) => {
    const [states, setState] = useState<any>(
        initialFieldsetState
    )
    const [editState, setEditState] = useState({name: ""})
    const [areas, setAreas] = useAtom(areasAtom)

    const {enqueueSnackbar} = useSnackbar()

    const dateFrom = {
        day: moment().startOf('day').format('YYYY-MM-DD HH:mm'),
        week: moment().subtract(1, 'week').format('YYYY-MM-DD HH:mm'),
        month: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm')
    }
    
    const dateNow = moment().format('YYYY-MM-DD HH:mm')

    

    const handleSubmit = () => {
        if(state.value !== "" && states.area !== null && states.from !== "" && states.to !== "") {
            const data = {
                areaId: state.value,
                from: states.from,
                to: states.to,
                name: states.name
            }
            deviceAPI.createRangeIp(data)
                .then(() => {
                    enqueueSnackbar("Диапазон добавлен", {
                        variant: 'success',
                        autoHideDuration: 3000,
                    })
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
                                            onClose(false)
                                        })
                                        .catch(err => {
                                            onClose(false)
                                        })
                                })
                                .catch(err => {
                                    console.error(err)
                                    onClose(false)
                                })
                        }
                    }).catch(err => {
                        console.error(err)
                        onClose(false)
                    }).catch(err => console.error("ERRRPR", err))
                }).catch(error => {
                    if (error && error.response && error.response.data) {
                        const errors = error.response.data.message;
                        console.log(errors)
                        // errors.forEach((item: string) => {
                            enqueueSnackbar(errors, {
                                variant: 'error',
                                autoHideDuration: 3000
                            });
                        // });
                    }
                })
        } else {
            enqueueSnackbar("Заполните все поля", {
                variant: 'warning',
                autoHideDuration: 2000,
            })
        }
    }

  const handleFromChange = (e: any) => {
    setState((prevState: any) => {
        return {
            ...prevState,
            from: e.target.value
        }
    })
  }

    const handleToChange = (e: any) => {
        setState((prevState: any) => {
            return {
                ...prevState,
                to: e.target.value
            }
        })
    }

    const handleNameChange = (e: any) => {
        setState((prevState: any) => {
            return {
                ...prevState,
                name: e.target.value
            }
        })
    }
  
  return (
      <Dialog
        title="Добавление диапазона"
        onClose={onClose}
        closeBtn
        className={styles.el}
      >
         <Field
            value={states.from}
            placeholder="Диапазон от"
            type="text"
            onChange={handleFromChange}
            wrapClassname={styles.field_very_small}
          />
          <Field
            value={states.to}
            placeholder="Диапазон до"
            type="text"
            onChange={handleToChange}
            wrapClassname={styles.field_very_small}
          />
            <Field
              value={states.name}
              placeholder="Название"
              type="text"
              onChange={handleNameChange}
              wrapClassname={styles.field}
          />
          <Button 
            title="Добавить"
            onClick={handleSubmit}
          />
      </Dialog>
    )
}

export default AreasRangeEditModal