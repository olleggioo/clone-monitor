import { Dashboard } from "@/components"
import { Button as ButtonSubmit, CustomSelect, Field } from "@/ui"
import styles from "./RangeIp.module.scss"
import { useAtom } from "jotai"
import { DeviceRangeIp, areasAtom, devicesDataAtom } from "@/atoms/appDataAtom"
import { useState, useMemo, ChangeEvent } from "react"
import { OptionItemI } from "@/ui/CustomSelect/CustomSelect"
import {
    selectPlaceholders
  } from '@/blocks/Devices/data'
import { deviceAPI } from "@/api"
import { useSnackbar } from 'notistack';
import { Button } from "@mui/material"

const devicesFilterInitialState = {
    area: "",
    from: "",
    to: "",
    name: ""
}

const RangeIp = () => {
    const [state, setState] = useState<{area: string | null, from: string, to: string, name: string}>(
        devicesFilterInitialState
    )
    
    const [areaName, setAreaName] = useState("")
    const [area, setAreas] = useAtom(areasAtom)
    const {enqueueSnackbar} = useSnackbar()
    const [action, setAction] = useState<string>('chose')

    const handleSubmit = () => {
        if(action === "chose") {
            if(state.area !== null && state.from !== "" && state.to !== "") {
                const data = {
                    areaId: state.area,
                    from: state.from,
                    to: state.to,
                    name: state.name
                }
                deviceAPI.createRangeIp(data)
                    .then(() => {
                        enqueueSnackbar("Диапазон добавлен", {
                            variant: 'success',
                            autoHideDuration: 3000,
                        })
                        setState(devicesFilterInitialState)
                    }).catch(error => {
                        if (error && error.response && error.response.data) {
                            const errors = error.response.data.message;
                            console.log(errors)
                            enqueueSnackbar(errors, {
                                variant: 'error',
                                autoHideDuration: 3000,
                            });
                        }
                    })
            } else {
                enqueueSnackbar("Заполните все поля", {
                    variant: 'warning',
                    autoHideDuration: 2000,
                })
            }
        } else {
            if(areaName !== "" && state.from !== "" && state.to !== "") {
                // deviceAPI.createArea({
                //     name: areaName
                // }).then(res => {
                //     const rangeData = {
                //         areaId: res.id,
                //         from: state.from,
                //         to: state.to,
                //         name: state.name
                //     }
                //     deviceAPI.createRangeIp(rangeData).then(() => {
                //         enqueueSnackbar("Диапазон добавлен", {
                //             variant: 'success',
                //             autoHideDuration: 3000,
                //         })
                //         setState(devicesFilterInitialState)
                //     }).catch(error => {
                //         if (error && error.response && error.response.data) {
                //             const errors = error.response.data.message;
                //             console.log(errors)
                //             errors.forEach((item: string) => {
                //                 enqueueSnackbar(item, {
                //                     variant: 'error',
                //                     autoHideDuration: 3000,
                //                 });
                //             });
                //         }
                //     })
                // })
            } else {
                enqueueSnackbar("Заполните все поля", {
                    variant: 'warning',
                    autoHideDuration: 2000,
                })
            }
        }
    }

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

    return <Dashboard title="Диапазон IP-адресов">
        {action === "chose" && <ButtonSubmit className={styles.changeAction} onClick={() => setAction('add')} title="Добавить площадку"/>}
        {action === "add" && <ButtonSubmit className={styles.changeAction} onClick={() => setAction('chose')} title="Выбрать площадку"/>}
        <div className={styles.fields}>
            {action === "chose" && <CustomSelect
                {...areaProps}
                onChange={handleAreaChange}
                className={styles.field_small}
            />}
            {action === "add" && <Field 
                placeholder="Название площадки"
                type="text"
                wrapClassname={styles.field_small}
                onChange={(e) => setAreaName(e.target.value)}
                value={areaName}
            />}
            <Field
                value={state.from}
                placeholder="Диапазон от"
                type="text"
                onChange={handleFromChange}
                wrapClassname={styles.field_very_small}
            />
            <Field
                value={state.to}
                placeholder="Диапазон до"
                type="text"
                onChange={handleToChange}
                wrapClassname={styles.field_very_small}
            />
             <Field
                value={state.name}
                placeholder="Название"
                type="text"
                onChange={handleNameChange}
                wrapClassname={styles.field}
            />
            <ButtonSubmit className={styles.field_small} onClick={handleSubmit}>Сохранить</ButtonSubmit>
        </div>
    </Dashboard>
}

export default RangeIp