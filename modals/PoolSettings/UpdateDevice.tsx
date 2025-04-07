import { Dialog } from "@/components"
import { Button, CustomSelect, Field } from "@/ui"
import { IconSave } from "@/icons"
import { useEffect, useState } from "react"
import { useAtom } from "jotai"
import { areaRangesIp, devicesUserIdFilterAtom, poolMockAtom } from "@/atoms/appDataAtom"
import { deviceAPI } from "@/api"
import styles from "./../Areas/Areas.module.scss"
import { PolarArea } from "react-chartjs-2"
import { useSnackbar } from "notistack"
import { OptionItemI } from "@/ui/CustomSelect/CustomSelect"
import styles2 from "./PoolSettings.module.scss"
import { setTextRange } from "typescript"

const initialFieldsetState = {
    partNumber: "",
    comment: "",
    isGlued: {
        label: "Подмена",
        value: null
    }
}

const UpdateDevice = ({onClose, setAreas}: any) => {
    const [deviceState, setDeviceState] = useState(initialFieldsetState)
    const [state] = useAtom(devicesUserIdFilterAtom)

    const handleSelectAction = (option: OptionItemI) => {
        setDeviceState((prevState: any) => {
          return {
            ...prevState,
            isGlued: {
                label: option.label,
                value: option.value
            }
          }
        })
    }
    const {enqueueSnackbar} = useSnackbar()

    const onUpdateDevice = () => {
        const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`);
        if (state.length > 0) {
            const data: any = {};
            if (deviceState.isGlued.value !== null) {
                data.isGlued = deviceState.isGlued.value;
            }
            if (deviceState.comment.length !== 0) {
                data.comment = deviceState.comment;
            }
            if(deviceState.partNumber.length !== 0) {
                data.partNumber = deviceState.partNumber;
            }
            console.log("access", data);
    
            const promises = [];
    
            if (data.comment) {
                const requestComment = state.map((item) => ({
                    deviceId: item.id,
                    message: data.comment
                }));
    
                const commentPromise = deviceAPI.createCommentMany(requestComment)
                    .then(() => {
                        enqueueSnackbar("Комментарий сохранен", {
                            variant: "success",
                            autoHideDuration: 3000
                        });
                    })
                    .catch(err => console.error(err));
    
                promises.push(commentPromise);
            }

            if(data.partNumber) {
                const partNumberData = {
                    partNumber: data.partNumber
                }

                const partNumberPromise = deviceAPI.updateManyDevice(
                    { where: state.map(item => ({ id: item.id })) },
                    partNumberData
                ).then(() => {
                    enqueueSnackbar("Сохранения изменены", {
                        variant: "success",
                        autoHideDuration: 3000
                    });
                })
                .catch(err => console.error(err));

                promises.push(partNumberPromise);
            }
    
            if (deviceState.isGlued.value !== null) {
                const gluedData = {
                    isGlued: data.isGlued
                }
                console.log("data", data)
                const updatePromise = deviceAPI.updateManyDevice(
                    { where: state.map(item => ({ id: item.id })) },
                    gluedData
                )
                    .then(() => {
                        enqueueSnackbar("Сохранения изменены", {
                            variant: "success",
                            autoHideDuration: 3000
                        });
                    })
                    .catch(err => console.error(err));
    
                promises.push(updatePromise);
            }

            console.log("promises", promises)
    
            Promise.all(promises)
                .then(() => {
                    onClose();
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000)
                })
                .catch(err => console.error("Error in promises:", err));
        }
    };

    return (
        <Dialog
        title="Обновление устройств"
        onClose={onClose}
        closeBtn
        className={styles.el}
        >
            <Field
                label="Номер поставки"
                value={deviceState.partNumber}
                onChange={(e: any) => setDeviceState((prevState: any) => {
                    return {
                        ...prevState,
                        partNumber: e.target.value
                    }
                })}
            />
            <Field
                label="Комментарий"
                value={deviceState.comment}
                onChange={(e: any) => setDeviceState((prevState: any) => {
                    return {
                        ...prevState,
                        comment: e.target.value
                    }
                })}
            />
            <CustomSelect 
                options={[{label: "Да", value: true}, {label: "Нет", value: false}]}
                placeholder={deviceState.isGlued}
                selectedOption={deviceState.isGlued}
                onChange={handleSelectAction}
            />
        <Button
            title="Сохранить"
            icon={<IconSave width={22} height={22} />}
            onClick={onUpdateDevice}
            disabled={!(deviceState.comment.length !== 0 || deviceState.isGlued.value !== null || deviceState.partNumber.length !== 0)}
            className={styles2.submit}
        />
        </Dialog>
    )
  }

  export default UpdateDevice