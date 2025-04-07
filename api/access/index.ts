import { ReqQueryParamsI } from '@/interfaces'
import { createInstance } from '@/api'

export const getAccess = async (params?: ReqQueryParamsI) => {
  const instance = createInstance(params)
  const res = await instance({
    url: '/access'
  })
  return res.data
}
