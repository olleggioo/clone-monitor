import { Dialog } from "@/components"
import { Button, Field } from "@/ui"
import { IconSave } from "@/icons"
import { useEffect, useState } from "react"
import { useAtom } from "jotai"
import { areaRangesIp, poolMockAtom } from "@/atoms/appDataAtom"
import { deviceAPI } from "@/api"
import styles from "./../Areas/Areas.module.scss"
import { PolarArea } from "react-chartjs-2"
import { useSnackbar } from "notistack"
import styles2 from "./PoolSettings.module.scss"

const initialFieldsetState = {
  first: {
    name: '',
    url: '',
    password: ''
  },
  second: {
    url1: '',
    password1: ''
  },
  third: {
    url2: '',
    password2: ''
  }
}

  const PoolMockAddModal = ({onClose, setAreas}: any) => {
    const [poolState, setPoolState] = useState(initialFieldsetState)

    const handleChange = (pool: string, field: string, value: string) => {
      setPoolState((prevState: any) => {
        const fieldsetState = prevState[pool]

        if (!!fieldsetState) {
          return {
            ...prevState,
            [pool]: {
              ...fieldsetState,
              [field]: value
            }
          }
        }
        return prevState
      })
    }
      const {enqueueSnackbar} = useSnackbar()
      const createMockPool = () => {
          const data: {
            name: string
            url: string
            password: string
            url1?: string
            password1?: string
            url2?: string
            password2?: string
          } = {
            name: poolState.first.name,
            url: poolState.first.url,
            password: poolState.first.password,
          }
          if(poolState.second.url1) {
            data.url1 = poolState.second.url1
          }
          if(poolState.third.url2) {
            data.url2 = poolState.third.url2
          }
          if(poolState.second.password1) {
            data.password1 = poolState.second.password1
          }
          if(poolState.third.password2) {
            data.password2 = poolState.third.password2
          }
          deviceAPI.createOnePoolMock(data).then(res => {
            enqueueSnackbar("Шаблон успешно создан", {
              variant: "success",
              autoHideDuration: 3000
            })
            deviceAPI.getDevicesPoolMocks({
              limit: 999,
              order: {
                name: "ASC"
            }
          }).then(res => {
              setAreas(res.rows)
              onClose()
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
      }
      return (
          <Dialog
            title="Добавление шаблона"
            onClose={onClose}
            closeBtn
            className={styles.el}
          >
            <Field
                label="Название"
                value={poolState.first.name}
                onChange={(evt) => handleChange('first', 'name', evt.target.value)}
              />
              <Field label="Url 1" value={poolState.first.url} onChange={(evt) => handleChange('first', 'url', evt.target.value)} />
              <Field label="Password 1" value={poolState.first.password} onChange={(evt) => handleChange('first','password', evt.target.value)} />
              <Field label="Url 2" value={poolState.second.url1} onChange={(evt) => handleChange('second','url1', evt.target.value)} />
              <Field label="Password 2" value={poolState.second.password1} onChange={(evt) => handleChange('second','password1', evt.target.value)} />
              <Field label="Url 3" value={poolState.third.url2} onChange={(evt) => handleChange('third','url2', evt.target.value)} />
              <Field label="Password 3" value={poolState.third.password2} onChange={(evt) => handleChange('third','password2', evt.target.value)} />
            <Button
              title="Сохранить"
              icon={<IconSave width={22} height={22} />}
              onClick={createMockPool}
              // disabled={!canSubmit}
              className={styles2.submit}
            />
          </Dialog>
        )
  }

  export default PoolMockAddModal