import { deviceUpdateManyPool, devicesUserIdFilterAtom, modalInfoAtom } from "@/atoms/appDataAtom";
import { FormControl, MenuItem, Select } from "@mui/material";
import { styled, createTheme } from "@mui/system";
import { useAtom } from "jotai";
import { ChangeEvent, useEffect, useState } from "react";
import FormFieldDeviceUser from "../FormFieldsets/FormField";
import { useDeviceUserForm } from "@/hooks/useDeviceForm";
import { FieldsType, clientPlaceholder, deviceUserFormField } from "@/data/devicesForms";
import { Button, Field } from "@/ui";
import { deviceAPI, userAPI } from "@/api";
import { useSnackbar } from "notistack";
import { ErrorPopup } from "@/components";
import MultiSelectUser from "@/components/MultiSelect/User";
import styles from "./Action.module.scss"

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

const SelectActionManager = () => {
    const [state, setState] = useAtom(devicesUserIdFilterAtom)
    const [decrease, setDecrease] = useState<{voltage: string | undefined; profile: string | null}>({
      voltage: undefined,
      profile: null
    })
    const { fields, handleUpdateState, handleDeviceUserSubmit, setFields } = useDeviceUserForm(initialState)
    const [modalUpdate, setModelUpdate] = useAtom(deviceUpdateManyPool)
    const [sucessReload, setSuccessReload] = useState(false)
    const [sucessDecrese, setSucessDecrese] = useState(false)
    const [fieldSets, setFieldSets] = useState(deviceUserFormField)
    const [age, setAge] = useState('');
    const [modalInfo, setModalInfo] = useAtom(modalInfoAtom)
    const handleChange = (event: { target: { value: string } }) => {
        setAge(event.target.value);
    };
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

    const handleChangeMultiUser = (newValue: any) => {
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
          deviceAPI.updatesUserDevices({},
          {
            // accessToken: localStorage.getItem(`${process.env.API_URL}_accessToken`),
            deviceIds: state.map(item => item.id),
            userId: fields.client.value
          }
          )
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
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
        }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "20px"
            }}>

                <FormControl sx={{ m: 1, minWidth: 360 }} disabled={!(state.length > 0)}>
                    <Select
                        value={age}
                        onChange={handleChange}
                        displayEmpty
                        placeholder="Hello"
                        inputProps={{ "aria-label": "Without label" }}
                        >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={'user'}>1. Обновить клиентов</MenuItem>
                        <MenuItem value={'pool'}>2. Обновить пулы</MenuItem>
                        <MenuItem value={'reload'}>3. Перезагрузить</MenuItem>
                    </Select>
                </FormControl>
                {age === "user" && state.length > 0 && <div style={{width: '300px'}}>
                    <MultiSelectUser 
                      options={fieldSets.fields[0].options}
                      label='Клиенты'  
                      onChange={handleChangeMultiUser}
                      className={styles.field_large}
                    />
                </div>}
            </div>
            {age === "user" && state.length > 0 && <Button onClick={handleSubmit}>Сохранить</Button>}
            {age === "pool" && state.length > 0 && <Button onClick={() => setModelUpdate(true)}>Изменить пулы</Button>}
            {age === "reload" && state.length > 0 && <Button onClick={reloadDevicesSubmit}>Перезагрузить</Button>}
            {sucessReload && <ErrorPopup isSuccess={sucessReload} text="Устройства начали перезагружаться" />}
            {sucessDecrese && <ErrorPopup isSuccess={sucessDecrese} text="Сохранено" />}
        </div>
    )
}

export default SelectActionManager;
