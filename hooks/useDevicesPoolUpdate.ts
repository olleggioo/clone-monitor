import { deviceAPI } from "@/api"
import { OptionItemI } from "@/ui/CustomSelect/CustomSelect"
import { ChangeEvent, useState } from "react"

const useDevicesPoolUpdate = (initialState: any) => {
    const [fields, setFields] = useState<any>(initialState)
    const handleUpdateState = (key: string, value: string | OptionItemI) => {
      setFields((prev: any) => ({
        ...prev,
        [key]: value
      }))
    }

    const onBlurChange = (e: any) => {
      if(fields.worker1 !== "" && fields.worker2 === "" && fields.worker3 === "") {
        handleUpdateState('worker2', fields.worker1)
        handleUpdateState('worker3', fields.worker1)
      } 
      if(fields.password1 !== "" && fields.password2 === "" && fields.password3 === "") {
        handleUpdateState('password2', fields.password1)
        handleUpdateState('password3', fields.password1)

      }
    }
  
    const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
      handleUpdateState(e.target.id, e.target.value)
    }

  
    const handleDeviceSubmit = async (id?: string) => {
      
    }
    const handleDeviceUserSubmit = async (deviceId?: string, userId?: string) => {
      const data: any = {
        userId: userId,
        deviceId: deviceId,
      }
    //   return await deviceAPI.createDeviceUser(data)
    }
  
    const updateDeviceUserSubmit = async(id?: string) => {
      const {
        model,
        algorithm,
        client,
        location,
        hashrate,
        ip,
        mac,
        serialNum,
        serialNumPower,
        sn,
        snbp,
        status
      } = fields
      const data: any = {
        userId: client.value,
        deviceId: id,
        modelId: model.value,
        algorithmId: algorithm.value,
        ipaddr: ip,
        macaddr: mac,
        sn: "SN",
        snbp: "SN",
        areaId: location.value,
        statusId: status.value
      }
      if(sn) {
        data["sn"] = sn
      }
      if(snbp) {
        data["snbp"] = snbp
      }
      if(!!client.value) {
        // return await deviceAPI.createDeviceUser(data)
      }
    }
  
    return {
      fields,
      handleUpdateState,
      handleChangeInput,
      handleDeviceSubmit,
      handleDeviceUserSubmit,
      updateDeviceUserSubmit,
      setFields,
      onBlurChange
    }
  }

  
export default useDevicesPoolUpdate