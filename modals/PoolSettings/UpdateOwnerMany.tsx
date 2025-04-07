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

const UpdateOwnerMany = ({onClose, setAreas}: any) => {
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
            deviceAPI.updateDeviceMany({
              where: state.map(item => ({ id: item.id }))
            },
            {
              // accessToken: localStorage.getItem(`${process.env.API_URL}_accessToken`),
              ownerId: deviceData.client.value
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

    return (
        <Dialog
        title="Обновление владельцев"
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
            label='Владельцы'  
            onChange={handleChangeMultiUser}
            className={styles.field_large}
        />
        {state.length > 0 && <Button onClick={handleSubmit}>Сохранить</Button>}
        </Dialog>
    )
}

export default UpdateOwnerMany