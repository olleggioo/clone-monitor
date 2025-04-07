import {
  axiosAuthPostInstance,
  axiosAuthPatchInstance,
  axiosAuthDeleteInstance,
  createAuthInstance,
  axiosPatchInstanceJSON
} from '@/api'
import {
  CreateUserReqParamsI,
  LoginUserReqParamsI,
  LoginUserResI,
  RefreshUserReqParamsI,
  UpdateUserReqParamsI,
  UsersResI,
  ReqQueryParamsI,
  UpdateUserPasswordReqParamsI
} from '@/interfaces'
import { getReqQueryString } from '@/helpers'

export const createUser = async (data: CreateUserReqParamsI) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const formData = new FormData()

  formData.append('accessToken', accessToken || '')

  Object.entries(data).forEach((entry) => {
    formData.append(entry[0], entry[1])
  })

  const res = await axiosAuthPostInstance({
    url: '/user',
    data: formData
  })
  return res.data
}

export const loginUser = async (params: LoginUserReqParamsI) => {
  const formData = new FormData()
  formData.append('login', params.login)
  formData.append('password', params.password)

  const res = await axiosAuthPostInstance<LoginUserResI>({
    url: '/user/login',
    data: formData
  })
  return res.data
}

export const verifyUser = async (verifyKey: string) => {
  const formData = new FormData()
  formData.append('verifyKey', verifyKey)
  const res = await axiosAuthPostInstance({
    url: '/user/verify',
    data: formData
  })
  return res.data
}

export const refreshUser = async (
  params: RefreshUserReqParamsI,
  config: { signal?: AbortSignal } = {}
) => {
  const formData = new FormData()
  formData.append('accessToken', params.accessToken)
  formData.append('refreshToken', params.refreshToken)

  const res = await axiosAuthPostInstance<LoginUserResI>({
    url: `/user/refresh`,
    data: formData,
    ...config
  })
  return res.data
}

export const logoutUser = async (
  params: RefreshUserReqParamsI,
) => {
  const formData = new FormData()
  formData.append('accessToken', params.accessToken)
  formData.append('refreshToken', params.refreshToken)

  const res = await axiosAuthPostInstance<LoginUserResI>({
    url: `/user/logout`,
    data: formData,
  })
  return res.data
}

export const updateUser = async (id: string, data: UpdateUserReqParamsI) => {
  const formData = new FormData()
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  formData.append('accessToken', accessToken || '')

  Object.entries(data).forEach((entry) => {
    formData.append(entry[0], entry[1])
  })

  const res = await axiosAuthPatchInstance({
    url: `/user/${id}`,
    data: formData
  })
  return res.data
}

export const updateUserPassword = async (id: string, data: UpdateUserPasswordReqParamsI) => {
  const formData = new FormData()
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  formData.append('accessToken', accessToken || '')

  Object.entries(data).forEach((entry) => {
    formData.append(entry[0], entry[1])
  })

  const res = await axiosAuthPatchInstance({
    url: `/user/password/${id}`,
    data: formData
  })
  return res.data
}

export const deleteUser = async (id: string) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)

  const res = await axiosAuthDeleteInstance({
    url: `/user/${id}`,
    params: {
      accessToken: accessToken || ''
    }
  })
  return res.data
}

export const deleteManyUsers = async (params?: ReqQueryParamsI) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const query = getReqQueryString(params)
  const res = await axiosAuthDeleteInstance({
    url: `/user/${query}`,
    params: {
      accessToken: accessToken || ''
    }
  })
  return res.data
}

export const getUsers = async (params?: ReqQueryParamsI) => {
  const instance = createAuthInstance()
  const query = getReqQueryString(params)
  const res = await instance({
    url: `/user${query}`,
    
  })
  return res.data
}

export const getUserId = async (id?: string, params?: ReqQueryParamsI) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const instance = createAuthInstance()
  const query = getReqQueryString(params)
  const res = await instance({
    url: `/user/${id}${query}`,
    params: {
      accessToken: accessToken || ''
    }
  })
  return res.data
}

export const getUsersRole = async (params?: ReqQueryParamsI) => {
  const instance = createAuthInstance()
  const query = getReqQueryString(params)
  const res = await instance({
    url: `/role${query}`
  })
  return res.data
}

export const createRole = async (data: {
  name: string,
  isTeam: any
}) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const formData = new FormData()
  formData.append('accessToken', accessToken || '')
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value)
  })

  const res = await axiosAuthPostInstance({
    url: '/role',
    params: {
      accessToken: accessToken || ''
    },
    data: formData
  })
  return res.data
}

export const deleteRoleById = async (id: string) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)

  const res = await axiosAuthDeleteInstance({
    url: `/role/${id}`,
    params: {
      accessToken: accessToken || ''
    }
  })
  return res.data
}

export const updateRoleById = async (id: string, data: {
  name?: string,
  isTeam?: boolean
}) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const formData = new FormData()
  // formData.append('accessToken', accessToken || '')
  // Object.entries(data).forEach(([key, value]) => {
  //   formData.append(key, value)
  // })

  const res = await axiosPatchInstanceJSON({
    url: `/role/${id}`,
    params: {
      accessToken: accessToken || ''
    },
    data
  })
  return res.data
}

export const getUserDeviceId = async (params?: ReqQueryParamsI) => {
  const instance = createAuthInstance()
  const query = getReqQueryString(params)
  const res = await instance<UsersResI>({
    url: `/user-device${query}`
  })
  return res.data
}

export const deleteUserDeviceId = async (params?: ReqQueryParamsI) => {
  const instance = createAuthInstance()
  const query = getReqQueryString(params)
  const res = await instance<UsersResI>({
    url: `/user-device${query}`
  })
  return res.data
}

export const uploadUserDevice = async (data: any) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const formData = new FormData()
  formData.append('payload_file', data.file)

  const res = await axiosAuthPostInstance({
    url: '/device/upload',
    params: {
      accessToken: accessToken || ''
    },
    data: formData
  })
  return res.data
}

export const getUploadUserData = async (params?: ReqQueryParamsI) => {
  const instance = createAuthInstance()
  const query = getReqQueryString(params)
  const res = await instance({
    url: `/user/report${query}`,
    responseType: 'blob'
  })
  return res.data
}