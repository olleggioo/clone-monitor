import { Dashboard, ErrorPopup } from '@/components'
import { FC, useEffect, useState } from 'react'
import styles from './Form.module.scss'
import { Button } from '@/ui'
import { useDeviceForm } from '@/hooks'
import { IconPlus } from '@/icons'
import {
  clientPlaceholder,
  devicesFormFieldsets,
  FieldsType,
  locationPlaceholder
} from '@/data/devicesForms'
import FormFieldsets from '../FormFieldsets'
import { deviceAPI, userAPI } from '@/api'
import {
  devicesAlgorithmOptions,
  devicesModelOptions
} from '@/blocks/Devices/data'
import { useRouter } from 'next/router'

const initialState = {
  model: devicesModelOptions[0],
  algorithm: devicesAlgorithmOptions[0],
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
  client: clientPlaceholder
}

const DeviceAddForm: FC = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const { fields, handleUpdateState, handleChangeInput, handleDeviceSubmit, handleDeviceUserSubmit } =
    useDeviceForm(initialState)
  const [fieldSets, setFieldSets] = useState(devicesFormFieldsets)
  const [error, setError] = useState('')

  const handleSubmit = () => {
    setLoading(true)
    handleDeviceSubmit()
      .then((res) => {
        handleDeviceUserSubmit(res.id)
          .then((res) => {
          })
      })
      .catch((error) => {
        if (error.response.data.message) {
          setError(error.response.data.message)
        } else {
          console.error(error)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    Promise.all([
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
        const [areas, users, algorithms, statuses, models] = res
          const [device, location, user, algorithm, model, status] = devicesFormFieldsets
          device.fields = device.fields.map((field) => {
            if (field.type === 'select' && field.name === 'location') {
              const selectedArea = areas.rows[0]
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
              const selectedArea = models.rows[0]
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
              const selectedArea = algorithms.rows[0]
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
              const selectedArea = statuses.rows[0]
              return {
                ...field,
                value: {
                  label: selectedArea.color,
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
            if (field.type === 'select' && field.name === 'client') {
              const selectedUser = users.rows[0]
              return {
                ...field,
                value: {
                  label: selectedUser.fullname,
                  value: selectedUser.id
                },
                options: users.rows.map((userItem: any) => {
                  return {
                    label: userItem?.fullname || userItem?.login,
                    value: userItem.id
                  }
                })
              } as FieldsType
            }
            return field
        })
        setFieldSets([device, location, user])
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false)
      })
  }, [])
  return (
    <Dashboard>
      <FormFieldsets
        fields={fieldSets}
        values={fields}
        handleChangeInput={handleChangeInput}
        handleUpdateState={handleUpdateState}
      />

      <div className={styles.actions}>
        <Button
          title="Добавить"
          icon={<IconPlus width={22} height={22} />}
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
export default DeviceAddForm
