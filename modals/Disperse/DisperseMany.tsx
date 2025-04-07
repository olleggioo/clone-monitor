import { dataProfiles } from "@/blocks/Devices/Action";
import { Dialog, ErrorPopup } from "@/components"
import { Button, CustomSelect, Field } from "@/ui"
import { ChangeEvent, useState } from "react";
import styles from "./../PoolSettings/PoolSettings.module.scss"
import { IconSave } from "@/icons";
import { deviceAPI } from "@/api";
import { devicesUserIdFilterAtom, modalInfoAtom } from "@/atoms/appDataAtom";
import { useAtom } from "jotai";

const DisperseMany = ({
  // state,
  onClose
}:any) => {
    const [decrease, setDecrease] = useState<{voltage: string | undefined; profile: any}>({
        voltage: undefined,
        profile: {
          label: "Настройки",
          value: null
        }
    })
    const [modalInfo, setModalInfo] = useAtom(modalInfoAtom)
    const [sucessDecrese, setSucessDecrese] = useState(false)
    const [state, setState] = useAtom(devicesUserIdFilterAtom)
    // const [state, setState] = useAtom(devicesUserIdFilterAtom)


    const handleSelectProfileChange = (option: any) => {
        // handleSelectChange('profile', newValue?.value)
        setDecrease((prevState: any) => {
          return {
            ...prevState,
            profile: {
              label: option.label,
              value: option.value
            }
          }
        })
    }

    const handleVoltageChange = (evt: ChangeEvent<HTMLInputElement>) => {
        setDecrease((prevState: any) => {
            return {
                ...prevState,
                voltage: evt.target.value
            }
        })
    }

    const onSubmitDecrease = () => {
      if(decrease.profile.value !== null) {
        const data: any = {
          profile: decrease.profile.value
        }
        if(decrease.voltage !== undefined) {
          data.voltage = decrease.voltage
        }
        deviceAPI.updateManyOverclock({
          where: state.map(item => ({ id: item.id }))
        }, data).then(res => {
          setModalInfo({
            open: true,
            action: "Разгон устройств",
            status: "Успешно",
            textInAction: "Настройки разгона устройств сохранены"
          })
            setSucessDecrese(true)
          })
          .catch(err => {
            setModalInfo({
              open: true,
              action: "Разгон устройства",
              status: "Ошибка",
              textInAction: "Произошла ошибка при разгоне устройств"
            })
            console.error(err)
          })
        }
      }

    return (
        <Dialog
          title="Разгон устройств"
          closeBtn
          onClose={onClose}
          className={styles.el}
        >
        <div className={styles.fieldset}>
          <CustomSelect
              label="Настройки"
              options={dataProfiles}  
              onChange={handleSelectProfileChange}
              selectedOption={decrease.profile}
              className={styles.select}
          />
          <Field
              // defaultValue={decrease.voltage}
              value={decrease.voltage}
              onChange={handleVoltageChange}
              type="number"
              placeholder="Voltage Range [-20;20]"
          />
        </div>
        <div className={styles.buttons}>
            <Button title="Сохранить" onClick={onSubmitDecrease} className={styles.submit} icon={<IconSave width={22} height={22} />} />
        </div>
        {/* {sucsess && <ErrorPopup isSuccess={sucsess} text="Настройки сохранены." />} */}
        </Dialog>
    )
}

export default DisperseMany