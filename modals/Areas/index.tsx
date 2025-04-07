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

const RangesEditModal = ({state, onClose}: any) => {
  const [rangesState, setRangesState] = useState(initialFieldsetState)
  const [initialRanges, setInitialRanges] = useState(initialFieldsetState)
  const [areas, setAreas] = useAtom(areasAtom)
  useEffect(() => {
    Promise.all([
      deviceAPI.getRangeIpById(state)
    ]).then((res: any) => {
      const [ranges] = res; 
      setRangesState((prevState: any) => {
        return {
          ...prevState,
          from: ranges.from,
          to: ranges.to,
          name: ranges.name
        }
      })
      setInitialRanges((prevState: any) => {
        return {
          ...prevState,
          from: ranges.from,
          to: ranges.to,
          name: ranges.name
        }
      })
    })
  }, [state])
  const handleChange = (pool: string, field: string, value: string) => {
    setRangesState((prevState: any) => {
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

  const dateFrom = {
    day: moment().startOf('day').format('YYYY-MM-DD HH:mm'),
    week: moment().subtract(1, 'week').format('YYYY-MM-DD HH:mm'),
    month: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm')
}

const dateNow = moment().format('YYYY-MM-DD HH:mm')

  const {enqueueSnackbar} = useSnackbar()
  const updateRangesIp = () => {
      if(state) {
        const data: {
          name?: string
          from?: string
          to?: string
        } = {}
        if(rangesState.name) {
          data.name = rangesState.name
        }
        if(rangesState.from) {
          data.from = rangesState.from
        }
        if(rangesState.to) {
          data.to = rangesState.to
        }
        deviceAPI.updateOneRangesIp(state, data)
          .then(res => {
            enqueueSnackbar("Диапазон успешно сохранён", {
              variant: "success",
              autoHideDuration: 3000
            })
            deviceAPI.getDevicesArea({
              relations: {
                  rangeips: true
              }
            })
              .then(res => {
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
                          onClose()
                        })
                      .catch(err => console.error(err))
                  })
                  .catch(err => console.error(err))
              }).catch(err => console.error(err))
              }).catch(error => {
            if (error && error.response && error.response.data) {
              const errors = error.response.data.message;
              console.log(errors)
              // errors.forEach((item: string) => {  
                  enqueueSnackbar(errors, {
                      variant: 'error',
                      autoHideDuration: 3000,
                  });
              // });
          }
          })
        }
  }

  return (
      <Dialog
        title="Редактировать диапазон"
        onClose={onClose}
        closeBtn
        className={styles.el}
      >
          <Field
            label="Начальный"
            value={rangesState.from}
            onChange={(evt: any) => setRangesState((prevState: any) => {
              return {
                ...prevState,
                from: evt.target.value
              }
            })}
          />
          <Field 
            label="Конечный" 
            value={rangesState.to}
            onChange={(evt: any) => setRangesState((prevState: any) => {
              return {
                ...prevState,
                to: evt.target.value
              }
            })}  
          />
          <Field 
            label="Название" 
            value={rangesState.name}
            onChange={(evt: any) => setRangesState((prevState: any) => {
              return {
                ...prevState,
                name: evt.target.value
              }
            })} 
          />
        <Button
          title="Сохранить"
          icon={<IconSave width={22} height={22} />}
          onClick={updateRangesIp}
          // disabled={!canSubmit}
          className={styles.submit}
        />
      </Dialog>
    )
}

export default RangesEditModal