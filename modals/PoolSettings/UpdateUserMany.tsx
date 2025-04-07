import { Dialog } from "@/components"
import styles from "./PoolSettings.module.scss"
import { Button, Field } from "@/ui"
import MultiSelectUser from "@/components/MultiSelect/User"
import { useState } from "react"
import { clientPlaceholder, deviceUserFormField } from "@/data/devicesForms"
import { IconSave } from "@/icons"
import { useDeviceUserForm } from "@/hooks/useDeviceForm"
import { useAtom } from "jotai"
import { devicesDataAtom, devicesUserIdFilterAtom } from "@/atoms/appDataAtom"
import { deviceAPI } from "@/api"
import { useSnackbar } from "notistack"

const initialState = {
    client: clientPlaceholder
}

const UpdateUserMany = ({onClose, setAreas}: any) => {
    const {enqueueSnackbar} = useSnackbar()
    const [state, setState] = useAtom(devicesUserIdFilterAtom)
    // const { fields, handleUpdateState, handleDeviceUserSubmit, setFields } = useDeviceUserForm(initialState)
    const [deviceData, setDeviceData] = useState<any>(initialState)
    const [fieldSets, setFieldSets] = useState(deviceUserFormField)
    const [{users}] = useAtom(devicesDataAtom)

    const handleChangeMultiUser = (e: any, newValue: any) => {
      setDeviceData((prevState: any) => {
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
          if(state.length > 0 && deviceData.client.value !== null && deviceData.client.value.length > 0) {
            const dataTest = state.map((item) => {
              return {
                userId: deviceData.client.value,
                deviceId: item.id
              }
            })
            deviceAPI.deleteUserDevicesMany({
              where: state.map((item) => {
                return {
                  deviceId: item.id
                }
              })
            }).then(() => {
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
            }).catch((err) => {
              console.error("Error", err)
            })
            
          }
      }

    return (
        <Dialog
        title="Обновление клиентов"
        onClose={onClose}
        closeBtn
        className={styles.el}
        >
        <MultiSelectUser
            options={users && users.map((item: any) => {
              return {
                label: item.fullname,
                value: item.id
              }
            })}
            type={"base"}
            label='Клиенты'  
            onChange={handleChangeMultiUser}
            className={styles.field_large}
        />
        {state.length > 0 && <Button onClick={handleSubmit}>Сохранить</Button>}
        </Dialog>
    )
}

export default UpdateUserMany