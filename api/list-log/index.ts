import { getReqQueryString } from '@/helpers'
import { createInstance, createListLogInstance } from '../instance'
import { ReqQueryParamsI } from '@/interfaces'

export const getLogDevice = async (id: string, params?: ReqQueryParamsI) => {
    const instance = createListLogInstance()
    const query = getReqQueryString(params)
    const res = await instance({
      url: `/device/log/${id}${query}`
    })
    return res.data
}

export const getLogDeviceById = async (id: string) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const instance = createInstance()
  const res = await instance({
    url: `/device/log/${id}`,
    params: {
      accessToken
    }
  })
  return res.data
}