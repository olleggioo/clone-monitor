import { Dialog, ErrorPopup } from "@/components";
import { IconSave } from "@/icons";
import { Button, CustomSelect, Field, Heading } from "@/ui";
import { ChangeEvent, useEffect, useState } from "react";
import styles from "./../PoolSettings/PoolSettings.module.scss"
import MultiSelectUser from "@/components/MultiSelect/User";
import { dataProfiles } from "@/blocks/Devices/Action";
import { deviceAPI } from "@/api";
import { useSnackbar } from "notistack";
import { useAtom } from "jotai";
import { devicesDataAtom, modalInfoAtom } from "@/atoms/appDataAtom";
import { InputAction } from "react-select";
import MultiSelect from "@/components/MultiSelect";
import Load from "@/components/Load";

export const gluedData = [
    {
        label: "Подмена",
        value: true
    },
    {
        label: "Не подмена",
        value: false
    }
]

const initialDeviceData = {
  sn: '',
  snbp: '',
  comment: '',
  shelf: '',
  rack: '',
  place: '',
  partNumber: '',
  client: {
    label: null,
    value: null
  },
  owner: {
    label: null,
    value: null
  },
  glued: {
    label: null,
    value: null
  }
}

const DeviceEdit = ({id, onClose}: any) => {
    const [sucsess, setSucsess] = useState(false)

    const [loading, setLoading] = useState(true)
    const [{users}] = useAtom(devicesDataAtom)
    const [deviceData, setDeviceData] = useState<any>(initialDeviceData)
    const [defaultDeviceData, setDefaultDeviceData] = useState<any>(initialDeviceData)
    const [success, setSucess] = useState({client: null, device: null})

    console.log("deviceData", deviceData)
    useEffect(() => {
      deviceAPI.getDeviceData(id, {
        relations: {
          userDevices: {
            user: true
          }
        }
      })
        .then((res: any) => {
          setDeviceData((prevState: any) => {
            return {
              ...prevState,
              sn: res.sn,
              snbp: res.snbp,
              shelf: res.shelf,
              rack: res.rack,
              place: res.place,
              partNumber: res.partNumber,
              client: res.userDevices && res.userDevices.length !== 0 ? {
                label: res.userDevices[0]?.user?.fullname,
                value: res.userDevices[0]?.userId
              } : {
                label: null,
                value: null
              },
              owner: res.ownerId ? {
                label: users?.filter((item: any) => item.id === res.ownerId)[0]?.fullname,
                value: res.ownerId
              } : {
                label: null,
                value: null
              },
              glued: res.isGlued ? {
                label: "Подмена",
                value: res.isGlued
              } : {
                label: "Не подмена",
                value: res.isGlued
              }
            }
          })
          setDefaultDeviceData((prevState: any) => {
            return {
              ...prevState,
              sn: res.sn,
              snbp: res.snbp,
              shelf: res.shelf,
              rack: res.rack,
              place: res.rack,
              partNumber: res.partNumber,
              client: res.userDevices && res.userDevices.length !== 0 ? {
                label: res.userDevices[0]?.user?.fullname,
                value: res.userDevices[0]?.userId
              } : {
                label: null,
                value: null
              },
              owner: res.ownerId ? {
                label: users?.filter((item: any) => item.id === res.ownerId)[0]?.fullname,
                value: res.ownerId
              } : {
                label: null,
                value: null
              },
              glued: res.isGlued ? {
                label: "Подмена",
                value: res.isGlued
              } : {
                label: "Не подмена",
                value: res.isGlued
              }
            }
          })
        })
        .catch(err => console.error(err))
        .finally(() => {
          setLoading(false)
        })
    }, [id])

    const [modalInfo, setModalInfo] = useAtom(modalInfoAtom)
    const {enqueueSnackbar} = useSnackbar()
    const handleSnChange = (e: ChangeEvent<HTMLInputElement>) => {
      setDeviceData((prevState: any) => {
        return {
          ...prevState,
          sn: e.target.value
        }
      })
    }

    const handleSnbpChange = (e: ChangeEvent<HTMLInputElement>) => {
      setDeviceData((prevState: any) => {
        return {
          ...prevState,
          snbp: e.target.value
        }
      })
    }

    const handleCommentChange = (e: ChangeEvent<HTMLInputElement>) => {
      setDeviceData((prevState: any) => {
        return {
          ...prevState,
          comment: e.target.value
        }
      })
    }

    const handlePlaceChange = (e: ChangeEvent<HTMLInputElement>) => {
      setDeviceData((prevState: any) => {
        return {
          ...prevState,
          place: e.target.value
        }
      })
    }

    const handlePartNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
      setDeviceData((prevState: any) => {
        return {
          ...prevState,
          partNumber: e.target.value
        }
      })
    }

    const handleShelfChange = (e: ChangeEvent<HTMLInputElement>) => {
      setDeviceData((prevState: any) => {
        return {
          ...prevState,
          shelf: e.target.value
        }
      })
    }

    const handleRackChange = (e: ChangeEvent<HTMLInputElement>) => {
      setDeviceData((prevState: any) => {
        return {
          ...prevState,
          rack: e.target.value
        }
      })
    }

    const handleGluedOptions = (evt: any, option: any) => {
      setDeviceData((prevState: any) => {
        return {
          ...prevState,
          glued: {
            label: option?.label,
            value: option?.value
          }
        }
      })
    }

    const handleClientOptions = (evt: any, option: any) => { 
      setDeviceData((prevState: any) => {
          return {
              ...prevState,
              client: option ? {
                label: option.label,
                value: option.value
              } : {
                label: null,
                value: null
              }
          };
      });
    }

    const handleOwnerOptions = (evt: any, option: any) => {
      setDeviceData((prevState: any) => {
        return {
          ...prevState,
          owner: option ? {
            label: option.label,
            value: option.value
          } : {
            label: null,
            value: null
          }
        }
      })
    }

    const onSubmit = () => {
      const changedFields: any = {};
      for (const key in deviceData) {
        if (deviceData[key] !== defaultDeviceData[key]) {
          if (key === 'client' || key === 'glued' || key === 'owner') {
            if (
              JSON.stringify(deviceData[key]) !== JSON.stringify(defaultDeviceData[key])
            ) {
              changedFields[key] = deviceData[key];
            }
          } else {
            changedFields[key] = deviceData[key];
          }
        }
      }
      if (Object.keys(changedFields).length === 0 && changedFields.constructor === Object) {
        return;
      } else {
        if(changedFields.hasOwnProperty('client')) {
          let userId = changedFields.client.value
          deviceAPI.deleteUserDevicesMany({
            where: {
              deviceId: id
            }
          }).then((res) => {
            console.log("GOOOOOOOOOOO",  userId)
            deviceAPI.createUserDevice({
              deviceId: id,
              userId: userId
          }).then(res => {
            setSucess((prevState: any) => {
              return {
                ...prevState,
                client: true
              }
            })
          })
          .catch(err => {
            setSucess((prevState: any) => {
              return {
                ...prevState,
                client: false
              }
            })
          })
        })
        .catch(err => console.error(err))
        delete changedFields.client
        }
        if (!(Object.keys(changedFields).length == 0 && changedFields.constructor === Object)) {
          const data: any = Object.assign({}, changedFields)
          if('glued' in data) {
            delete data.glued;
            data.isGlued = changedFields.glued.value
          }
          if('owner' in data) {
            delete data.owner;
            data.ownerId = changedFields.owner.value
          }
          console.log("DATA", data, changedFields)
          data.accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
          deviceAPI.updateDevice(id, data)
            .then(res => {
              setSucess((prevState: any) => {
                return {
                  ...prevState,
                  device: true
                }
              })
            }).catch(err => {
              setSucess((prevState: any) => {
                return {
                  ...prevState,
                  device: false
                }
              })
            })
        }
      }
    }

    useEffect(() => {
      if(success.client === true || success.device === true) {
        onClose()
        setModalInfo({
          open: true,
          action: "Обновление устройства",
          status: "Успешно",
          textInAction: "Настройки устройства сохранены. Через 3 секунды страница обновится."
        })
        setTimeout(() => {
          window.location.reload()
        }, 3000)
      }
      if(success.client === false || success.device === false) {
        setModalInfo({
          open: true,
          action: "Обновление устройства",
          status: "Ошибка",
          textInAction: "При обновлении устройства произошла ошибка."
        })
      }
    }, [success])

    // const onSubmitDecrease = () => {
    //   setSucsess(false)
    //   if(state.voltage !== undefined && state.profile.value !== null) {
    //     deviceAPI.updateManyOverclock({
    //       where: {
    //           id
    //       }
    //     }, {
    //       profile: state.profile.value,
    //       voltage: state.voltage
    //     }).then(res => {
    //       setSucsess(true)
    //       onClose()
    //       setModalInfo({
    //         open: true,
    //         action: "Разгон устройства",
    //         status: "Успешно",
    //         textInAction: "Настройки разгона сохранены"
    //       })
    //     })
    //     .catch(err => {
    //       setSucsess(false)
    //       setModalInfo({
    //         open: true,
    //         action: "Разгон устройства",
    //         status: "Ошибка",
    //         textInAction: "Произошла ошибка при разгоне устройства"
    //       })
    //       enqueueSnackbar('Произошла ошибка при разгоне устройства', {
    //         variant: "error",
    //         autoHideDuration: 3000
    //       })
    //     })
    //   }
    // }

    return (
        <Dialog
          title="Обновление устройства"
          closeBtn
          onClose={onClose}
          className={styles.el}
        >
        {!loading
          ? <>
            <div className={styles.fieldset}>
           <Field
              label="Серийный номер"
              // defaultValue={decrease.voltage}
              value={deviceData.sn}
              onChange={handleSnChange}
              type="text"
              placeholder="Серийный номер"
          />
          <Field
            label="Серийный номер БП"
            // defaultValue={decrease.voltage}
            value={deviceData.snbp}
            onChange={handleSnbpChange}
            type="text"
            placeholder="Серийный номер БП"
          />
          <Field
            label="Стойка"
            // defaultValue={decrease.voltage}
            value={deviceData.rack}
            onChange={handleRackChange}
            type="text"
            placeholder="Стойка"
          />
          <Field
            label="Полка"
            // defaultValue={decrease.voltage}
            value={deviceData.shelf}
            onChange={handleShelfChange}
            type="text"
            placeholder="Полка"
          />
          <Field
              label="Место"
              // defaultValue={decrease.voltage}
              value={deviceData.place}
              onChange={handlePlaceChange}
              type="text"
              placeholder="Место"
          />
          <Field
              label="Номер поставки"
              // defaultValue={decrease.voltage}
              value={deviceData.partNumber}
              onChange={handlePartNumberChange}
              type="text"
              placeholder="Номер поставки"
          />
          {/* <MultiSelect
              label="Переклейка"
              items={gluedData}  
              onChange={handleGluedOptions}
              value={deviceData.glued}
              className={styles.select}
          /> */}
          <MultiSelect
              label="Клиент"
              items={users?.map((item: any) => {
                return {
                  label: item.fullname,
                  value: item.id
                }
              })}  
              onChange={handleClientOptions}
              value={deviceData.client}
          />
          <MultiSelect
              label="Владелец"
              items={users?.map((item: any) => {
                return {
                  label: item.fullname,
                  value: item.id
                }
              })}  
              onChange={handleOwnerOptions}
              value={deviceData.owner}
          />
        </div>
        <div className={styles.buttons}>
            <Button 
                className={styles.submit}
                title="Сохранить" 
                onClick={onSubmit} 
                icon={<IconSave width={22} height={22} />} 
            />
        </div>
          </>
          : <Load />
        }
        
        {sucsess && <ErrorPopup isSuccess={sucsess} text="Настройки сохранены." />}
        </Dialog>
    )
}

export default DeviceEdit