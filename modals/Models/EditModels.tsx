import { Dialog } from "@/components"
import { IconSave } from "@/icons"
import { Button, Field } from "@/ui"
import styles from "./Models.module.scss"
import { useEffect, useState } from "react"
import { deviceAPI } from "@/api"
import { useSnackbar } from "notistack"
import { ModelReqI } from "@/containers/Models"
import { useAtom } from "jotai"
import { modelInfoAtom } from "@/atoms/appDataAtom"

const EditModels = ({id, onClose}: any) => {
    const [models, setModels] = useAtom(modelInfoAtom)
    const [editState, setEditState] = useState({nominalEnergy: ""})

    useEffect(() => {
        deviceAPI.getDeviceModelId(id).then((res: any) => {
            setEditState({nominalEnergy: res.nominalEnergy})
        }).catch(err => console.error(err))
    }, [id, setEditState])

    const {enqueueSnackbar} = useSnackbar()
    
    const handleSubmit = () => {
        if(editState.nominalEnergy !== "") {
            deviceAPI.updateModelId(
                id,
                {
                    nominalEnergy: editState.nominalEnergy
                }
            ).then(() => {
                enqueueSnackbar("Энергоэффективность измененена", {
                    autoHideDuration: 3000,
                    variant: "success"
                })
                deviceAPI.getDeviceModel()
                    .then((res: ModelReqI) => setModels(res))
                    .catch(err => console.error(err))
                onClose()
            })
            .catch(error => {
                if (error && error.response && error.response.data) {
                    const errors = error.response.data.message;
                    enqueueSnackbar(errors, {
                        variant: 'error',
                        autoHideDuration: 3000
                    });
                }
            })
        }
    }

    return (
        <Dialog
          title="Редактировать энергоэффективность модели"
          onClose={onClose}
          closeBtn
          className={styles.el}
        >
            <Field 
              label="Энергоэффективность" 
              type="number"
              value={editState.nominalEnergy}
              onChange={(evt: any) => setEditState((prevState: any) => {
                return {
                  ...prevState,
                  nominalEnergy: evt.target.value
                }
              })} 
            />
          <Button
            title="Сохранить"
            icon={<IconSave width={22} height={22} />}
            onClick={handleSubmit}
            // disabled={state.value === editState.name}
            className={styles.submit}
          />
        </Dialog>
      )
}

export default EditModels