import { Dashboard, ErrorPopup, Loader } from '@/components'
import { FC, useEffect, useState } from 'react'
import styles from './Form.module.scss'
import { Button } from '@/ui'
import { useDeviceForm } from '@/hooks'
import { IconSave } from '@/icons'
import {
  algorithmPlaceholder,
  clientPlaceholder,
  devicesFormFieldsets,
  FieldsType,
  gluedPlaceholder,
  locationPlaceholder,
  modelPlaceholder,
  statusPlaceholder
} from '@/data/devicesForms'
import FormFieldsets from '../FormFieldsets'
import {
  devicesAlgorithmOptions,
  devicesModelOptions
} from '@/blocks/Devices/data'
import { useRouter } from 'next/router'
import { deviceAPI, userAPI } from '@/api'
import { useSnackbar } from 'notistack'
import { DeviceI } from '@/interfaces'

const initialState = {
  model: modelPlaceholder,
  algorithm: algorithmPlaceholder,
  hashrate: '',
  ip: '',
  mac: '',
  serialNum: '',
  serialNumPower: '',
  location: locationPlaceholder,
  building: '',
  stand: '',
  shelf: '',
  place: '',
  comment: '',
  client: clientPlaceholder,
  id: '',
  status: statusPlaceholder,
  glued: gluedPlaceholder
}

const DeviceEditForm: FC = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const {
    fields,
    handleUpdateState,
    handleChangeInput,
    handleDeviceSubmit,
    handleDeviceUserSubmit,
    updateDeviceUserSubmit,
    getUserDeviceRelations,
    handleChangeSelect,
    setFields
  } = useDeviceForm(initialState)
  const [fieldSets, setFieldSets] = useState(devicesFormFieldsets)
  const [error, setError] = useState('')
  const [deviceDatas, setDeviceDatas] = useState<DeviceI>()
  const [userDevice, setUserDevice] = useState()
  const {enqueueSnackbar} = useSnackbar()
  const handleSubmit = (event: any) => {
    const id = router.query.id

    if (id) {
      handleDeviceSubmit(String(id), deviceDatas, userDevice)
        .then((res) => {
          enqueueSnackbar("Девайс успешно обновлён", {
            variant: "success",
            autoHideDuration: 3000
          })
        })
        .catch((error) => {
          if (error?.response?.data?.message) {
            setError(error.response.data.message)
          } else {
            console.error(error)
          }
        })
    } else {
      handleDeviceSubmit()
    }
  }

  useEffect(() => {
    if (router.query.id) {
      const id = router.query.id as string
      Promise.all([
        deviceAPI.getDeviceData(id, {
          relations: {
            status: true,
            area: true,
            model: true,
            algorithm: true,
            deviceBoards: true,
            devicePools: {pool: true}
            // deviceUsers: {
            //   user: true
            // }
          }
        }),
        deviceAPI.getDevicesArea({
          limit: 100
        }),
        userAPI.getUsers({
          limit: 999
        }),
        deviceAPI.getDevicesAlgorithm(),
        deviceAPI.getDevicesStatus(),
        deviceAPI.getDeviceModel({
          limit: 999
        })
      ])
        .then((res) => {
          const [deviceData, areas, users, algorithms, statuses, models] = res
          setDeviceDatas(deviceData)
          const [device, location, user] = devicesFormFieldsets
          device.fields = device.fields.map((field) => {
            if (field.type === 'select' && field.name === 'location') {
              const selectedArea = deviceData.area || areas.rows[0]
              return {
                ...field,
                value: {
                  label: selectedArea.name,
                  value: selectedArea.id
                },
                options: areas.rows.map((area) => {
                  return {
                    label: area.name,
                    value: area.id
                  }
                })
              } as FieldsType
            } else if (field.type === 'select' && field.name === 'model') {
              const selectedArea = deviceData.model || models.rows[0]
              return {
                ...field,
                value: {
                  label: selectedArea.name,
                  value: selectedArea.id
                },
                options: models.rows.map((area) => {
                  return {
                    label: area.name,
                    value: area.id
                  }
                })
              } as FieldsType
            } else if(field.type === 'select' && field.name === 'algorithm') {
              const selectedArea = deviceData.algorithm || algorithms.rows[0]
              return {
                ...field,
                value: {
                  label: selectedArea.name,
                  value: selectedArea.id
                },
                options: algorithms.rows.map((algorithm) => {
                  return {
                    label: algorithm.name,
                    value: algorithm.id
                  }
                })
              } as FieldsType
            } else if(field.type === 'select' && field.name === 'status') {
              const selectedArea = deviceData.status || statuses.rows[0]
              return {
                ...field,
                value: {
                  label: selectedArea.name,
                  value: selectedArea.id
                },
                options: statuses.rows.map((status) => {
                  return {
                    label: status.name,
                    value: status.id
                  }
                })
              } as FieldsType
            }
            return field
          })
          user.fields = user.fields.map((field) => {
            if (field.type === 'multi-select' && field.name === 'client') {
              const selectedUser = deviceData.userId || users.rows[0]
              return {
                ...field,
                value: {
                  label: users.rows.filter((item: any) => item.id === deviceData.userId)[0]?.fullname || users.rows.filter((item: any) => item.id === deviceData.userId)[0]?.login,
                  value: selectedUser
                },
                options: users.rows.map((userItem: any) => {
                  return {
                    label: userItem?.fullname || userItem?.login,
                    value: userItem.id
                  }
                })
              } as FieldsType
            }
            if(field.type === "select" && field.name === 'glued') {
              const selectGlued = deviceData.isGlued
              return {
                ...field,
                value: {
                  label: selectGlued ? "Подмена" : "Не подмена",
                  value: selectGlued
                },
                options: [
                  {
                    label: "Подмена",
                    value: true
                  },
                  // {
                  //   label: "Не переклеен",
                  //   value: false
                  // },
                ]
              } as FieldsType
            }
            return field
          })

          setFieldSets([device, location, user])
          setFields((prev) => ({
            ...prev,
            id: deviceData?.deviceUsers ? deviceData.deviceUsers[0].id : '',
            model: deviceData.model
              ? { label: deviceData.model.name, value: deviceData.model.id }
              : devicesModelOptions[0],
            algorithm: deviceData.algorithm
            ? { label: deviceData.algorithm.name, value: deviceData.algorithm.id }
            : devicesModelOptions[0],
            hashrate: deviceData.nominalHashrate || '',
            ip: deviceData.ipaddr,
            mac: deviceData.macaddr || '',
            serialNum: deviceData.sn || '',
            serialNumPower: deviceData.snbp || '',
            location: deviceData.area
              ? { label: deviceData.area.name, value: deviceData.area.id }
              : prev.location,
            building: deviceData.location || '',
            stand: deviceData.rack || '',
            shelf: deviceData.shelf || '',
            place: deviceData.place || '',
            comment: deviceData.comment || '',
            glued: {label: deviceData.isGlued ? "Подмена" : "Не перклеен", value: deviceData.isGlued},
            status: deviceData.status
            ? { label: deviceData.status.name, value: deviceData.status.id }
            : devicesModelOptions[0], 
            client: deviceData.userId !== ""
              ? {
                  label: users.rows.filter((item: any) => item.id === deviceData.userId)[0]?.fullname !== undefined 
                  ? (users.rows.filter((item: any) => item.id === deviceData.userId)[0]?.fullname ||
                  users.rows.filter((item: any) => item.id === deviceData.userId)[0]?.email) : "Не существующий пользователь",
                  value: users.rows.filter((item: any) => item.id === deviceData.userId)[0]?.fullname !== undefined ? 
                  deviceData.userId : null
                }
              : prev.client
          }))
            deviceAPI.getUserDevice({
              where: {
                deviceId: id,
                userId: deviceData?.userId || null,
              }
            }).then(res => setUserDevice(res.rows))
        })
        .catch(console.error)
        .finally(() => {
          setLoading(false)
        })
    }
  }, [router.query.id])

  return loading ? (
    <Loader />
  ) : (
    <Dashboard>
      <FormFieldsets
        fields={fieldSets}
        values={fields}
        handleChangeInput={handleChangeInput}
        handleUpdateState={handleUpdateState}
      />

      <div className={styles.actions}>
        <Button
          title="Сохранить"
          icon={<IconSave width={22} height={22} />}
          onClick={handleSubmit}
          className={styles.btn}
        />

        <Button
          title="Отмена"
          appearance="outlined-dark"
          onClick={() => router.back()}
          className={styles.btn}
        />
      </div>
      {!!error && <ErrorPopup text={error} />}
    </Dashboard>
  )
}
export default DeviceEditForm
