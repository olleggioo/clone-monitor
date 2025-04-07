import { OptionItemI } from '@/ui/CustomSelect/CustomSelect'
import { ChangeEvent, useState } from 'react'
import { deviceAPI, userAPI } from '@/api'
import { CreateDeviceFieldsI, DeviceI } from '@/interfaces'

export type DevicesFormValues = Record<string, any>

const useDeviceForm = (initialState: DevicesFormValues) => {
  const [fields, setFields] = useState<DevicesFormValues>(initialState)

  const handleUpdateState = (key: string, value: string | OptionItemI) => {
    setFields((prev) => ({
      ...prev,
      [key]: value
    }))
  }

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    handleUpdateState(e.target.id, e.target.value)
  }

  const handleChangeSelect = (e: any) => {
    handleUpdateState(e.label, e.value)
  }

  const handleDeviceSubmit = async (id?: string, deviceDatas?: DeviceI, userDevice?: any) => {
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
      building,
      stand,
      shelf,
      place,
      comment,
      glued
    } = fields
    const data: CreateDeviceFieldsI = {
      accessToken: localStorage.getItem(`${process.env.API_URL}_accessToken`),
      modelId: model.value,
      algorithmId: algorithm.value,
      ipaddr: ip,
      isGlued: glued.value
    }

    if (location.value !== null) {
      data.areaId = location.value
    }
    // if (mac) {
      data.macaddr = mac
    // }
    // if (serialNum) {
      data.sn = serialNum
    // }
    // if (serialNumPower) {
      data.snbp = serialNumPower
    // }
    // if (hashrate) {
      data.nominalHashrate = Number(hashrate)
    // }
    // if (building) {
      data.location = building
    // }
    // if (stand) {
      data.rack = stand
    // }
    // if (shelf) {
      data.shelf = shelf
    // }
    // if (place) {
    //   data.place = place
    // }
    // if (comment) {
      data.comment = comment
    // }
    if(client) {
      data.userId = client.value
    }
    if(data.modelId === deviceDatas?.modelId &&
      data.algorithmId === deviceDatas?.algorithm.id &&
      data.ipaddr === deviceDatas.ipaddr &&
      data.areaId === deviceDatas.areaId &&
      data.macaddr === deviceDatas.macaddr &&
      data.sn === deviceDatas.sn &&
      data.snbp === deviceDatas.snbp &&
      data.nominalHashrate === deviceDatas.nominalHashrate &&
      data.location === deviceDatas.location &&
      data.rack === deviceDatas.rack &&
      data.shelf === deviceDatas.shelf && 
      data.comment === deviceDatas.comment &&
      data.isGlued === deviceDatas.isGlued &&
      data.userId !== deviceDatas.userId) {
        if(id) {
          return deviceAPI.createUserDevice({
            deviceId: id,
            userId: client.value
          })
        }
    } else if (
      data.modelId !== deviceDatas?.modelId ||
      data.algorithmId !== deviceDatas?.algorithm.id ||
      data.ipaddr !== deviceDatas.ipaddr ||
      data.areaId !== deviceDatas.areaId ||
      data.macaddr !== deviceDatas.macaddr ||
      data.sn !== deviceDatas.sn ||
      data.snbp !== deviceDatas.snbp ||
      data.nominalHashrate !== deviceDatas.nominalHashrate ||
      data.location !== deviceDatas.location ||
      data.rack !== deviceDatas.rack ||
      data.shelf !== deviceDatas.shelf || 
      data.isGlued !== deviceDatas.isGlued ||
      data.comment !== deviceDatas.comment
    ) {
      if(id) {
        if(data.userId !== deviceDatas?.userId) {
          deviceAPI.createUserDevice({
            deviceId: id,
            userId: client.value
          })
        }
        delete data.userId
        return await deviceAPI.updateDevice(id, data)

      }
    }
    // if (id) {
    //   delete data.userId
    //   return await deviceAPI.updateDevice(id, data)
    // } else {
    //   return await deviceAPI.createDevice(data)
    // }
  }
  const handleDeviceUserSubmit = async (deviceId?: string, userId?: string) => {
    const data: any = {
      userId: userId,
      deviceId: deviceId,
    }
    return await deviceAPI.createUserDevice(data)
  }

  const getUserDeviceRelations = async(params: any) => {
    return userAPI.getUserDeviceId(params)
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
      return await deviceAPI.createUserDevice(data)
    }
  }

  return {
    fields,
    handleUpdateState,
    handleChangeInput,
    handleDeviceSubmit,
    handleDeviceUserSubmit,
    updateDeviceUserSubmit,
    handleChangeSelect,
    getUserDeviceRelations,
    setFields
  }
}

export const useDeviceUserForm = (initialState: any) => {
  const [fields, setFields] = useState<any>(initialState)

  const handleUpdateState = (key: string, value: string | OptionItemI) => {
    setFields((prev: any) => ({
      ...prev,
      [key]: value
    }))
  }

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    handleUpdateState(e.target.id, e.target.value)
  }

  const handleDeviceUserSubmit = async (id?: string) => {
    const {
      client,
    } = fields
    const data: any = {
      userId: client.value,
      deviceId: id,
    }
    if(!!client.value) {
      return await deviceAPI.createUserDevice(data)
    }
  }

  return {
    fields,
    handleUpdateState,
    handleChangeInput,
    // handleDeviceSubmit,
    handleDeviceUserSubmit,
    // updateDeviceUserSubmit,
    setFields
  }
}

export default useDeviceForm
 