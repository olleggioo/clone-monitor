import axios from 'axios'
import { ReqQueryParamsI } from '@/interfaces'

export const axiosLoginInstance = axios.create({
  baseURL: process.env.AUTH_URL
})

export const axiosPostInstance = axios.create({
  baseURL: process.env.API_URL,
  method: 'post',
  headers: { 'Content-Type': 'multipart/form-data' }
})

export const axiosLogInstance = axios.create({
  baseURL: process.env.LOG_URL,
  method: 'post',
  headers: { 'Content-Type': 'multipart/form-data' }
})

export const axiosAuthPostInstance = axios.create({
  baseURL: process.env.AUTH_URL,
  method: 'post',
  headers: { 'Content-Type': 'multipart/form-data' }
})

export const axiosAuthPostInstanceJSON = axios.create({
  baseURL: process.env.AUTH_URL,
  method: 'post',
  headers: { 'Content-Type': 'application/json' }
})

export const axiosAuthPostInstanceUserDevice = axios.create({
  baseURL: process.env.AUTH_URL,
  method: 'post',
  headers: { 'Content-Type': 'application/json' }
})

export const axiosPatchInstance = axios.create({
  baseURL: process.env.API_URL,
  method: 'patch',
  headers: { 'Content-Type': 'multipart/form-data' }
})

export const axiosPatchInstanceJson = axios.create({
  baseURL: process.env.API_URL,
  method: 'patch',
  headers: { 'Content-Type': 'application/json' }
})

export const axiosPatchInstanceJSON = axios.create({
  baseURL: process.env.API_URL,
  method: 'patch',
  headers: { 'Content-Type': 'application/json' }
})

export const axiosLogPatchInstance = axios.create({
  baseURL: process.env.LOG_URL,
  method: 'patch',
  headers: { 'Content-Type': 'multipart/form-data' }
})

export const axiosAuthPatchInstance = axios.create({
  baseURL: process.env.AUTH_URL,
  method: 'patch',
  headers: { 'Content-Type': 'multipart/form-data' }
})

export const axiosDeleteInstance = axios.create({
  baseURL: process.env.API_URL,
  method: 'delete',
  headers: { 'Content-Type': 'multipart/form-data' }
})

export const axiosLogDeleteInstance = axios.create({
  baseURL: process.env.API_URL,
  method: 'delete',
  headers: { 'Content-Type': 'multipart/form-data' }
})

export const axiosAuthDeleteInstance = axios.create({
  baseURL: process.env.AUTH_URL,
  method: 'delete',
  headers: { 'Content-Type': 'multipart/form-data' }
})

export const cancelTokenSource = axios.CancelToken.source();

export const createInstance = (params?: ReqQueryParamsI, cancelToken?: any) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  return axios.create({
    baseURL: process.env.API_URL,
    params: {
      accessToken,
      ...params
    },
    cancelToken: cancelTokenSource.token
  })
}

export const createInstanceWithoutToken = (params?: ReqQueryParamsI, cancelToken?: any) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  return axios.create({
    baseURL: process.env.API_URL,
    params: {
      ...params
    },
  })
}


export const createAuthInstance = (params?: ReqQueryParamsI, cancelToken?: any) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  return axios.create({
    baseURL: process.env.AUTH_URL,
    params: {
      accessToken,
      ...params
    },
    cancelToken: cancelTokenSource.token
  })
}

export const createLogInstance = (params?: ReqQueryParamsI, cancelToken?: any) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  return axios.create({
    baseURL: process.env.LOG_URL,
    params: {
      accessToken,
      ...params
    },
    cancelToken: cancelTokenSource.token
  })
}

export const createLogInstanceWithoutToken = (params?: ReqQueryParamsI, cancelToken?: any) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  return axios.create({
    baseURL: process.env.LOG_URL,
    params: {
      ...params
    },
  })
}

export const createListLogInstance = (params?: ReqQueryParamsI, cancelToken?: any) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  return axios.create({
    baseURL: process.env.LIST_LOG_URL,
    params: {
      accessToken,
      ...params
    },
    cancelToken: cancelTokenSource.token
  })
}