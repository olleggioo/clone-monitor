import type { ChartPeriodType, DeviceI, DeviceStatusI, StatusType, UserI } from '@/interfaces'
import { Algorithms } from '@/const'
import type { DeviceAlgorithmI } from '@/interfaces'
import type {
  TableCellI,
  TableHeadCellI,
  TableRowI
} from '@/components/Table/Table'
import { getHashRateUnit, getStatusName } from '@/helpers'
import getEnergyUnit from '@/helpers/getEnergyUnit'
import { deviceAPI } from '@/api'
import { ChartDataType } from '@/components/Chart/Chart'
import moment from 'moment'
import { useAtom } from 'jotai'
import { StatsFilterStateI, statsEnergyAtom, statsFilterAtom } from '@/atoms/statsAtom'
import getHashRate from '@/helpers/getHashrate'

const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => letter.toLowerCase()).replace(/ /g, '_')

export const getDevicesStatuseTableData = (
  statusStats: DeviceStatusI[],
  handleStatusClick: (id: string, title: string) => void
) => {
  const rows = statusStats.reduce((acc: TableRowI[], status: any) => {
    const statusCode = camelToSnakeCase(status.name)
    
    const columns: TableCellI[] = [
      {
        title: getStatusName(statusCode),
        status: statusCode as StatusType
      },
      {
        title: status.count?.toString() || '0',
        bold: true
      }
    ]

    const row: TableRowI = {
      id: statusCode,
      columns,
      onClick: () => {
        if (status.id) {
          handleStatusClick(status.id, getStatusName(statusCode))
        }
      }
    }

    return [...acc, row]
  }, [])

  return rows
}

// export const getDevicesAlgorithmsListClients = async (devices: DeviceI[], periodType: ChartPeriodType, filterState: StatsFilterStateI, userInfo: UserI | null) => {
  
//   const devicesAlgorithms = devices.reduce(
//     (
//       result: {
//         [key: string]: {
//           devices: number
//           consumption: number
//           hashrate: number
//           id: string
//         }
//       },
//       item
//     ) => {
//       if (result[item.algorithm.name]) {
//         result[item.algorithm.name].devices += 1
//         result[item.algorithm.name].consumption += 0
//       } else {
//         result[item.algorithm.name] = {
//           devices: 1,
//           consumption: 0,
//           hashrate: 0,
//           id: ''
//         }
//       }

//       return result
//     },
//     {}
//   )
//   const dateFrom15 = moment().subtract(30, 'minutes').format('YYYY-MM-DD HH:mm')
//   const dateNow = moment().format('YYYY-MM-DD HH:mm:ss')

//     await new Promise<void>((resolve) => {
//       Promise.all([
//         deviceAPI.getDevicesEnergySingleDay({
//           where: {
//             areaId: filterState.area || null,
//             modelId: filterState.model || null,
//             statusId: filterState.status || null,
//             rangeipId: filterState.ranges || null,
//             userId: userInfo?.id,
//             algorithmId: "57ca3b7e-861f-11ee-932b-300505de684f",
//             },
//             limit: 1,
//             select: {
//               value: true
//             },
//             order: {
//               createdAt: "DESC"
//             },
//         }),
//         deviceAPI.getDevicesEnergySingleDay({
//           where: {
//             areaId: filterState.area || null,
//             modelId: filterState.model || null,
//             statusId: filterState.status || null,
//             rangeipId: filterState.ranges || null,
//             userId: userInfo?.id,
//               algorithmId: "57ca3cca-861f-11ee-932b-300505de684f",
          
//             },
//             select: {
//               value: true
//             },
//             limit: 1,
//             order: {
//               createdAt: "DESC"
//             },
//         }),
//         deviceAPI.getDevicesEnergySingleDay({
//           where: {
//             areaId: filterState.area || null,
//             modelId: filterState.model || null,
//             statusId: filterState.status || null,
//             rangeipId: filterState.ranges || null,
//             userId: userInfo?.id,
//               algorithmId: "5f90f02c-861f-11ee-932b-300505de684f",
//           },
//           select: {
//             value: true
//           },
//           limit: 1,
//           order: {
//             createdAt: "DESC"
//           },
//         }),
//          deviceAPI.getDevicesEnergySingleDay({
//           where: {
//             areaId: filterState.area || null,
//             modelId: filterState.model || null,
//             statusId: filterState.status || null,
//             rangeipId: filterState.ranges || null,
//             userId: userInfo?.id,
//               algorithmId: "830768b4-0dea-4f7d-8519-6d93973cf26a",
//           },
//           select: {
//             value: true
//           },
//           limit: 1,
//           order: {
//             createdAt: "DESC"
//           },
//         }),
//         deviceAPI.getDevicesEnergySingleDay({
//           where: {
//             areaId: filterState.area || null,
//             modelId: filterState.model || null,
//             statusId: filterState.status || null,
//             rangeipId: filterState.ranges || null,
//             userId: userInfo?.id,
//               algorithmId: "5f90ee86-861f-11ee-932b-300505de684f",
//           },
//           select: {
//             value: true
//           },
//           limit: 1,
//           order: {
//             createdAt: "DESC"
//           },
//         }),
//         deviceAPI.getDevicesEnergySingleDay({
//           where: {
//             areaId: filterState.area || null,
//             modelId: filterState.model || null,
//             statusId: filterState.status || null,
//             rangeipId: filterState.ranges || null,
//             userId: userInfo?.id,
//               algorithmId: "9b073f01-ce18-4bb5-bc18-6cbe5923c4af",
//           },
//           select: {
//             value: true
//           },
//           limit: 1,
//           order: {
//             createdAt: "DESC"
//           },
//         }),
//         deviceAPI.getDevicesEnergySingleDay({
//           where: {
//             areaId: filterState.area || null,
//             modelId: filterState.model || null,
//             statusId: filterState.status || null,
//             rangeipId: filterState.ranges || null,
//             userId: userInfo?.id,
//               algorithmId: "45567b9e-a673-4661-8ea1-8ff22ac030a6",
//           },
//           select: {
//             value: true
//           },
//           limit: 1,
//           order: {
//             createdAt: "DESC"
//           },
//         }),
//         deviceAPI.getDevicesEnergySingleDay({
//           where: {
//             areaId: filterState.area || null,
//             modelId: filterState.model || null,
//             statusId: filterState.status || null,
//             rangeipId: filterState.ranges || null,
//             userId: userInfo?.id,
//               algorithmId: "5f90ee86-861f-11ee-932b-300505de685f",
//           },
//           select: {
//             value: true
//           },
//           limit: 1,
//           order: {
//             createdAt: "DESC"
//           },
//         })
//       ]).then(res => {
//         const [sha256, scrypt, ethash, equihash, eaglesong, blake2b, blake2s, kheavyhash ] = res;
//         devicesAlgorithms["sha256"] = {
//           ...devicesAlgorithms["sha256"],
//           id: "57ca3b7e-861f-11ee-932b-300505de684f",
//           consumption: Number(sha256.rows[0]?.value || 0)
//         };
//         devicesAlgorithms["scrypt"] = {
//           ...devicesAlgorithms["scrypt"],
//           consumption: Number(scrypt.rows[0]?.value || 0),
//           id: "57ca3cca-861f-11ee-932b-300505de684f"
//         };
//         devicesAlgorithms["ethash"] = {
//           ...devicesAlgorithms["ethash"],
//           consumption: Number(ethash.rows[0]?.value || 0),
//           id: "5f90f02c-861f-11ee-932b-300505de684f"
//         };
//         devicesAlgorithms["equihash"] = {
//           ...devicesAlgorithms["equihash"],
//           consumption: Number(equihash.rows[0]?.value || 0),
//           id: "830768b4-0dea-4f7d-8519-6d93973cf26a"
//         };
//         devicesAlgorithms["eaglesong"] = {
//           ...devicesAlgorithms["eaglesong"],
//           consumption: Number(eaglesong.rows[0]?.value || 0),
//           id: "5f90ee86-861f-11ee-932b-300505de684f"
//         };
//         devicesAlgorithms["blake2b"] = {
//           ...devicesAlgorithms["blake2b"],
//           consumption: Number(blake2b.rows[0]?.value || 0),
//           id: "9b073f01-ce18-4bb5-bc18-6cbe5923c4af"
//         };
//         devicesAlgorithms["blake2s"] = {
//           ...devicesAlgorithms["blake2s"],
//           consumption: Number(blake2s.rows[0]?.value || 0),
//           id: "45567b9e-a673-4661-8ea1-8ff22ac030a6"
//         };
//         devicesAlgorithms["kheavyhash"] = {
//           ...devicesAlgorithms["kheavyhash"],
//           consumption: Number(kheavyhash.rows[0]?.value || 0),
//           id: "5f90ee86-861f-11ee-932b-300505de685f"
//         };
//         resolve(void 0)
//       })
//     }) 
//   return Object.entries(devicesAlgorithms).map((entry) => {
//     const name = entry[0]
//     const data = entry[1]
//     return ({
//       name,
//       ...data
//     })
//   })
// }

export const getDevicesAlgorithmsList = async (devices: DeviceI[], periodType: ChartPeriodType, filterState: StatsFilterStateI, algorithms: any) => {
  
  const devicesAlgorithms = devices.reduce(
    (
      result: {
        [key: string]: {
          devices: number
          consumption: number
          hashrate: number
          id: string
        }
      },
      item
    ) => {
      if (result[item.algorithm.name]) {
        result[item.algorithm.name].devices += 1
        result[item.algorithm.name].consumption += 0
      } else {
        result[item.algorithm.name] = {
          devices: 1,
          consumption: 0,
          hashrate: 0,
          id: ''
        }
      }

      return result
    },
    {}
  )
    await new Promise<void>((resolve) => {
      Promise.all(algorithms.map((item: any) => {
        return deviceAPI.getDevicesEnergySumDay({
          where: {
              // areaId: filterState.area || "",
              // modelId: filterState.model || "",
              // statusId: filterState.status || "",
              // userId: filterState.client || "",
              // rangeipId: "",
              algorithmId: item.id,
              // createdAt: "$Between([\"2024-09-09 14:00:00\",\"2024-09-09 14:05:00\"])",
              createdAt: `$Between([\"${moment().subtract(5, 'minutes').subtract(3, 'hour').format('YYYY-MM-DD HH:mm:ss')}\",\"${moment().subtract(3, 'hour').format('YYYY-MM-DD HH:mm:ss')}\"])`
            },
            select: {
              createdAt: true,
              value: true
            },
            order: {
              createdAt: "ASC"
            }
            // limit: 1,
            // select: {
            //   value: true
            // },
            // order: {
            //   createdAt: "DESC"
            // },
        })
      })
       ).then(res => {
         const [sha256, scrypt, ethash, equihash, eaglesong, blake2b, blake2s, kheavyhash ] = res;
         algorithms.map((item: any, index: number) => {
          devicesAlgorithms[item.name] = {
            ...devicesAlgorithms[item.name],
            id: item.id,
            consumption: Number(res[index][0] !== undefined ? res[index][0].value : 0)
          }
        })
        // devicesAlgorithms["sha256"] = {
        //   ...devicesAlgorithms["sha256"],
        //   id: "57ca3b7e-861f-11ee-932b-300505de684f",
        //   consumption: Number(sha256.rows[0]?.value || 0)
        // };
        // devicesAlgorithms["scrypt"] = {
        //   ...devicesAlgorithms["scrypt"],
        //   consumption: Number(scrypt.rows[0]?.value || 0),
        //   id: "57ca3cca-861f-11ee-932b-300505de684f"
        // };
        // devicesAlgorithms["ethash"] = {
        //   ...devicesAlgorithms["ethash"],
        //   consumption: Number(ethash.rows[0]?.value || 0),
        //   id: "5f90f02c-861f-11ee-932b-300505de684f"
        // };
        // devicesAlgorithms["equihash"] = {
        //   ...devicesAlgorithms["equihash"],
        //   consumption: Number(equihash.rows[0]?.value || 0),
        //   id: "830768b4-0dea-4f7d-8519-6d93973cf26a"
        // };
        // devicesAlgorithms["eaglesong"] = {
        //   ...devicesAlgorithms["eaglesong"],
        //   consumption: Number(eaglesong.rows[0]?.value || 0),
        //   id: "5f90ee86-861f-11ee-932b-300505de684f"
        // };
        // devicesAlgorithms["blake2b"] = {
        //   ...devicesAlgorithms["blake2b"],
        //   consumption: Number(blake2b.rows[0]?.value || 0),
        //   id: "9b073f01-ce18-4bb5-bc18-6cbe5923c4af"
        // };
        // devicesAlgorithms["blake2s"] = {
        //   ...devicesAlgorithms["blake2s"],
        //   consumption: Number(blake2s.rows[0]?.value || 0),
        //   id: "45567b9e-a673-4661-8ea1-8ff22ac030a6"
        // };
        // devicesAlgorithms["kheavyhash"] = {
        //   ...devicesAlgorithms["kheavyhash"],
        //   consumption: Number(kheavyhash.rows[0]?.value || 0),
        //   id: "5f90ee86-861f-11ee-932b-300505de685f"
        // };
        resolve(void 0)
      }).catch((error) => console.error("error", error))
    }) 

  return Object.entries(devicesAlgorithms).map((entry) => {
    const name = entry[0]
    const data = entry[1]
    return ({
      name,
      ...data
    })
  })
}

export const getDevicesAlgorithmsTableData = (
  head: TableHeadCellI[],
  algorithms: DeviceAlgorithmI[]
) => {
  return algorithms.map((algorithm) => {
    // отдаётся в MW, домножаем на 1000
    const consumption = getEnergyUnit(Number(algorithm.consumption))
    let hashrate = {
      value: algorithm.hashrate.toString(),
      unit: 'GH/s'
    }
    switch (algorithm.name) {
      case 'sha256':
        hashrate = getHashRate(Number(algorithm.hashrate), "GH")
        break
      case 'scrypt':
        hashrate = getHashRate(Number(algorithm.hashrate), "GH")
        break
      case 'ethash':
        hashrate = getHashRate(Number(algorithm.hashrate), "GH")
        break
      case 'equihash':
        hashrate = getHashRate(Number(algorithm.hashrate), "GH")
        break
      case 'eaglesong':
        hashrate = getHashRate(Number(algorithm.hashrate), "GH")
        break
      case 'blake2b':
        hashrate = getHashRate(Number(algorithm.hashrate), "GH")
        break
      case 'blake2s':
        hashrate = getHashRate(Number(algorithm.hashrate), "GH")
        break
      case 'kheavyhash':
        hashrate = getHashRate(Number(algorithm.hashrate), "GH")
        break
    }

    const data = {
      algorithm: Algorithms[algorithm.name],
      devices: algorithm.devices,
      consumption: `${consumption.value} ${consumption.unit}`,
      hashrate: `${hashrate.value} ${hashrate.unit}`
    }

    const columns: TableCellI[] = []

    for (const cell of head) {
      const title = cell.accessor
        ? data[
            cell.accessor as keyof {
              algorithm: string
              devices: number
              consumption: string
              hashrate: string
            }
          ]
        : ''

      const bold = cell.accessor === 'algorithm'
      columns.push({
        ...cell,
        title: title as string,
        bold
      })
    }

    return {
      id: data.algorithm,
      columns
    } as TableRowI
  })
}
