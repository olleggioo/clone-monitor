import { Dialog, ErrorPopup } from "@/components";
import { IconSave } from "@/icons";
import { Button, CustomSelect, Field, Heading } from "@/ui";
import { ChangeEvent, useState } from "react";
import styles from "./../PoolSettings/PoolSettings.module.scss"
import MultiSelectUser from "@/components/MultiSelect/User";
import { dataProfiles } from "@/blocks/Devices/Action";
import { deviceAPI } from "@/api";
import { useSnackbar } from "notistack";
import { useAtom } from "jotai";
import { modalInfoAtom } from "@/atoms/appDataAtom";

const Disperse = ({id, onClose}: any) => {
    const [sucsess, setSucsess] = useState(false)
    const [state, setState] = useState<{voltage: string | undefined; profile: any}>({
        voltage: undefined,
        profile: {
          label: "Настройки",
          value: null
        }
      })
      const [modalInfo, setModalInfo] = useAtom(modalInfoAtom)
    const {enqueueSnackbar} = useSnackbar()
    const handleSelectChange = (
        name: keyof {voltage: number | null; profile: string | null},
        value: string | null | boolean
      ) => {
        setState((prevState) => {
          return {
            ...prevState,
            [name]: value
          }
        })
      }
    const handleSelectProfileChange = (option: any) => {
        // handleSelectChange('profile', newValue?.value)
        setState((prevState: any) => {
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
        handleSelectChange('voltage', evt.target.value)
    }

    const onSubmitDecrease = () => {
      setSucsess(false)
      if(state.profile.value !== null) {
        const data: any = {
          profile: state.profile.value
        }
        if(state.voltage !== undefined) {
          data.voltage = state.voltage
        }
        deviceAPI.updateManyOverclock({
          where: {
              id
          }
        }, data).then(res => {
          setSucsess(true)
          onClose()
          setModalInfo({
            open: true,
            action: "Разгон устройства",
            status: "Успешно",
            textInAction: "Настройки разгона сохранены"
          })
        })
        .catch(err => {
          setSucsess(false)
          setModalInfo({
            open: true,
            action: "Разгон устройства",
            status: "Ошибка",
            textInAction: "Произошла ошибка при разгоне устройства"
          })
          enqueueSnackbar('Произошла ошибка при разгоне устройства', {
            variant: "error",
            autoHideDuration: 3000
          })
        })
      }
    }
    return (
        <Dialog
          title="Разгон устройства"
          closeBtn
          onClose={onClose}
          className={styles.el}
        >
        <div className={styles.fieldset}>
          <CustomSelect
              label="Настройки"
              options={dataProfiles}  
              onChange={handleSelectProfileChange}
              selectedOption={state.profile}
              className={styles.select}
          />
          <Field
              // defaultValue={decrease.voltage}
              value={state.voltage}
              onChange={handleVoltageChange}
              type="number"
              placeholder="Voltage Range [-20;20]"
          />
        </div>
        <div className={styles.buttons}>
            <Button title="Сохранить" onClick={onSubmitDecrease} className={styles.submit} icon={<IconSave width={22} height={22} />} />
        </div>
        {sucsess && <ErrorPopup isSuccess={sucsess} text="Настройки сохранены." />}
        </Dialog>
    )
}

export default Disperse