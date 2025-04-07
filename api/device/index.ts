import {
  axiosAuthDeleteInstance,
  axiosAuthPatchInstance,
  axiosAuthPostInstance,
  axiosAuthPostInstanceJSON,
  axiosAuthPostInstanceUserDevice,
  axiosDeleteInstance,
  axiosPatchInstance,
  axiosPatchInstanceJSON,
  axiosPatchInstanceJson,
  axiosPostInstance,
  createAuthInstance,
  createInstance,
  createInstanceWithoutToken,
  createLogInstance,
  createLogInstanceWithoutToken
} from '@/api'
import {
  AreaI,
  CreateDeviceFieldsI,
  DataPointI,
  DeviceAccessResI,
  DeviceAreaResI,
  DeviceConsumptionResI,
  DeviceFanResI,
  DeviceHasRateResI,
  DeviceI,
  DeviceModelResI,
  DeviceResI,
  DeviceStatusI,
  DeviceStatusResI,
  DeviceTemperatureResI,
  DeviceUserResI,
  GetOneReqQueryParamsI,
  ReqQueryParamsI
} from '@/interfaces'
import { getReqQueryString } from '@/helpers'

export const getDevices = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceResI>({
    url: `/device${query}`
  })
  return res.data
}

export const getUserDevice = async (params?: ReqQueryParamsI) => {
  const instance = createAuthInstance()
  const query = getReqQueryString(params)
  const res = await instance({
    url: `/user-device${query}`
  })
  return res.data
}

export const createDevice = async (data: CreateDeviceFieldsI) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const formData = new FormData()
  formData.append('accessToken', accessToken || '')
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value)
  })

  const res = await axiosPostInstance({
    url: '/device',
    data: formData
  })
  return res.data
}

export const createRangeIp = async (data: {areaId: string, from: string, to: string}) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const formData = new FormData()
  formData.append('accessToken', accessToken || '')
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value)
  })

  const res = await axiosPostInstance({
    url: '/rangeip',
    data: formData
  })
  return res.data
}

export const getRangeIpById = async (id: string) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const instance = createInstance()
  const res = await instance({
    url: `/rangeip/${id}`,
    params: {
      accessToken
    }
  })

  return res.data
}

export const deleteRangeIpById = async (id: string) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)

  const res = await axiosDeleteInstance({
    url: `/rangeip/${id}`,
    params: {
      accessToken: accessToken || ''
    }
  })
  return res.data
}

export const deleteModelById = async (id: string) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)

  const res = await axiosDeleteInstance({
    url: `/model/${id}`,
    params: {
      accessToken: accessToken || ''
    }
  })
  return res.data
}

export const deletePoolMockById = async (id: string) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)

  const res = await axiosDeleteInstance({
    url: `/pool-mock/${id}`,
    params: {
      accessToken: accessToken || ''
    }
  })
  return res.data
}

export const getRangesIp = async (params?: ReqQueryParamsI) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance({
    url: `/rangeip${query}`,
    params: {
      accessToken
    }
  })

  return res.data
}

export const createUserDevice = async (data: {userId?: string, deviceId: string, ownerId?: string}) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const formData = new FormData();

  formData.append('accessToken', accessToken || '')
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value)
  })

  const res = await axiosAuthPostInstance({
    url: '/user-device',
    data: formData
  })
  return res.data
}

export const updateUserDevice = async (id: string, params: ReqQueryParamsI, data: {
  userId: string
}) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const formData = new FormData()
  const query = getReqQueryString(params)
  formData.append('accessToken', accessToken || '')
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  })
  const res = await axiosAuthPatchInstance({
    url: `/user-device/${id}${query}`,
    params: {
      accessToken,
    },
    data: formData,
  })
  return res.data
}

export const deleteUserDeviceById = async (id: string) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)

  const res = await axiosAuthDeleteInstance({
    url: `/user-device/${id}`,
    params: {
      accessToken: accessToken || ''
    }
  })
  return res.data
}

export const updateDevice = async (id: string, data: CreateDeviceFieldsI) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const formData = new FormData()
  formData.append('accessToken', accessToken || '')
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value)
  })

  const res = await axiosPatchInstanceJson({
    url: `/device/${id}`,
    params: {
      accessToken
    },
    data
  })
  return res.data
}

export const updateDeviceUser = async (id: string, data: CreateDeviceFieldsI) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const formData = new FormData()
  formData.append('accessToken', accessToken || '')
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value)
  })

  const res = await axiosAuthPatchInstance({
    url: `/user-device/${id}`,
    data: formData
  })
  return res.data
}

export const updateDeviceMany = async (params: ReqQueryParamsI, data: any) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const formData = new FormData()
  const query = getReqQueryString(params)
  // formData.append('accessToken', accessToken || '')
  // Object.entries(data).forEach(([key, value]) => {
  //   formData.append(key, value)
  // })
  const res = await axiosPatchInstance({
    url: `/device/mass${query}`,
    params: {
      accessToken,
    },
    data: data,
  })
  return res.data
}

export const updateDeviceBlinkOn = async (params: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)

  const res = await axiosPatchInstance({
    url: `/device/mass/blink-enable${query}`,
    params: {
      accessToken,
    },
  })
  return res.data
}

export const updateDeviceBlinkOff = async (params: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)

  const res = await axiosPatchInstance({
    url: `/device/mass/blink-disable${query}`,
    params: {
      accessToken,
    },
  })
  return res.data
}


export const deleteDevice = async (id: string) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)

  const res = await axiosDeleteInstance({
    url: `/device/${id}`,
    params: {
      accessToken: accessToken || ''
    }
  })
  return res.data
}

export const deleteManyDevices = async (params?: ReqQueryParamsI) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const query = getReqQueryString(params)
  const res = await axiosDeleteInstance({
    url: `/device${query}`,
    params: {
      accessToken: accessToken || ''
    }
  })
  return res.data
}

export const getDeviceData = async (
  id: string | undefined,
  params?: GetOneReqQueryParamsI
) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceI>({
    url: `/device/${id}${query}`
  })
  return res.data
}

export const getDeviceDataHistory = async (
  params?: ReqQueryParamsI
) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceI>({
    url: `/history${query}`
  })
  return res.data
}

export const getDevicesAccess = async (params?: ReqQueryParamsI) => {
  const instance = createInstance(params)
  const res = await instance<DeviceAccessResI>({
    url: '/device-access'
  })
  return res.data
}

export const getDevicesArea = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceAreaResI>({
    url: `/area${query}`
  })
  return res.data
}

export const getDevicesPoolMocks = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceAreaResI>({
    url: `/pool-mock${query}`
  })
  return res.data
}

export const deleteManyPoolMocks = async (params?: ReqQueryParamsI) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const query = getReqQueryString(params)
  const res = await axiosDeleteInstance({
    url: `/pool-mock${query}`,
    params: {
      accessToken: accessToken || ''
    }
  })
  return res.data
}

export const getDevicesPoolMocksId = async (id?: ReqQueryParamsI) => {
  const instance = createInstance()
  // const query = getReqQueryString(params)
  const res = await instance<DeviceAreaResI>({
    url: `/pool-mock/${id}`
  })
  return res.data
}


export const updateOnePoolMock = async (id: string, data: {
  name?: string
  url?: string
  password?: string
  url1?: string
  password1?: string
  url2?: string
  password2?: string
}) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const formData = new FormData()
  formData.append('accessToken', accessToken || '')
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  })
  const res = await axiosPatchInstance({
    url: `/pool-mock/${id}`,
    params: {
      accessToken,
    },
    data: formData,
  })
  return res.data
}

export const updateOneRangesIp = async (id: string, data: {
  name?: string
  from?: string
  to?: string
}) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const formData = new FormData()
  formData.append('accessToken', accessToken || '')
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  })
  const res = await axiosPatchInstance({
    url: `/rangeip/${id}`,
    params: {
      accessToken,
    },
    data: formData,
  })
  return res.data
}

export const createOnePoolMock = async (data: {
  name: string
  url: string
  password: string
  url1?: string
  password1?: string
  url2?: string
  password2?: string
}) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const formData = new FormData()
  formData.append('accessToken', accessToken || '')
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  })
  const res = await axiosPostInstance({
    url: `/pool-mock`,
    params: {
      accessToken,
    },
    data: formData,
  })
  return res.data
}

export const getDeviceArea = async (id: string, params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<AreaI>({
    url: `/area/${id}${query}`
  })
  return res.data
}

export const getBoxJournal = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance({
    url: `/box/journal${query}`
  })
  return res.data
}

export const getBoxCpuCore = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance({
    url: `/box/cpu-core${query}`
  })
  return res.data
}

export const getBoxCpuProc = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance({
    url: `/box/cpu-process${query}`
  })

  return res.data
}

export const getBoxDisk = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance({
    url: `/box/disk${query}`
  })

  return res.data
}

export const getBoxRam = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance({
    url: `/box/memory${query}`
  })

  return res.data
}

export const getBoxNetBytes = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance({
    url: `/box/net-rxbytes${query}`
  })

  return res.data
}

export const getLoggingPoll = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<AreaI>({
    url: `/logging-poll${query}`
  })
  return res.data
}

export const getLoggingMap = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<AreaI>({
    url: `/logging-map${query}`
  })
  return res.data
}

export const getSyncBoxById = async (id: string) => {
  const instance = createInstance()
  // const query = getReqQueryString(params)
  const res = await instance<AreaI>({
    url: `/sync-box/snapshot/${id}`
  })
  return res.data
}

export const getLoggingClickhouse = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceStatusResI>({
    url: `/logging-clickhouse${query}`
  })
  return res.data
}

export const getLoggingWorker = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceStatusResI>({
    url: `/logging-worker${query}`
  })
  return res.data
}

export const getLoggingCpuCore = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceStatusResI>({
    url: `/logging-cpu-core${query}`
  })
  return res.data
}

export const getLoggingCpuProc = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceStatusResI>({
    url: `/logging-cpu-proc${query}`
  })
  return res.data
}

export const getLoggingTrafficIncoming = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceStatusResI>({
    url: `/logging-traffic-incoming${query}`
  })
  return res.data
}

export const getLoggingTrafficOutgoing = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceStatusResI>({
    url: `/logging-traffic-outgoing${query}`
  })
  return res.data
}

export const getLoggingRamSwap = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceStatusResI>({
    url: `/logging-ram-swap${query}`
  })
  return res.data
}

export const getLoggingRamMem = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceStatusResI>({
    url: `/logging-ram-mem${query}`
  })
  return res.data
}

export const getDevicesStatus = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceStatusResI>({
    url: `/status${query}`
  })
  return res.data
}

export const getDevicesStatusCount = async (params?: ReqQueryParamsI, config: { signal?: AbortSignal } = {}) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceStatusResI>({
    url: `/device/count${query}`,
    ...config
  })
  return res.data
}

export const getDevicesUser = async (params?: ReqQueryParamsI) => {
  const instance = createAuthInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceUserResI>({
    url: `/user-device${query}`
  })
  return res.data
}

export const getDevicesConsumption = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceConsumptionResI>({
    url: `/log-energy-consumption${query}`
  })
  return res.data
}

export const getDevicesConsumptionChart = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceConsumptionResI>({
    url: `/log-energy-consumption/chart${query}`
  })
  return res.data
}

export const getDevicesFan = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceFanResI>({
    url: `/log-fan${query}`
  })
  return res.data
}

export const getDevicesFanChart = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceFanResI>({
    url: `/log-fan/chart${query}`
  })
  return res.data
}

export const getDevicesHashrate = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<number>({
    url: `/device/hashrate${query}`
  })
  return res.data
}

export const getDevicesEnergy = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<number>({
    url: `/device/energy-consumption${query}`
  })
  return res.data
}

export const getDevicesHashRateLog = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceHasRateResI>({
    url: `/log-hashrate${query}`
  })
  return res.data
}

export const getDevicesHashRateChart = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceHasRateResI>({
    url: `/log-hashrate/chart${query}`
  })
  return res.data
}

// export const getDevicesHashrateCacheDay = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-hashrate-day${query}`
//   })
//   return res.data
// }

export const getDevicesHashrateCacheDay = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceHasRateResI>({
    url: `/log-hashrate${query}`
  })
  return res.data
}

export const getDevicesHashrateCacheDaySum = async (
  params?: ReqQueryParamsI,
  config: { signal?: AbortSignal } = {}
) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DataPointI[]>({
    url: `/log-hashrate/sum${query}`,
    ...config
  })
  return res.data
}

export const getDevicesSumNominalHashrate = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance({
    url: `/device/sum-nominal-hashrate`
  })
  return res.data
}

// export const getDevicesEnergyCacheDaySum = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-cache-energy-day/sum${query}`
//   })
//   return res.data
// }

export const getDevicesEnergyCacheDaySum = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DataPointI[]>({
    url: `/log-energy/sum${query}`
  })
  return res.data
}

// export const getDevicesEnergyCacheWeekSum = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-cache-energy-week/sum${query}`
//   })
//   return res.data
// }

export const getDevicesEnergyCacheWeekSum = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceHasRateResI>({
    url: `/log-energy/week/sum${query}`
  })
  return res.data
}

// export const getDevicesEnergyCacheMonthSum = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-cache-energy-month/sum${query}`
//   })
//   return res.data
// }

export const getDevicesEnergyCacheMonthSum = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceHasRateResI>({
    url: `/log-energy/sum/month${query}`
  })
  return res.data
}

// export const getDevicesEnergyCacheMonthMax = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstanceWithoutToken()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-cache-energy-month/max${query}`
//   })
//   return res.data
// }

export const getDevicesEnergyCacheMonthMax = async (params?: ReqQueryParamsI) => {
  const instance = createLogInstanceWithoutToken()
  const query = getReqQueryString(params)
  const res = await instance<DeviceHasRateResI>({
    url: `/log-energy/month/max${query}`
  })
  return res.data
}

// export const getDevicesHashrateCacheDaySum = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-cache-hashrate-day/sum${query}`
//   })
//   return res.data
// }

export const getDevicesHashrateCacheWeek = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DataPointI[]>({
    url: `/log-hashrate/sum/week${query}`
  })
  return res.data
}

export const getDevicesHashrateCacheMonth = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DataPointI[]>({
    url: `/log-hashrate/sum/month${query}`
  })
  return res.data
}

// export const getDevicesEnergyCacheDay = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-energy-day${query}`
//   })
//   return res.data
// }

export const getDevicesEnergyCacheDay = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceHasRateResI>({
    url: `/log-energy${query}`
  })
  return res.data
}

// export const getDevicesEnergyCacheWeek = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-energy-week${query}`
//   })
//   return res.data
// }

export const getDevicesEnergyCacheWeek = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceHasRateResI>({
    url: `/log-energy/week${query}`
  })
  return res.data
}

// export const getDevicesEnergyCacheMonth = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-energy-month${query}`
//   })
//   return res.data
// }

export const getDevicesEnergyCacheMonth = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DataPointI[]>({
    url: `/log-energy/month${query}`
  })
  return res.data
}

// export const getDevicesUptimeCacheDay = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-uptime-day${query}`
//   })
//   return res.data
// }

export const getDevicesUptimeCacheDay = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceHasRateResI>({
    url: `/log-uptime${query}`
  })
  return res.data
}

export const getRoleAccess = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceHasRateResI>({
    url: `/role-access${query}`
  })
  return res.data
}

export const createRoleAccess = async (data: {roleId: string, accessId: string}) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const formData = new FormData()
  formData.append('accessToken', accessToken || '')
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value)
  })
  const res = await axiosPostInstance({
    url: `/role-access`,
    data: formData,
    params: {
      accessToken
    }
  })

  return res.data
}

export const createManyRoleAccess = async (data: Array<{ roleId: string; accessId: string }>) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`);
  const formData = new FormData();

  formData.append('accessToken', accessToken || '');

  data.forEach((item, index) => {
    formData.append(`data[${index}][roleId]`, item.roleId);
    formData.append(`data[${index}][accessId]`, item.accessId);
  });

  const res = await axiosAuthPostInstanceJSON({
    url: `/role-access/many`,
    params: {
      accessToken
    },
    data,
  });

  return res.data;
};

export const deleteRoleAccessById = async (id: string) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)

  const res = await axiosDeleteInstance({
    url: `/role-access/${id}`,
    params: {
      accessToken: accessToken || ''
    }
  })
  return res.data
}

export const updateRoleAccessById = async () => {

}

export const updateDevicesUser = async (params: ReqQueryParamsI, data: {userId: string}) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const formData = new FormData()
  const query = getReqQueryString(params)
  // formData.append('accessToken', accessToken || '')
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value)
  })
  const res = await axiosPatchInstance({
    url: `/device${query}`,
    params: {
      accessToken,
    },
    data: formData,
  })
  return res.data
}

export const updateAreaName = async (id: string, data: {name: string}) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const formData = new FormData()
  formData.append('accessToken', accessToken || '')
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value)
  })
  const res = await axiosPatchInstance({
    url: `/area/${id}`,
    params: {
      accessToken,
    },
    data: formData,
  })
  return res.data
}

export const updatesUserDevices = async (params: ReqQueryParamsI, data: any) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const formData = new FormData()
  const query = getReqQueryString(params)
  const res = await axiosAuthPostInstanceUserDevice({
    url: `/user-device/many${query}`,
    params: {
      accessToken,
    },
    data
  })
  return res.data
}

export const deleteUserDevicesMany = async (params: ReqQueryParamsI) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const query = getReqQueryString(params)
  const res = await axiosDeleteInstance({
    url: `/user-device${query}`,
    params: {
      accessToken
    }
  })
  
  return res.data
}

export const updatesUserDevicesPatch = async (params: ReqQueryParamsI, data: any) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  // const formData = new FormData()
  const query = getReqQueryString(params)
  const res = await axiosPatchInstance({
    url: `/user-device/many`,
    params: {
      accessToken,
    },
    data
  })
  return res.data
}

export const updateManyDevicesPools = async (params: ReqQueryParamsI, data: {
  from?: string
  name?: string
  user?: string
  url?: string
  password?: string
  name2?: string
  user2?: string
  url2?: string
  password2?: string
  name3?: string
  user3?: string
  url3?: string
  password3?: string,
  indexation?: string
}) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const formData = new FormData()
  const query = getReqQueryString(params)
  // formData.append('accessToken', accessToken || '')
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  })
  const res = await axiosPatchInstance({
    url: `/device/mass/pools${query}`,
    params: {
      accessToken,
    },
    data: formData,
  })
  return res.data
}
export const getDevicesPool = async (params?: ReqQueryParamsI) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance({
    url: `/pool${query}`
  })
  return res.data
}

// export const getDevicesUptimeCacheDayAvg = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-cache-uptime-day/avg${query}`
//   })
//   return res.data
// }

export const getDevicesUptimeCacheDayAvg = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceHasRateResI>({
    url: `/log-uptime/avg${query}`
  })
  return res.data
}

// export const getDevicesUptimeCacheWeekAvg = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-cache-uptime-week/avg${query}`
//   })
//   return res.data
// }

export const getDevicesUptimeCacheWeekAvg = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceHasRateResI>({
    url: `/log-uptime/week/avg${query}`
  })
  return res.data
}

// export const getDevicesUptimeCacheMonthAvg = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-cache-uptime-month/avg${query}`
//   })
//   return res.data
// }

export const getDevicesUptimeCacheMonthAvg = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceHasRateResI>({
    url: `/log-uptime/month/avg${query}`
  })
  return res.data
}

export const getDevicesCountShared = async (params?: ReqQueryParamsI) => {
  const instance = createInstanceWithoutToken()
  const query = getReqQueryString(params)
  const res = await instance<DeviceStatusResI>({
    url: `/device/count-shared${query}`
  })
  return res.data
}

// export const getDevicesUptimeCacheWeek = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-uptime-week${query}`
//   })
//   return res.data
// }

export const getDevicesUptimeCacheWeek = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceHasRateResI>({
    url: `/log-uptime/week${query}`
  })
  return res.data
}

// export const getDevicesUptimeCacheMonth = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-uptime-month${query}`
//   })
//   return res.data
// }

export const getDevicesUptimeCacheMonth = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceHasRateResI>({
    url: `/log-uptime/month${query}`
  })
  return res.data
}

// export const getDevicesHashrateSingleDay = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-hashrate-day${query}`
//   })
//   return res.data
// }

export const getDevicesHashrateSingleDay = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DataPointI[]>({
    url: `/log-hashrate${query}`
  })
  return res.data
}

// export const getDevicesHashrateSingleWeek = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-hashrate-week${query}`
//   })
//   return res.data
// }

export const getDevicesHashrateSingleWeek = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DataPointI[]>({
    url: `/log-hashrate/week${query}`
  })
  return res.data
}

// export const getDevicesHashrateSingleMonth = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-hashrate-month${query}`
//   })
//   return res.data
// }

export const getDevicesHashrateSingleMonth = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DataPointI[]>({
    url: `/log-hashrate/month${query}`
  })
  return res.data
}

// export const getDevicesTemperatureSingleDay = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-temperature-day${query}`
//   })
//   return res.data
// }

export const getDevicesTemperatureSingleDay = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DataPointI[]>({
    url: `/log-temperature${query}`
  })
  return res.data
}

// export const getDevicesTemperatureSingleWeek = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-temperature-week${query}`
//   })
//   return res.data
// }

export const getDevicesTemperatureSingleWeek = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DataPointI[]>({
    url: `/log-temperature/week${query}`
  })
  return res.data
}

// export const getDevicesTemperatureSingleMonth = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-temperature-month${query}`
//   })
//   return res.data
// }

export const getDevicesTemperatureSingleMonth = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DataPointI[]>({
    url: `/log-temperature/month${query}`
  })
  return res.data
}

// export const getDevicesEnergySingleDay = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-energy-day${query}`
//   })
//   return res.data
// }

export const getDevicesEnergySingleDay = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DataPointI[]>({
    url: `/log-energy${query}`
  })
  return res.data
}

// export const getDevicesEnergySingleWeek = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-energy-week${query}`
//   })
//   return res.data
// }

export const getDevicesEnergySingleWeek = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DataPointI[]>({
    url: `/log-energy/week${query}`
  })
  return res.data
}

// export const getDevicesEnergySingleMonth = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-energy-month${query}`
//   })
//   return res.data
// }

export const getDevicesEnergySingleMonth = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DataPointI[]>({
    url: `/log-energy/month${query}`
  })
  return res.data
}

// export const getDevicesFanSingleDay = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-fan-day${query}`
//   })
//   return res.data
// }

export const getDevicesFanSingleDay = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DataPointI[]>({
    url: `/log-fan${query}`
  })
  return res.data
}

// export const getDevicesFanSingleWeek = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-fan-week${query}`
//   })
//   return res.data
// }

export const getDevicesFanSingleWeek = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DataPointI[]>({
    url: `/log-fan/week${query}`
  })
  return res.data
}

// export const getDevicesFanSingleMonth = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-fan-month${query}`
//   })
//   return res.data
// }

export const getDevicesFanSingleMonth = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DataPointI[]>({
    url: `/log-fan/month${query}`
  })
  return res.data
}

// export const getDevicesUptimeSingleDay = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-uptime-day${query}`
//   })
//   return res.data
// }

export const getDevicesUptimeSingleDay = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DataPointI[]>({
    url: `/log-uptime${query}`
  })
  return res.data
}

// export const getDevicesUptimeSingleWeek = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-uptime-week${query}`
//   })
//   return res.data
// }

export const getDevicesUptimeSingleWeek = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DataPointI[]>({
    url: `/log-uptime/week${query}`
  })
  return res.data
}

// export const getDevicesUptimeSingleMonth = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-uptime-month${query}`
//   })
//   return res.data
// }

export const getDevicesUptimeSingleMonth = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DataPointI[]>({
    url: `/log-uptime/month${query}`
  })
  return res.data
}

// export const getDevicesEnergyAvg = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-energy-day/avg${query}`
//   })
//   return res.data
// }

export const getDevicesEnergyAvg = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceHasRateResI>({
    url: `/log-energy/avg${query}`
  })
  return res.data
}

// export const getDevicesWeekEnergyAvg = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-energy-week/avg${query}`
//   })
//   return res.data
// }

export const getDevicesWeekEnergyAvg = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceHasRateResI>({
    url: `/log-energy/week/avg${query}`
  })
  return res.data
}

// export const getDevicesMonthEnergyAvg = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-energy-month/avg${query}`
//   })
//   return res.data
// }

export const getDevicesMonthEnergyAvg = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceHasRateResI>({
    url: `/log-energy/month/avg${query}`
  })
  return res.data
}

// export const getDevicesUptimeDayAvg = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-uptime-day/avg${query}`
//   })
//   return res.data
// }

export const getDevicesUptimeDayAvg = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceHasRateResI>({
    url: `/log-uptime/avg${query}`
  })
  return res.data
}

// export const getDevicesUptimeWeekAvg = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-uptime-week/avg${query}`
//   })
//   return res.data
// }

export const getDevicesUptimeWeekAvg = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceHasRateResI>({
    url: `/log-uptime/week/avg${query}`
  })
  return res.data
}

// export const getDevicesUptimeMonthAvg = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-uptime-month/avg${query}`
//   })
//   return res.data
// }

export const getDevicesUptimeMonthAvg = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceHasRateResI>({
    url: `/log-uptime/month/avg${query}`
  })
  return res.data
}

// export const getDevicesHashrateAvg = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-hashrate-day/avg${query}`
//   })
//   return res.data
// }

export const getDevicesHashrateAvg = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceHasRateResI>({
    url: `/log-hashrate/avg${query}`
  })
  return res.data
}

// export const getDevicesEnergySumDay = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-energy-day/sum${query}`
//   })
//   return res.data
// }

export const getDevicesEnergySumDay = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceHasRateResI>({
    url: `/log-energy/sum${query}`
  })
  return res.data
}

// export const getDevicesEnergySumWeek = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-energy-week/sum${query}`
//   })
//   return res.data
// }

export const getDevicesEnergySumWeek = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DataPointI[]>({
    url: `/log-energy/sum/week${query}`
  })
  return res.data
}

// export const getDevicesEnergySumMonth = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-energy-month/sum${query}`
//   })
//   return res.data
// }

export const getDevicesEnergySumMonth = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DataPointI[]>({
    url: `/log-energy/sum/month${query}`
  })
  return res.data
}

// export const getDevicesCacheIdealEnergyDay = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-cache-energyideal-day${query}`
//   })
//   return res.data
// }

export const getDevicesCacheIdealEnergyDay = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceHasRateResI>({
    url: `/log-energyideal${query}`
  })
  return res.data
}

// export const getDevicesCacheIdealEnergyWeek = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-cache-energyideal-week${query}`
//   })
//   return res.data
// }

export const getDevicesCacheIdealEnergyWeek = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceHasRateResI>({
    url: `/log-energyideal/week${query}`
  })
  return res.data
}

// export const getDevicesCacheIdealEnergyMonth = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-cache-energyideal-month${query}`
//   })
//   return res.data
// }

export const getDevicesCacheIdealEnergyMonth = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceHasRateResI>({
    url: `/log-energyideal/month${query}`
  })
  return res.data
}

export const getDevicesIdealEnergyDay = async (params?: ReqQueryParamsI) => {
  const instance = createLogInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceHasRateResI>({
    url: `/log-energyideal-day${query}`
  })
  return res.data
}

export const getDevicesIdealEnergyWeek = async (params?: ReqQueryParamsI) => {
  const instance = createLogInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceHasRateResI>({
    url: `/log-energyideal-week${query}`
  })
  return res.data
}

export const getDevicesIdealEnergyMonth = async (params?: ReqQueryParamsI) => {
  const instance = createLogInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceHasRateResI>({
    url: `/log-energyideal-month${query}`
  })
  return res.data
}



export const getDevicePollingId = async (id: string) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const instance = createInstance()

  const res = await instance({
    url: `/device/polling/${id}`,
    params: {
      accessToken: accessToken || ''
    }
  })
  return res.data
}

// export const getDevicesHashrateSum = async (params?: ReqQueryParamsI) => {
//   const instance = createLogInstance()
//   const query = getReqQueryString(params)
//   const res = await instance<DeviceHasRateResI>({
//     url: `/log-hashrate-day/sum${query}`
//   })
//   return res.data
// }

export const getDevicesHashrateSum = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceHasRateResI>({
    url: `/log-hashrate/sum${query}`
  })
  return res.data
}

export const getDevicesTemperature = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceTemperatureResI>({
    url: `/log-temperature${query}`
  })
  return res.data
}

export const getDevicesTemperatureChart = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceTemperatureResI>({
    url: `/log-temperature/chart${query}`
  })
  return res.data
}

export const getDevicesUptime = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance({
    url: `/device/uptime${query}`
  })
  return res.data
}

export const getDeviceUptime = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceHasRateResI>({
    url: `/log-uptime${query}`
  })
  return res.data
}

export const getDevicesEfficiency = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance({
    url: `/device/efficiency${query}`
  })
  return res.data
}

export const getDevicesStatusStats = async (params?: ReqQueryParamsI) => {
  const instance = createInstance(params)
  const res = await instance({
    url: '/device/status'
  })
  return res.data
}

export const getDevicesUptimeChart = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance<DeviceHasRateResI>({
    url: `/log-uptime/chart${query}`
  })
  return res.data
}

export const updateDevicePool = async (id: string, data: CreateDeviceFieldsI) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const formData = new FormData()
  formData.append('accessToken', accessToken || '')
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value)
  })

  const res = await axiosPatchInstance({
    url: `/device-pool/${id}`,
    data: formData
  })
  return res.data
}

export const getDevicesPoolReserve = async (params?: ReqQueryParamsI) => {
  const instance = createInstance() 
  const query = getReqQueryString(params)
  const res = await instance({
    url: `/device-pool-reserve${query}`
  })

  return res.data;
}

export const getDevicesAlgorithm = async (params?: ReqQueryParamsI) => {
  const instance = createInstance(params)
  const res = await instance<DeviceAreaResI>({
    url: '/algorithm'
  })
  return res.data
}

export const getAccess = async (params?: ReqQueryParamsI) => {
  const instance = createInstance(params)
  const res = await instance<DeviceAreaResI>({
    url: '/access'
  })
  return res.data
}

export const getAccessId = async (id: string, params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance({
    url: `/access/${id}${query}`
  })
  return res.data
}


export const updateAccessById = async (id: string, data: {
  name?: string
  description?: string
}) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  // const query = getReqQueryString(params)
  const formData = new FormData()
  formData.append('accessToken', accessToken || '')
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value)
  })
  const res = await axiosPatchInstance({
    url: `/access/${id}`,
    params: {
      accessToken
    },
    data: formData
  })
  return res.data
}

export const getDeviceModel = async (params?: ReqQueryParamsI) => {
  const instance = createInstance() 
  const query = getReqQueryString(params)
  const res = await instance<DeviceModelResI>({
    url: `/model${query}`
  })
  return res.data
}

export const getDeviceModelId = async (id: string) => {
  const instance = createInstance() 
  const res = await instance<DeviceModelResI>({
    url: `/model/${id}`
  })
  return res.data
}

export const updateModelId = async (id: string, data: {nominalEnergy: string}) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const formData = new FormData()
  formData.append('accessToken', accessToken || '')
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value)
  })
  const res = await axiosPatchInstance({
    url: `/model/${id}`,
    params: {
      accessToken,
    },
    data: formData,
  })
  return res.data
}

export const getUploadDeviceData = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance({
    url: `/device/report${query}`,
    responseType: 'blob'
  })
  return res.data
}

export const getUploadDeviceEffeciency = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance({
    url: `/device/rate-report${query}`,
    responseType: 'blob'
  })
  return res.data
}

export const testReport = async (params: ReqQueryParamsI, data: {
  billMode: any,
  datesHidden: any,
  generatePrice: any,
  notNecessaryHidden: any,
  table: string
  userId: string,
  byUser: boolean
}) => {
    const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
    const formData = new FormData()
    const query = getReqQueryString(params)
    // Object.entries(data).forEach(([key, value]) => {
    //   formData.append(key, String(value));
    // })
    const res = await axiosPatchInstance({
      url: `/device/report${query}`,
      params: {
        accessToken,
      },
      headers: {
        'Content-Type': 'application/json',  // Указываем, что данные отправляются в формате JSON
      },
      responseType: 'blob',
      data, 
    })
    return res.data
}

export const userReport = async (params: ReqQueryParamsI, data: {
  // billMode: any,
  datesHidden: any,
  generatePrice: any,
  notNecessaryHidden: any,
  table: string
}) => {
    const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
    const formData = new FormData()
    const query = getReqQueryString(params)
    // Object.entries(data).forEach(([key, value]) => {
    //   formData.append(key, String(value));
    // })
    const res = await axiosPatchInstance({
      url: `/user/report${query}`,
      params: {
        accessToken,
      },
      headers: {
        'Content-Type': 'application/json',  // Указываем, что данные отправляются в формате JSON
      },
      responseType: 'blob',
      data, 
    })
    return res.data
}

export const getUploadBillDetails = async (params?: ReqQueryParamsI) => {
  const instance = createAuthInstance()
  const query = getReqQueryString(params)
  const res = await instance({
    url: `/user/bill-details${query}`,
    responseType: 'blob'
  })
  return res.data
}

export const getUploadStatsData = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance({
    url: `/device/report${query}`,
    responseType: 'blob'
  })
  return res.data
}

export const getDownloadEnergyCacheDay = async (params?: ReqQueryParamsI) => {
  const instance = createLogInstance()
  const query = getReqQueryString(params)
  const res = await instance({
    url: `/log-cache-energy-day/report${query}`,
    responseType: 'blob'
  })
  return res.data
}

export const getDownloadHashrateCacheDay = async (params?: ReqQueryParamsI) => {
  const instance = createLogInstance()
  const query = getReqQueryString(params)
  const res = await instance({
    url: `/log-cache-hashrate-day/report${query}`,
    responseType: 'blob'
  })
  return res.data
}

export const getDownloadUptimeCacheDay = async (params?: ReqQueryParamsI) => {
  const instance = createLogInstance()
  const query = getReqQueryString(params)
  const res = await instance({
    url: `/log-energy/report/day${query}`,
    responseType: 'blob'
  })
  return res.data
}


export const getDownloadEnergyCacheWeek = async (params?: ReqQueryParamsI) => {
  const instance = createLogInstance()
  const query = getReqQueryString(params)
  const res = await instance({
    url: `/log-energy/report/week${query}`,
    responseType: 'blob'
  })
  return res.data
}

export const getDownloadEnergyCacheMonth = async (params?: ReqQueryParamsI) => {
  const instance = createLogInstance()
  const query = getReqQueryString(params)
  const res = await instance({
    url: `/log-energy/report/month${query}`,
    responseType: 'blob'
  })
  return res.data
}

export const getDownloadHashrateCacheWeek = async (params?: ReqQueryParamsI) => {
  const instance = createLogInstance()
  const query = getReqQueryString(params)
  const res = await instance({
    url: `/log-cache-hashrate-week/report${query}`,
    responseType: 'blob'
  })
  return res.data
}

export const getDownloadHashrateCacheMonth = async (params?: ReqQueryParamsI) => {
  const instance = createLogInstance()
  const query = getReqQueryString(params)
  const res = await instance({
    url: `/log-cache-hashrate-month/report${query}`,
    responseType: 'blob'
  })
  return res.data
}

export const getDownloadUptimeCacheWeek = async (params?: ReqQueryParamsI) => {
  const instance = createLogInstance()
  const query = getReqQueryString(params)
  const res = await instance({
    url: `/log-cache-uptime-week/report${query}`,
    responseType: 'blob'
  })
  return res.data
}

export const getDownloadUptimeCacheMonth = async (params?: ReqQueryParamsI) => {
  const instance = createLogInstance()
  const query = getReqQueryString(params)
  const res = await instance({
    url: `/log-cache-uptime-month/report${query}`,
    responseType: 'blob'
  })
  return res.data
}

export const reloadManyDevices = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)

  const res = await axiosPatchInstance({
    url: `/device/mass/reboot${query}`,
    params: {
      accessToken,
    },
  })
  return res.data
}

export const restoreManyDevices = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)

  const res = await axiosPatchInstance({
    url: `/device/mass/restore${query}`,
    params: {
      accessToken,
    },
  })
  return res.data
}

export const enableDevice = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)

  const res = await axiosPatchInstance({
    url: `/device/enable${query}`,
    params: {
      accessToken,
    },
  })
  // return res.data
  // const res = await instance({
  //   url: `/device/enable${query}`
  // })
  return res.data
}

export const archiveDevice = async (id: string, params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)

  const res = await axiosPatchInstance({
    url: `/device/${id}/archive`,
    params: {
      accessToken,
    },
  })
  // return res.data
  // const res = await instance({
  //   url: `/device/enable${query}`
  // })
  return res.data
}

export const archiveMassDevice = async (params: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)

  const res = await axiosPatchInstance({
    url: `/device/mass/archive${query}`,
    params: {
      accessToken,
    },
  })
  // return res.data
  // const res = await instance({
  //   url: `/device/enable${query}`
  // })
  return res.data
}

export const repairDevice = async (id: string, params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)

  const res = await axiosPatchInstance({
    url: `/device/${id}/repair`,
    params: {
      accessToken,
    },
  })
  // return res.data
  // const res = await instance({
  //   url: `/device/enable${query}`
  // })
  return res.data
}

export const repairMassDevice = async (params: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)

  const res = await axiosPatchInstance({
    url: `/device/mass/repair${query}`,
    params: {
      accessToken,
    },
  })
  // return res.data
  // const res = await instance({
  //   url: `/device/enable${query}`
  // })
  return res.data
}

export const disableDevice = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)

  const res = await axiosPatchInstance({
    url: `/device/disable${query}`,
    params: {
      accessToken
    }
  })
  return res.data
}

export const createArea = async (data: {name: string, password: string}) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const formData = new FormData()
  formData.append('accessToken', accessToken || '')
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value)
  })
  const res = await axiosPostInstance({
    url: `/area`,
    data: formData
  })
  return res.data
}

export const deleteAreaById = async(id: string) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)

  const res = await axiosDeleteInstance({
    url: `/area/${id}`,
    params: {
      accessToken: accessToken || ''
    }
  })
  return res.data
}

export const updateManyOverclock = async (params: ReqQueryParamsI, data: {
  profile: string
  voltage: string
}) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const formData = new FormData()
  const query = getReqQueryString(params)
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, String(value));
  })
  const res = await axiosPatchInstance({
    url: `/device/mass/overclock${query}`,
    params: {
      accessToken,
    },
    data: formData,
  })
  return res.data
}

export const updateManyDevice = async (params: ReqQueryParamsI, data: {
  comment?: string
  isGlued?: boolean
  partNumber?: string
}) => {
  const query = getReqQueryString(params)
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const res = await axiosPatchInstanceJSON({
    url: `/device/mass${query}`,
    params: {
      accessToken
    },
    data
  })
  return res.data
}

export const getLogDeviceById = async (id: string, params: ReqQueryParamsI) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const query = getReqQueryString(params)
  const instance = createInstance()
  const res = await instance({
    url: `/device/log/${id}${query}`,
    params: {
      accessToken
    }
  })
  return res.data
}

export const reserveDeviceById = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)

  const res = await axiosPatchInstance({
    url: `/device/reserve${query}`,
    params: {
      accessToken
    }
  })
  return res.data
}

export const restoreDeviceById = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  
  const res = await axiosPatchInstance({
    url: `/device/restore${query}`,
    params: {
      accessToken 
    }
  })
  return res.data
}

export const getComments = async (params?: ReqQueryParamsI) => {
  const instance = createInstance()
  const query = getReqQueryString(params)
  const res = await instance({
    url: `/device-comment${query}`
  })
  return res.data
}

export const createComment = async (data: {
  deviceId: string
  message: string
}) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const formData = new FormData()
  formData.append('accessToken', accessToken || '')
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value)
  })

  const res = await axiosPostInstance({
    url: '/device-comment',
    data: formData
  })
  return res.data
}

export const createCommentMany = async (data: any) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)
  const formData: any = new FormData()
  formData.append('accessToken', accessToken || '')
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value)
  })
  const res = await axiosAuthPostInstanceJSON({
    url: '/device-comment/many',
    params: {
      accessToken
    },
    data
  })
  return res.data
}

export const deleteComment = async (id: string) => {
  const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`)

  const res = await axiosDeleteInstance({
    url: `/device-comment/${id}`,
    params: {
      accessToken: accessToken || ''
    }
  })
  return res.data
}