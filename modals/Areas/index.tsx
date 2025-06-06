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
import { hasAccess } from "@/helpers/AccessControl"
import { requestsAccessMap } from "@/helpers/componentAccessMap"
import { emptyValues } from "@/containers/Areas"

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
        const data: any = {}
        console.log("rangesState", rangesState.name !== initialRanges.name, rangesState.from !== initialRanges.from)
        if(rangesState.name && rangesState.name !== initialRanges.name) {
          data.name = rangesState.name
        }
        if(rangesState.from && rangesState.from !== initialRanges.from) {
          data.from = rangesState.from
        }
        if(rangesState.to && rangesState.to !== initialRanges.to) {
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
              .then((anRes) => {
                const emptyUpdates = anRes.rows.map((area, index) => {
                  return {
                    ...area,
                    ...emptyValues
                  };
                })
                setAreas(emptyUpdates)
                return anRes;
              })
              .then(res => {
                if(hasAccess(requestsAccessMap.getDevicesStatus)) {
                  deviceAPI.getDevicesStatus({
                      where: {
                          id: `$Not($In(["1eda7201-913e-11ef-8367-bc2411b3fd76"]))`
                      }
                  })
                    .then((statusess) => {
        
                      const promisesEnergy = res.rows.map((item: any) => {
                          return deviceAPI.getDevicesEnergySumDay({
                              where: {
                                  createdAt: `$Between([\"${dateFrom.day}\",\"${dateNow}\"])`,
                                  areaId: item.id
                              },
                          })
                      })
      
                      const promises = res.rows.map((item: any) => {
                          return Promise.all(statusess.rows.map((row: any) => {
                              return deviceAPI.getDevicesStatusCount({
                                  where: { statusId: row.id, areaId: item.id }
                              }).then(count => ({ statusId: row.id, count: count.total }))
                          }))
                      })
        
                      Promise.all([...promises, ...promisesEnergy]) // Объединяем все массивы промисов
                        .then((resPromise: any) => {
                          const statuses = resPromise.slice(0, res.rows.length);
                          console.log("statuses", statuses, resPromise)
                          const oldStatuses = {
                              ...statusess.rows,
                              statuses
                          }
                          const energy = resPromise.slice(res.rows.length, res.rows.length * 2);
                          // const energy = resPromise.slice(res.rows.length * 2); // Последний сегмент относится к promisesEnergy
                          const updatedAreas = res.rows.map((area: any, index: number) => {
                            const statusOrder = {
                                isNormal: 0,
                                isWarning: 0,
                                isRepair: 0,
                                isNotOnline: 0,
                                isError: 0,
                                // isArchived: 0
                            };
                            statuses[index].forEach((status: any) => {
                              switch (status.statusId) {
                                case '82cddea0-861f-11ee-932b-300505de684f':
                                  statusOrder.isNormal = status.count;
                                  break;
                                case '82cde049-861f-11ee-932b-300505de684f':
                                  statusOrder.isWarning = status.count;
                                  break;
                                case '9a8471f1-861f-11ee-932b-300505de684f':
                                  statusOrder.isNotOnline = status.count;
                                  break;
                                case '9a847375-861f-11ee-932b-300505de684f':
                                  statusOrder.isError = status.count;
                                  break;
                                // case '1eda7201-913e-11ef-8367-bc2411b3fd76':
                                //     statusOrder.isArchived = status.count;
                                //     break;
                                case 'dc434af8-8f45-11ef-8367-bc2411b3fd76':
                                  statusOrder.isRepair = status.count;
                                  break;
                                default:
                                  break;
                                }
                          })
        
                          const sumEnergy = energy[index].reduce((prev: any, curr: any) => prev + Number(curr.value), 0) || 0
                            return {
                                ...area,
                                ...statusOrder,
                                uptime: "0",
                                energy: getEnergyUnit(sumEnergy)
                            };
                          });
                            setAreas(updatedAreas);
                          })
                        .catch(err => {
                          onClose()
                          console.error(err)
                        })
                      })
                  .catch(err => {
                    onClose()
                    console.error(err)
                  })
                }
              })
              .catch(err => {
                onClose()
              })
            })
            .catch(err => {
              onClose()
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