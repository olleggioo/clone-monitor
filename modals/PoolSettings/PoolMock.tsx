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

  const PoolMockEditModal = ({state, onClose, setAreas}: any) => {
      const [poolState, setPoolState] = useState(initialFieldsetState)

      useEffect(() => {
      Promise.all([
        deviceAPI.getDevicesPoolMocksId(state)
      ]).then((res: any) => {
        const [mocks] = res; 
        setPoolState((prevState: any) => {
          return {
            ...prevState,
            first: {
              name: mocks?.name,
              url: mocks?.url,
              password: mocks?.password,
            },
            second: {
              url1: mocks?.url1,
              password1: mocks?.password1
            },
            third: {
              url2: mocks?.url2,
              password2: mocks?.password2
            }
          }
        })
      })
    }, [state, setPoolState])
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
      const updateMockPool = () => {
        if(state) {
          const data: {
            name?: string
            url?: string
            password?: string
            url1?: string
            password1?: string
            url2?: string
            password2?: string
          } = {}
          if(poolState.first.name) {
            data.name = poolState.first.name
          }
          if(poolState.first.url) {
            data.url = poolState.first.url
          }
          if(poolState.second.url1) {
            data.url1 = poolState.second.url1
          }
          if(poolState.third.url2) {
            data.url2 = poolState.third.url2
          }
          if(poolState.first.password) {
            data.password = poolState.first.password
          }
          if(poolState.second.password1) {
            data.password1 = poolState.second.password1
          }
          if(poolState.third.password2) {
            data.password2 = poolState.third.password2
          }
          deviceAPI.updateOnePoolMock(state, data).then(res => {
            enqueueSnackbar("Шаблон успешно сохранён", {
              variant: "success",
              autoHideDuration: 3000
            })
            deviceAPI.getDevicesPoolMocks({
              limit: 999
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
      }
      return (
          <Dialog
            title="Редактировать шаблон"
            onClose={onClose}
            closeBtn
            className={styles.el}
          >
              <Field
                label="Название"
                value={poolState.first.name}
                onChange={(evt: any) => handleChange('first', 'name', evt.target.value)}
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
              onClick={updateMockPool}
              // disabled={!canSubmit}
              className={styles2.submit}
            />
          </Dialog>
        )
  }

  export default PoolMockEditModal