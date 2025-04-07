import { Dialog } from "@/components"
import styles from "./Areas.module.scss"
import { Button, Field } from "@/ui"
import { IconSave } from "@/icons"
import { useEffect, useState } from "react"
import { useAtom } from "jotai"
import { areaRangesIp, areasAtom } from "@/atoms/appDataAtom"
import { deviceAPI } from "@/api"
import { useSnackbar } from "notistack"
import getEnergyUnit from "@/helpers/getEnergyUnit"
import moment from "moment"

const initialFieldsetState = {
  from: '',
  to: '',
  name: ''
}

const AreasNameEditModal = ({state, onClose}: any) => {
  const [editState, setEditState] = useState({name: ""})
  const [areas, setAreas] = useAtom(areasAtom)
  useEffect(() => {
    if(state !== undefined && state.value != "") {
        const findValue = areas.filter((item: any) => item.name === state.value)
        Promise.all([
          deviceAPI.getDeviceArea(findValue[0].id)
        ]).then((res: any) => {
          const [ranges] = res; 
          setEditState((prevState: any) => {
            return {
              ...prevState,
              name: ranges.name
            }
          })
        })
    }
  }, [state, setEditState])

  const {enqueueSnackbar} = useSnackbar()

  const dateFrom = {
    day: moment().startOf('day').format('YYYY-MM-DD HH:mm'),
    week: moment().subtract(1, 'week').format('YYYY-MM-DD HH:mm'),
    month: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm')
}

  const dateNow = moment().format('YYYY-MM-DD HH:mm')

  const handleSubmit = () => {
    const findValue = areas.filter((item: any) => item.name === state.value)
    deviceAPI.updateAreaName(findValue[0].id, {
        name: editState.name
    }).then((res) => {
        enqueueSnackbar("Имя изменено", {
            autoHideDuration: 3000,
            variant: "success"
        })
        deviceAPI.getDevicesArea({
          relations: {
              rangeips: true
          }
        }).then((res) => {
          deviceAPI.getDevicesStatus()
          .then((statuses) => {
              const promisesUptime = res.rows.map((item: any) => {
                  return deviceAPI.getDevicesUptimeCacheDayAvg({
                      where: {
                          createdAt: `$Between([\"${dateFrom.day}\",\"${dateNow}\"])`,
                          areaId: item.id
                      },
                  })
              })

              const promisesEnergy = res.rows.map((item: any) => {
                  return deviceAPI.getDevicesEnergyCacheDaySum({
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
                      })
                  }))
              })

              Promise.all([...promises, ...promisesUptime, ...promisesEnergy]) // Объединяем все массивы промисов
                  .then((resPromise: any) => {
                      const statuses = resPromise.slice(0, res.rows.length);
                      const uptime = resPromise.slice(res.rows.length, res.rows.length * 2);
                      const energy = resPromise.slice(res.rows.length * 2); // Последний сегмент относится к promisesEnergy

                      const updatedAreas = res.rows.map((area: any, index: number) => {
                          const [isNormal, isWarning, isNotConfigured, isNotOnline, isError] = statuses[index].map((count: any) => count.total);
                          return {
                              ...area,
                              isNormal,
                              isWarning,
                              isNotConfigured,
                              isNotOnline,
                              isError,
                              uptime: uptime[index], // добавляем uptime в объект area
                              energy: getEnergyUnit(energy[index] / 4) // добавляем energy в объект area
                          };
                      });
                      setAreas(updatedAreas);
                      onClose(false)
                  })
                  .catch(err => console.error(err))
          })
          .catch(err => console.error(err))
        }).catch(err => console.error(err))
    }).catch(error => {
      if (error && error.response && error.response.data) {
        const errors = error.response.data.message;
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
        title="Редактировать название площадки"
        onClose={onClose}
        closeBtn
        className={styles.el}
      >
          <Field 
            label="Название" 
            value={editState.name}
            onChange={(evt: any) => setEditState((prevState: any) => {
              return {
                ...prevState,
                name: evt.target.value
              }
            })} 
          />
        <Button
          title="Сохранить"
          icon={<IconSave width={22} height={22} />}
          onClick={handleSubmit}
          disabled={state.value === editState.name}
          className={styles.submit}
        />
      </Dialog>
    )
}

export default AreasNameEditModal