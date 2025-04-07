import { Dialog } from "@/components"
import styles from "./Areas.module.scss"
import { Button, Field } from "@/ui"
import { IconSave } from "@/icons"
import { ChangeEvent, useEffect, useMemo, useState } from "react"
import { useAtom } from "jotai"
import { DeviceRangeIp, areaRangesIp, areasAtom } from "@/atoms/appDataAtom"
import { deviceAPI } from "@/api"
import { useSnackbar } from "notistack"
import { OptionItemI } from "@/ui/CustomSelect/CustomSelect"
import { selectPlaceholders } from "@/blocks/Devices/data"
import getEnergyUnit from "@/helpers/getEnergyUnit"
import moment from "moment"

const initialFieldsetState = {
  from: '',
  to: '',
  name: ''
}

const devicesFilterInitialState = {
    area: "",
    from: "",
    to: "",
    name: ""
}

const AddArea = ({onClose}: any) => {
    const [state, setState] = useState<{area: string | null, from: string, to: string, name: string}>(
        devicesFilterInitialState
    )
    
    const [areaName, setAreaName] = useState("")
    const [password, setPassword] = useState("")
    const [area, setAreas] = useAtom(areasAtom)
    const {enqueueSnackbar} = useSnackbar()

    const dateFrom = {
        day: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        week: moment().subtract(1, 'week').format('YYYY-MM-DD HH:mm:ss'),
        month: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss')
    }
    
    const dateNow = moment().format('YYYY-MM-DD HH:mm:ss')

    const handleSubmit = () => {
        if (areaName !== "" && password !== "") {
            try {
                deviceAPI.createArea({
                    name: areaName,
                    password
                }).then((res: any) => {
                    onClose();
                    enqueueSnackbar("Диапазон добавлен", {
                        variant: 'success',
                        autoHideDuration: 3000,
                    });
    
                    deviceAPI.getDevicesArea({
                        relations: {
                            rangeips: true
                        },
                    }).then(res => {
                        deviceAPI.getDevicesStatus({
                            where: {
                                id: `$Not($In(["1eda7201-913e-11ef-8367-bc2411b3fd76"]))`
                            }
                        })
                            .then((statuses) => {
                                const promisesEnergy = res.rows.map((item: any) => {
                                    return deviceAPI.getDevicesEnergySumDay({
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
                                        }).then(count => ({ statusId: row.id, count: count.total }))
                                    }))
                                })
    
                                Promise.all([...promises, ...promisesEnergy])
                                    .then((resPromise: any) => {

                                        const statuses = resPromise.slice(0, res.rows.length);
                                        const oldStatuses = {
                                            ...statuses.rows,
                                            statuses
                                        }
                                        const energy = resPromise.slice(res.rows.length, res.rows.length * 2);
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
                                        })
                                        setAreas(updatedAreas);
                                    })
                                    .catch(err => {
                                        console.error(err);
                                        enqueueSnackbar("Ошибка при обработке данных", {
                                            variant: 'error',
                                            autoHideDuration: 3000,
                                        });
                                    });
                            })
                            .catch(err => {
                                console.error(err);
                                enqueueSnackbar("Ошибка при получении статуса устройств", {
                                    variant: 'error',
                                    autoHideDuration: 3000,
                                });
                            });
                    }).catch(err => {
                        console.error(err);
                        enqueueSnackbar("Ошибка при получении данных области", {
                            variant: 'error',
                            autoHideDuration: 3000,
                        });
                    });
                }).catch(err => {
                    console.error("Ошибка при создании области", err);
                    enqueueSnackbar("Ошибка при создании площадки: " + err.response?.data?.message || "Произошла ошибка", {
                        variant: 'error',
                        autoHideDuration: 3000,
                    });
                });
            } catch (error) {
                console.error("error", error);
                enqueueSnackbar("Произошла ошибка при выполнении запроса", {
                    variant: 'error',
                    autoHideDuration: 3000,
                });
            }
        } else {
            enqueueSnackbar("Заполните все поля", {
                variant: 'warning',
                autoHideDuration: 2000,
            });
        }
    };

    console.log("areas", area)

    const getSelectData = (
        name: keyof DeviceRangeIp,
        options: OptionItemI[]
      ) => {
        const selected =
          state[name] !== null
            ? options.find((option) => option.value === state[name]) ||
              selectPlaceholders[name]
            : selectPlaceholders[name]
        return {
          placeholder: selectPlaceholders[name]
            ? selectPlaceholders[name]
            : undefined,
          options,
          selectedOption: selected
        }
      }
    
    const areaProps = useMemo(() => {
        const options: OptionItemI[] =
          area?.map((item: any) => {
            return {
              label: item.name,
              value: item.id
            } as OptionItemI
          }) || []
        return getSelectData('area', options)
      }, [area, state.area])

    const handleSelectChange = (
        name: keyof DeviceRangeIp,
        value: string | null | boolean
    ) => {
        setState((prevState) => {
            return {
            ...prevState,
            [name]: value
            }
        })
    }
    const handleAreaChange = (option: OptionItemI) => {
        handleSelectChange('area', option.value)
    }

    const handleAreaInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
        handleSelectChange('area', evt.target.value)
    }

    const handleFromChange = (evt: ChangeEvent<HTMLInputElement>) => {
        handleSelectChange('from', evt.target.value)
    }

    const handleToChange = (evt: ChangeEvent<HTMLInputElement>) => {
        handleSelectChange('to', evt.target.value)
    }

    const handleNameChange = (evt: ChangeEvent<HTMLInputElement>) => {
        handleSelectChange('name', evt.target.value)
    }
  
  return (
      <Dialog
        title="Добавление площадки"
        onClose={onClose}
        closeBtn
        className={styles.el}
      >
            <Field 
                placeholder="Название площадки"
                type="text"
                wrapClassname={styles.field_small}
                onChange={(e) => setAreaName(e.target.value)}
                value={areaName}
            />
            <Field 
                placeholder="Пароль"
                type="password"
                wrapClassname={styles.field_small}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />
            {/* <Field
                value={state.from}
                placeholder="From range"
                type="text"
                onChange={handleFromChange}
                wrapClassname={styles.field_very_small}
            />
            <Field
                value={state.to}
                placeholder="To range"
                type="text"
                onChange={handleToChange}
                wrapClassname={styles.field_very_small}
            />
             <Field
                value={state.name}
                placeholder="Name"
                type="text"
                onChange={handleNameChange}
                wrapClassname={styles.field}
            /> */}
            <Button 
                title="Добавить"
                onClick={handleSubmit}
            />
      </Dialog>
    )
}

export default AddArea