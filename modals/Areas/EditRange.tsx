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
                    }).then(res => {
                        deviceAPI.getDevicesStatus()
                    .then((statuses) => {
                        const promisesUptime = res.rows.map((item: any) => {
                            return deviceAPI.getDevicesUptimeCacheDayAvg({
                                where: {
                                    createdAt: `$Between([\"${dateFrom.day}\",\"${dateNow}\"])`,
                                    areaId: item.id
                                },
                            })
                        })
        
                        const promisesEnergy = res.rows.map((item: any) => {
                            return deviceAPI.getDevicesEnergyCacheDaySum({
                                where: {
                                    createdAt: `$Between([\"${dateFrom.day}\",\"${dateNow}\"])`,
                                    areaId: item.id
                                },
                            })
                        })
        
                        const promises = res.rows.map((item: any) => {
                            return Promise.all(statuses.rows.map((row: any) => {
                                return deviceAPI.getDevicesStatusCount({
                                    where: { statusId: row.id, areaId: item.id }
                                })
                            }))
                        })
        
                        Promise.all([...promises, ...promisesUptime, ...promisesEnergy]) // Объединяем все массивы промисов
                            .then((resPromise: any) => {
                                const statuses = resPromise.slice(0, res.rows.length);
                                const uptime = resPromise.slice(res.rows.length, res.rows.length * 2);
                                const energy = resPromise.slice(res.rows.length * 2); // Последний сегмент относится к promisesEnergy
        
                                const updatedAreas = res.rows.map((area: any, index: number) => {
                                    const [isNormal, isWarning, isNotConfigured, isNotOnline, isError] = statuses[index].map((count: any) => count.total);
                                    return {
                                        ...area,
                                        isNormal,
                                        isWarning,
                                        isNotConfigured,
                                        isNotOnline,
                                        isError,
                                        uptime: uptime[index], // добавляем uptime в объект area
                                        energy: getEnergyUnit(energy[index] / 4) // добавляем energy в объект area
                                    };
                                });
                                setAreas(updatedAreas);
                            })
                            .catch(err => console.error(err))
                    })
                    .catch(err => console.error(err))
                        onClose(false)
                    }).catch(err => console.error(err))
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