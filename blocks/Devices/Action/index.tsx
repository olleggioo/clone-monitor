import { deviceUpdateManyPool, devicesUpdatesMany, devicesUserIdFilterAtom, modalInfoAtom } from "@/atoms/appDataAtom";
import { FormControl, MenuItem, Select } from "@mui/material";
import { styled, createTheme } from "@mui/system";
import { useAtom } from "jotai";
import { ChangeEvent, useEffect, useState } from "react";
import FormFieldDeviceUser from "../FormFieldsets/FormField";
import { useDeviceUserForm } from "@/hooks/useDeviceForm";
import { FieldsType, clientPlaceholder, deviceUserFormField } from "@/data/devicesForms";
import { Button, CustomSelect, Field } from "@/ui";
import { deviceAPI, userAPI } from "@/api";
import { useSnackbar } from "notistack";
import { ErrorPopup } from "@/components";
import MultiSelectUser from "@/components/MultiSelect/User";
import styles from "./Action.module.scss"
import { deviceAtom } from "@/atoms";

const initialState = {
    client: clientPlaceholder
}

export const dataProfiles = [
  {label: "Заводской режим", value: '0'},
  {label: "Спящий режим", value: '1'},
  {label: "Режим низкого потребления", value: '3'},
  {label: "Режим легкого разгона", value: '4'},
  {label: "Режим разгона", value: '5'},
]

const SelectAction = () => {
    const [state, setState] = useAtom(devicesUserIdFilterAtom)
    const [decrease, setDecrease] = useState<{voltage: string | undefined; profile: any}>({
      voltage: undefined,
      profile: {
        label: "Настройки",
        value: null
      }
    })
    const { fields, handleUpdateState, handleDeviceUserSubmit, setFields } = useDeviceUserForm(initialState)
    const [modalUpdate, setModelUpdate] = useAtom(deviceUpdateManyPool)
    const [sucessReload, setSuccessReload] = useState(false)
    const [sucessDecrese, setSucessDecrese] = useState(false)
    const [fieldSets, setFieldSets] = useState(deviceUserFormField)
    const [deviceUpdate, setDeviceUpdate] = useAtom(devicesUpdatesMany)
    const [modalInfo, setModalInfo] = useAtom(modalInfoAtom)
    const [age, setAge] = useState('');
    const handleChange = (event: { target: { value: string } }) => {
        setAge(event.target.value);
    };
    const [device] = useAtom(deviceAtom)
    const {enqueueSnackbar} = useSnackbar()
    const reloadDevicesSubmit = () => {
        if(state.length > 0) {
            deviceAPI.reloadManyDevices({
                where: state.map(item => ({ id: item.id }))
            })
                .then(res => {
                  setModalInfo({
                    open: true,
                    action: "Перезагрузка",
                    status: "Успешно",
                    textInAction: "Устройства перезагрузятся в течении 30 секунд"
                  })
                  setSuccessReload(true)
                })
                .catch(err => {
                  setModalInfo({
                    open: true,
                    action: "Перезагрузка",
                    status: "Ошибка",
                    textInAction: "Произошла ошибка при перезагрузке устройств"
                  })
                  setSuccessReload(false)
                })
        }
    }

    const handleChangeMultiUser = (e: any, newValue: any) => {
      setFields((prevState: any) => {
        return {
          ...prevState,
          client: {
            label: newValue?.label || null,
            value: newValue?.value || null
          }
        }
      })
    }
    const handleSubmit = () => { 
        if(state.length > 0 && fields.client.value !== null) {
          const dataTest = state.map((item) => {
            return {
              userId: fields.client.value,
              deviceId: item.id
            }
          })
          deviceAPI.updatesUserDevices({}, dataTest)
            .then((res) => {
              window.location.reload()
            })
            .catch(error => {
              console.log(error)
              if (error && error.response && error.response.data) {
                const errors = error.response.data.message;
                console.log(errors)
                  enqueueSnackbar(errors, {
                    variant: 'error',
                    autoHideDuration: 3000
                });
              }
            })
        }
    }
    const handleSelectChange = (
      name: keyof {voltage: number | null; profile: string | null},
      value: string | null | boolean
    ) => {
      setDecrease((prevState) => {
        return {
          ...prevState,
          [name]: value
        }
      })
    }

    const handleSelectProfileChange = (option: any) => {
      // handleSelectChange('profile', newValue?.value)
      setDecrease((prevState: any) => {
        return {
          ...prevState,
          profile: {
            label: option.label,
            value: option.value
          }
        }
      })
    }

    const handleVoltageChange = (evt: ChangeEvent<HTMLInputElement>) => {
      handleSelectChange('voltage', evt.target.value)
    }

    const onSubmitDecrease = () => {
      if(decrease.voltage !== undefined && decrease.profile.value !== null) {
        deviceAPI.updateManyOverclock({
          where: state.map(item => ({ id: item.id }))
        }, {
          profile: decrease.profile.value,
          voltage: decrease.voltage
        }).then(res => {
          setModalInfo({
            open: true,
            action: "Разгон устройств",
            status: "Успешно",
            textInAction: "Настройки разгона устройств сохранены"
          })
          setSucessDecrese(true)
        })
        .catch(err => {
          setModalInfo({
            open: true,
            action: "Разгон устройства",
            status: "Ошибка",
            textInAction: "Произошла ошибка при разгоне устройств"
          })
          console.error(err)
        })
      }
    }

    useEffect(() => {
        Promise.all([
          userAPI.getUsers({
            limit: 999
          })
        ])
          .then((res) => {
            const [users] = res
            const user = deviceUserFormField
            user.fields = user.fields.map((field) => {
              if (field.type === 'select' && field.name === 'client') {
                const selectedUser = users.rows[0]
                return {
                  ...field,
                  value: {
                    label: selectedUser.fullname || selectedUser.login,
                    value: selectedUser.id
                  },
                  options: users.rows.map((userItem: any) => {
                    return {
                      label: userItem.fullname || userItem.login,
                      value: userItem.id
                    }
                  })
                } as FieldsType
              }
              return field
            })
            // setState([])
            setFieldSets(user)
          })
          .catch(console.error)
      }, [])
    return (
        <div className={styles.el}>
            <div className={styles.inner}>
                <FormControl sx={device !== "mobile" ? { m: 1, minWidth: 360 } : {m: 1, minWidth: 'auto'}} disabled={!(state.length > 0)}>
                    <Select
                        value={age}
                        onChange={handleChange}
                        displayEmpty
                        placeholder="Hello"
                        inputProps={{ "aria-label": "Without label" }}
                        >
                        <MenuItem value="">
                            <em>Выбор действия с утройствами</em>
                        </MenuItem>
                        <MenuItem value={'user'}>1. Обновить клиентов</MenuItem>
                        <MenuItem value={'pool'}>2. Обновить пулы</MenuItem>
                        <MenuItem value={'reload'}>3. Перезагрузить</MenuItem>
                        <MenuItem value={'disperse'}>4. Разогнать</MenuItem>
                        <MenuItem value={'device'}>5. Обновить устройства</MenuItem>
                    </Select>
                </FormControl>
                {age === "user" && state.length > 0 && <div style={device !== "mobile" ? {width: '300px'} : {width: '100%'}}>
                    <MultiSelectUser 
                      options={fieldSets.fields[0].options}
                      type={"base"}
                      label='Клиенты'  
                      onChange={handleChangeMultiUser}
                      className={styles.field_large}
                    />
                {/* <CustomSelect
                    key={field.name}
                    options={field.options}
                    selectedOption={values[field.name]}
                    onChange={(option) => handleUpdateState(field.name, option)}
                    label={field.label}
                  /> */}
                </div>}
                {age === "disperse" && state.length > 0 && <div className={styles.box}>
                  <div className={styles.boxInner}>
                    <CustomSelect 
                      selectedOption={decrease.profile}
                      options={dataProfiles}  
                      onChange={handleSelectProfileChange}
                      className={styles.select}
                    />
                    <Field
                      // defaultValue={decrease.voltage}
                      onChange={handleVoltageChange}
                      type="number"
                      placeholder="Voltage Range [-20;20]"
                    />
                  </div>
                  
                </div>}
            </div>
            {age === "user" && state.length > 0 && <Button onClick={handleSubmit}>Сохранить</Button>}
            {age === "pool" && state.length > 0 && <Button onClick={() => setModelUpdate(true)}>Изменить пулы</Button>}
            {age === "reload" && state.length > 0 && <Button onClick={reloadDevicesSubmit}>Перезагрузить</Button>}
            {age === "disperse" && state.length > 0 && <Button title="Сохранить" onClick={onSubmitDecrease} />}
            {age === "device" && state.length > 0 && <Button title="Изменить" onClick={() => setDeviceUpdate(true)} />}
            {sucessReload && <ErrorPopup isSuccess={sucessReload} text="Устройства начали перезагружаться" />}
            {sucessDecrese && <ErrorPopup isSuccess={sucessDecrese} text="Сохранено" />}
        </div>
    )
}

export default SelectAction;
