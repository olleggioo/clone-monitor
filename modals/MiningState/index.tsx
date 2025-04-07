import { Dialog } from "@/components"
import { FC, useState } from "react"
import styles from "./MiningState.module.scss"
import { Button, CustomSelect } from "@/ui"
import { IconSave } from "@/icons"
import MultiSelectUser from "@/components/MultiSelect/User"
import { deviceAPI } from "@/api"
import { modalInfoAtom } from "@/atoms/appDataAtom"
import { useAtom } from "jotai"
import styles2 from "./../PoolSettings/PoolSettings.module.scss"

const MiningState: FC<{
    correctState?: any
    state?: any
    onClose?: any
}> = ({onClose, state, correctState}) => {
    const options = [
        {
            label: "Включить",
            value: true
        },
        {
            label: "Выключить",
            value: false
        }
    ]
    const [modalInfo, setModalInfo] = useAtom(modalInfoAtom)
    const [selectedOption, setSelectedOption] = useState({
        label: null,
        value: null
    })
    const onChangeSelect = (e: any, option: any) => {
        setSelectedOption((prevState: any) => {
            return {
                ...prevState,
                label: option.label,
                value: option.value
            }
        })
    }
    const enableDevices = (ids: any) => {
        if(ids && ids.length !== 0) {
            const where: any = []
            ids.map((item: any) => {
                where.push({
                    id: item
                })
            })
            deviceAPI.enableDevice({
                where
            }).then((res) => {
                onClose()
                setModalInfo({
                    open: true,
                    action: "Изменение состояния майнинга",
                    status: "Успешно",
                    textInAction: "Состояние майнинга устройств изменится в течении 30 секунд"
                })
            }).catch(err => {
                setModalInfo({
                    open: true,
                    action: "Изменение состояния майнинга",
                    status: "Ошибка",
                    textInAction: "Произошла ошибка при измении состояния майнгина"
                })
            })
        }
    }

    const enableCorrectDevices = (ids: any) => {
        if(ids && ids.length !== 0) {
            deviceAPI.enableDevice({
                where: ids
            }).then((res) => {
                onClose()
                setModalInfo({
                    open: true,
                    action: "Изменение состояния майнинга",
                    status: "Успешно",
                    textInAction: "Состояние майнинга устройств изменится в течении 30 секунд"
                })
            }).catch(err => {
                setModalInfo({
                    open: true,
                    action: "Изменение состояния майнинга",
                    status: "Ошибка",
                    textInAction: "Произошла ошибка при измении состояния майнгина"
                })
            })
        }
    }
    
    const disableCorrectDevices = (ids: any) => {
        if(ids && ids.length !== 0) {
            deviceAPI.disableDevice({
                where: ids
            }).then((res) => {
                onClose()
                setModalInfo({
                    open: true,
                    action: "Изменение состояния майнинга",
                    status: "Успешно",
                    textInAction: "Состояние майнинга устройств изменится в течении 30 секунд"
                })
            }).catch(err => {
                setModalInfo({
                    open: true,
                    action: "Изменение состояния майнинга",
                    status: "Ошибка",
                    textInAction: "Произошла ошибка при измении состояния майнгина"
                })
            })
        }
    }

    const disableDevices = (ids: any) => {
        if(ids && ids.length !== 0) {
            const where: any = []
            ids.map((item: any) => {
                where.push({
                    id: item
                })
            })
            deviceAPI.disableDevice({
                where
            }).then((res) => {
                onClose()
                setModalInfo({
                    open: true,
                    action: "Изменение состояния майнинга",
                    status: "Успешно",
                    textInAction: "Состояние майнинга устройств изменится в течении 30 секунд"
                })
            }).catch(err => {
                setModalInfo({
                    open: true,
                    action: "Изменение состояния майнинга",
                    status: "Ошибка",
                    textInAction: "Произошла ошибка при измении состояния майнгина"
                })
            })
        }

    }

    const handleSubmit = () => {
        if(state && state.length !== 0) {
            const devicesIds = state.map((item: any) => item.deviceId)
            if(selectedOption.value === true) {
                enableDevices(devicesIds)
            }
            if(selectedOption.value === false) {
                disableDevices(devicesIds)
            }
        } else if(correctState && correctState.length !== 0) {
            if(selectedOption.value === true) {
                enableCorrectDevices(correctState.map((item: any) => ({ id: item.id })))
            }
            if(selectedOption.value === false) {
                disableCorrectDevices(correctState.map((item: any) => ({ id: item.id })))
            }
        }
    }

    return <Dialog
        title="Настройки состояние майнинга"
        closeBtn
        onClose={onClose}
        className={styles.el}
    >
        <div className={styles.fieldset}>
            <MultiSelectUser
                label="Состояние майнинга"
                options={options}
                selectedOption={selectedOption}
                onChange={onChangeSelect}
                className={styles.field_large}
            />
        </div>
        <div className={styles.buttons}>
            <Button title="Сохранить" className={styles2.submit} icon={<IconSave width={22} height={22} />} onClick={handleSubmit} />
        </div>
    </Dialog>
}

export default MiningState