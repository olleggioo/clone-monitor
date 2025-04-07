import { Dialog, ErrorPopup } from "@/components";
import { IconSave, IconTrash } from "@/icons";
import { Button, CustomSelect, Field, Heading } from "@/ui";
import { ChangeEvent, useEffect, useState } from "react";
import styles from "./../PoolSettings/PoolSettings.module.scss"
import MultiSelectUser from "@/components/MultiSelect/User";
import { dataProfiles } from "@/blocks/Devices/Action";
import { deviceAPI } from "@/api";
import { useSnackbar } from "notistack";
import { useAtom } from "jotai";
import { modalInfoAtom } from "@/atoms/appDataAtom";

interface DeviceI {
    id: string
}

interface FoundDevice {
    rows: DeviceI[],
    total: number
}

const Replacement = ({id, onClose}: any) => {
    const [sucsess, setSucsess] = useState(false)
    const [state, setState] = useState<string>("")
    const [foundId, setFoundId] = useState<FoundDevice | null>(null)
    const [isGlued, setIsGlued] = useState<boolean | null>(null)

    useEffect(() => {
        if(id) {
            deviceAPI.getDeviceData(id)
                .then((res: any) => {
                    if(res.replacedDeviceId.length !== 0) {
                        deviceAPI.getDeviceData(res.replacedDeviceId)   
                            .then((secRes: any) => {
                                setState(secRes.macaddr)
                            })
                            .catch((err) => console.error(err))
                    }
                    setIsGlued(res.isGlued)
                }).catch((err) => console.error(err))
        }
    }, [id])

    const [modalInfo, setModalInfo] = useAtom(modalInfoAtom)
    const {enqueueSnackbar} = useSnackbar()

    const handleChange = (e: any) => {
        setState(e.target.value)
    }

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (state) {
                console.log("Search for device with MAC address:", state);
                deviceAPI.getDevices({
                    where: {
                        macaddr: state
                    }
                }).then((res: any) => {
                    console.log("Result searching...", res)
                    setFoundId(res)
                }).catch((err) => console.error(err))
            } else {
                setFoundId({
                    rows: [],
                    total: 0
                })
            }
        }, 1000);

        return () => clearTimeout(delayDebounceFn);
    }, [state]);

    const onSubmitReplace = () => {
        if(state.length !== 0 && foundId && foundId?.rows && foundId.rows.length !== 0) {
            const data: any = {
                accessToken: localStorage.getItem(`${process.env.API_URL}_accessToken`),
                replacedDeviceId: foundId.rows[0]?.id,
                isGlued: true
            }
            deviceAPI.updateDevice(id, data).then((res) => {
                onClose()
                setModalInfo({
                  open: true,
                  action: "Подмена",
                  status: "Успешно",
                  textInAction: "Настройки устройства сохранены. Через 3 секунды страница обновится."
                })
                setTimeout(() => {
                    window.location.reload()
                }, 3000)
            }).catch((err) => {
                onClose()
                setModalInfo({
                    open: true,
                    action: "Подмена",
                    status: "Ошибка",
                    textInAction: "При обновлении устройства произошла ошибка."
                })
            })
        }
    }

    const onDeleteReplace = () => {
        const data: any = {
            accessToken: localStorage.getItem(`${process.env.API_URL}_accessToken`),
            replacedDeviceId: "",
            isGlued: false
        }
        deviceAPI.updateDevice(id, data).then((res) => {
            onClose()
            setModalInfo({
              open: true,
              action: "Удаление подмены",
              status: "Успешно",
              textInAction: "Настройки устройства сохранены. Через 3 секунды страница обновится."
            })
            setTimeout(() => {
                window.location.reload()
            }, 3000)
        }).catch((err) => {
            onClose()
            setModalInfo({
                open: true,
                action: "Удаление подмены",
                status: "Ошибка",
                textInAction: "При обновлении устройства произошла ошибка."
            })
        })
    }

    return (
        <Dialog
          title="Подмена"
          closeBtn
          onClose={onClose}
          className={styles.el}
        >
        <div className={styles.fieldset}>
          <Field
              // defaultValue={decrease.voltage}
              value={state}
              onChange={handleChange}
            //   type="string"
              placeholder="MAC-адрес"
          />
        </div>
        {foundId && foundId?.rows && foundId.rows.length !== 0 
            ? <p className={styles.founding}>Устройство найдено</p>
            : <p className={styles.error}>Нет подходящих устройств</p>
        }
        <div className={styles.buttons}>
            <Button 
                title="Сохранить" 
                onClick={onSubmitReplace} 
                disabled={foundId && foundId?.rows && foundId.rows.length !== 0 && state.length !== 0 ? false : true}
                className={styles.submit} 
                icon={<IconSave width={22} height={22} />} 
            />
            {isGlued !== null && isGlued === true && state.length !== 0 && foundId && foundId?.rows && foundId.rows.length !== 0
                && <Button 
                    title="Удалить подмену" 
                    onClick={onDeleteReplace} 
                    // disabled={foundId && foundId?.rows && foundId.rows.length !== 0 && state.length !== 0 ? false : true}
                    className={styles.submit} 
                    icon={<IconTrash width={22} height={22} />} 
                />
            }
        </div>
        {sucsess && <ErrorPopup isSuccess={sucsess} text="Настройки сохранены." />}
        </Dialog>
    )
}

export default Replacement