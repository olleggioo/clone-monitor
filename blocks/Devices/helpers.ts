import { TableCellI, TableRowI } from '@/components/Table/Table'
import {
  AreaI,
  BoardI,
  DeviceAreaRangeIpsI,
  DeviceI,
  DevicePoolI,
  DeviceStatusI,
  DeviceUserI,
  StatusType,
  UserI
} from '@/interfaces'
import { devicesTableHead, boardsTableHead, logTableHead, poolTableHead, areasTableHead, devicesRolledTableHead, poolMockTableHead, logErrorTableHead, logAntminerTableHead, logUserTableHead, coolersTableHead, commentsTableHead, modelsTableHead, logByUserTableHead, devicesArchiveRolledTableHead, poolReserveTableHead, accessesTableHead, accessTableHead } from './data'
// import { devicesTableHead, boardsTableHead, logTableHead, poolTableHead, areasTableHead, devicesRolledTableHead, poolMockTableHead, logErrorTableHead, logAntminerTableHead, logUserTableHead, coolersTableHead, commentsTableHead, modelsTableHead, logByUserTableHead, devicesArchiveRolledTableHead, accessTableHead, accessesTableHead } from './data'
import getHashRateUnit from '../../helpers/getHashRateUnit'

import getUptime from '../../helpers/getUptime'
import { deviceAPI, userAPI } from '@/api'
import moment from 'moment'
import { MouseEvent } from 'react'
import { useAtom } from 'jotai'
import { usersAtom } from '@/atoms'
import { ModelI } from '@/containers/Models'
import { devicesDataAtom, RoleAccessesStateI } from '@/atoms/appDataAtom'
import { hasAccess } from '@/helpers/AccessControl'
import { requestsAccessMap, requestsAccessTranslation } from '@/helpers/componentAccessMap'

const translations: any = {
  "id": "ID",
  "name": "Имя",
  "user": "Воркер",
  "url": "Пул",
  "place": "Место",
  "isGlued": "Подмена",
  "url1": "Адрес1",
  "url2": "Адрес2",
  "name2": "Имя2",
  "name3": "Имя3",
  "modelId": "ID модели",
  "algorithmId": "ID алгоритма",
  "sn": "Серийный номер",
  "ipaddr": "IP-адрес",
  "macaddr": "MAC-адрес",
  "nominalHashrate": "Номинальный хешрейт",
  "location": "Локация",
  "rack": "Стойка",
  "shelf": "Полка",
  "comment": "Комментарий",
  "password": "Пароль",
  "areaId": "ID площадки",
  "user2": "Пользователь2",
  "user3": "Пользователь3",
  "url3": "Адрес3",
  "password2": "Пароль2",
  "password3": "Пароль3",
  "profile": "Профиль",
  "voltage": "Напряжение",
  "true": "Да",
  "false": "Нет",
  "index": "Индекс",
  "poolId": "ID пула",
  "deviceId": "ID устройства",
  "pass": "Пароль"
};

const dataProfiles = [
  {label: "Заводской режим", value: '0'},
  {label: "Спящий режим", value: '1'},
  {label: "Режим низкого потребления", value: '3'},
  {label: "Режим легкого разгона", value: '4'},
  {label: "Режим разгона", value: '5'},
];

export const getDevicesArchiveTableData = (
  devices: DeviceI[],
  onRowClick: (id: string) => void,
  sbStatus: boolean,
  users?: any
) => {
  return devices.map((device) => {
    const columns: TableCellI[] = []
    const status = device.status?.name.toLowerCase().replace(' ', '_')
    const area = device.area?.name
    let foundElem
      for (const cell of devicesArchiveRolledTableHead) {
        let title
        let description
        let width
        let additionalDescription;
        let place;
        switch (cell.accessor) {
          case 'model':
            title = device?.model?.name
            description = `SN: ${device.sn}`
            // additionalDescription = `${device.ipaddr}`
            place = `${device.place}`
            break
          case 'owner':
            title = users ? users?.filter((item: any) => item.id === device.ownerId)[0]?.fullname || users?.filter((item: any) => item.id === device.ownerId)[0]?.login : ""
            break
          case 'lastSeenNormal':
            title = moment(device.lastSeenNormal).fromNow()
            break
          case 'container':
            let containerName = device.rangeip.name
            title = containerName|| "Контейнер"
            break
          case 'energy':
            // const boardss = device.deviceBoards?.reduce((prevState, accamulator) => Number(prevState) + parseFloat(accamulator.rateReal), 0)
            // const hashRate = boardss ? boardss : 0
            // title =  device.nominalEnergy && hashRate && `${((device.nominalEnergy * hashRate) / 1000).toFixed(1)} кВт`
            title = `${(Number(device.currentEnergy) / 1000).toFixed(2)} кВт`
            break
          case 'user':
            // const client = userss ? userss.filter((user: any) => user.id === device.userId)[0]?.fullname : ""
            // title = client
            // description = device?.userContract
            if(device.userDevices && device.userDevices.length !== 0) {
              title = device.userDevices[0].user.fullname || device.userDevices[0].user.login
              // description = device.userDevices[0].user.contract
              description = ""
            } else {
              title = ""
              description = ""
            }
            break 
          case 'area':
            title = area || ' '
            break
          // case 'sn':
          //   title = device.sn
          //   break
          case 'devicePool':
            foundElem = device.devicePools && 
              (device.devicePools.find((item: any) => item.pool.index === 0) ||
              device.devicePools.find((item: any) => item.pool.index === 1) ||
              device.devicePools.find((item: any) => item.pool.index === 2));
            title = foundElem?.pool ? foundElem.pool.name.replace("stratum+tcp://", '').split(":")[0] : ''
            break
          case 'deviceWorker':
            foundElem = device.devicePools && 
              (device.devicePools.find((item: any) => item.pool.index === 0) ||
              device.devicePools.find((item: any) => item.pool.index === 1) ||
              device.devicePools.find((item: any) => item.pool.index === 2));
            title = foundElem?.pool ? foundElem.pool.user : ''
            break
          case 'nominalHashrate':
            let hashrate = getHashRateUnit(
              Number((device.nominalHashrate)),
              'GH',
              device.algorithm.name === 'sha256'
                ? 'TH' 
                : device.algorithm.name === "scrypt"
                  ? "MH"
                  : device.algorithm.name === "ethash"
                    ? "GH"
                    : device.algorithm.name === "equihash"
                      ? "KH"
                      : "GH"
            )
            title = `${Number(hashrate.value).toFixed(2)} ${hashrate.unit}`
            break
          case 'deviceBoards':
            const boards = device.deviceBoards?.reduce((prevState, accamulator) => Number(prevState) + parseFloat(accamulator.rateReal), 0)
            let rateReal = getHashRateUnit(
              Number(device.currentRate),
              'GH',
              device.algorithm.name === 'sha256'
                ? 'TH' 
                : device.algorithm.name === "scrypt"
                  ? "MH"
                  : device.algorithm.name === "ethash"
                    ? "GH"
                    : device.algorithm.name === "equihash"
                      ? "KH"
                      : "GH"
            )
            title = device.algorithm.name === "equihash" ? `${Number(rateReal.value).toFixed(2)} ${rateReal.unit}` : `${Number(rateReal.value).toFixed(2)} ${rateReal.unit}`
            break
          // case 'modelId':
          //   title = "Default title"
          default:
            title = cell.accessor ? device[cell.accessor as keyof DeviceI] : ' '
        }
        columns.push({
          ...cell,
          title: title as string,
          description,
          additionalDescription,
          place,
          width,
          status:
            cell.accessor === 'model' && status
              ? (status as StatusType)
              : undefined,
        })
      }

    const handleClick = () => {
      if (device.id) {
        onRowClick(device.id)
      }
    }

    return {
      id: device.id,
      userId: device.userDevices && device.userDevices.length !== 0 ? device.userDevices[0].userId : "",
      status: device.status?.name,
      isReserved: device.isReserved,
      lastSeenNormal: device.lastSeenNormal,
      columns,
      onClick: handleClick,
    } as TableRowI
  })
}

export const getDevicesTableData = (
  devices: DeviceI[],
  onRowClick: (id: string) => void,
  sbStatus: boolean,
  users?: any
) => {
  const [ {users: userss} ] = useAtom(devicesDataAtom)
  return devices.map((device) => {
    const columns: TableCellI[] = []
    const status = device.status?.name.toLowerCase().replace(' ', '_')
    const area = device.area?.name
    let foundElem
      for (const cell of devicesRolledTableHead) {
        let title
        let description
        let width
        let additionalDescription;
        let place;
        switch (cell.accessor) {
          case 'model':
            title = device?.model?.name
            description = `SN: ${device.sn}`
            additionalDescription = `${device.ipaddr}`
            place = `${device.place}`
            break
          case 'partNumber':
            title = device?.partNumber
            break
          case 'owner':
            title = users ? users?.filter((item: any) => item.id === device.ownerId)[0]?.fullname || users?.filter((item: any) => item.id === device.ownerId)[0]?.login : ""
            break
          case 'lastSeenNormal':
            title = moment(device.lastSeenNormal).fromNow()
            break
          case 'notOnlinedAt':
            title = device.notOnlinedAt.length !== 0 ? moment(device.notOnlinedAt).format("YYYY-MM-DD HH:mm") : ""
            break
          case 'container':
            let containerName = device.rangeip.name
            title = containerName|| "Контейнер"
            break
          case 'energy':
            // const boardss = device.deviceBoards?.reduce((prevState, accamulator) => Number(prevState) + parseFloat(accamulator.rateReal), 0)
            // const hashRate = boardss ? boardss : 0
            // title =  device.nominalEnergy && hashRate && `${((device.nominalEnergy * hashRate) / 1000).toFixed(1)} кВт`
            title = `${(Number(device.currentEnergy) / 1000).toFixed(2)} кВт`
            break
          case 'user':
            // const client = userss ? userss.filter((user: any) => user.id === device.userId)[0]?.fullname : ""
            // title = client
            // description = device?.userContract
            if(device.userDevices && device.userDevices.length !== 0) {
              title = device.userDevices[0].user.fullname || device.userDevices[0].user.login
              // description = device.userDevices[0].user.contract
              description = ""
            } else {
              title = ""
              description = ""
            }
            break 
          case 'area':
            title = area || ' '
            break
          // case 'sn':
          //   title = device.sn
          //   break
          case 'isGlued':
            title = device.isGlued ? "Да" : "Нет"
            break
          case 'miningState':
            title = device.isDisabled ? "Выключено" : "Включено"
            break
          case 'rejectedPollsProcents':
            title = `${device?.rejectedPollsProcents} %`
            break
          case 'devicePool':
            foundElem = device.devicePools && 
              (device.devicePools.find((item: any) => item.pool.index === 0) ||
              device.devicePools.find((item: any) => item.pool.index === 1) ||
              device.devicePools.find((item: any) => item.pool.index === 2));
            title = foundElem?.pool ? foundElem.pool.name.replace("stratum+tcp://", '').split(":")[0] : ''
            break
          case 'deviceWorker':
              foundElem = device.devicePools && 
                (device.devicePools.find((item: any) => item.pool.index === 0) ||
                device.devicePools.find((item: any) => item.pool.index === 1) ||
                device.devicePools.find((item: any) => item.pool.index === 2));
              title = foundElem?.pool ? foundElem.pool.user : ''
            break
          case 'uptimeElapsed':
            const seconds = device?.uptimeElapsed
            title = seconds ? getUptime(seconds) : "#Н/Д"
            break
          case 'nominalHashrate':
            let hashrate = getHashRateUnit(
              Number((device.nominalHashrate)),
              'GH',
              device.algorithm.name === 'sha256'
                ? 'TH' 
                : device.algorithm.name === "scrypt"
                  ? "MH"
                  : device.algorithm.name === "ethash"
                    ? "GH"
                    : device.algorithm.name === "equihash"
                      ? "KH"
                      : "GH"
            )
            title = `${Number(hashrate.value).toFixed(2)} ${hashrate.unit}`
            break
          case 'isFlushed':
            title = device.isFlashed ? "Прошит" : "Не прошит"
          break
          case 'deviceBoards':
            const boards = device.deviceBoards?.reduce((prevState, accamulator) => Number(prevState) + parseFloat(accamulator.rateReal), 0)
            let rateReal = getHashRateUnit(
              Number(device.currentRate),
              'GH',
              device.algorithm.name === 'sha256'
                ? 'TH' 
                : device.algorithm.name === "scrypt"
                  ? "MH"
                  : device.algorithm.name === "ethash"
                    ? "GH"
                    : device.algorithm.name === "equihash"
                      ? "KH"
                      : "GH"
            )
            title = device.algorithm.name === "equihash" ? `${Number(rateReal.value).toFixed(2)} ${rateReal.unit}` : `${Number(rateReal.value).toFixed(2)} ${rateReal.unit}`
            break
          // case 'modelId':
          //   title = "Default title"
          default:
            title = cell.accessor ? device[cell.accessor as keyof DeviceI] : ' '
        }
        columns.push({
          ...cell,
          title: title as string,
          description,
          additionalDescription,
          place,
          width,
          status:
            cell.accessor === 'model' && status
              ? (status as StatusType)
              : undefined,
        })
      }

    const handleClick = () => {
      if (device.id) {
        onRowClick(device.id)
      }
    }

    return {
      id: device.id,
      userId: device.userDevices && device.userDevices.length !== 0 ? device.userDevices[0].userId : "",
      status: device.status?.name,
      isReserved: device.isReserved,
      changePoolStatusVerbose: device.changePoolStatusVerbose,
      lastSeenNormal: device.lastSeenNormal,
      columns,
      onClick: handleClick,
    } as TableRowI
  })
}

export const getBoardsTableData = (boards: BoardI[], algorithm?: string) => {
  return boards.map((board, index) => {
    const columns: TableCellI[] = []
    for (const cell of boardsTableHead) {
      const col: any = {
        ...cell
      }
      switch (cell.accessor) {
        case 'icon':
          col.icon = 'chip'
          break
        case 'rateReals': {
          const hashrate = getHashRateUnit(
            Number(board.rateReal),
            'GH',
            algorithm === 'sha256'
              ? 'TH' 
              : algorithm === "scrypt"
                ? 'MH'
                : algorithm === "ethash"
                  ? "GH"
                  : algorithm === "equihash"
                    ? "KH"
                    : "GH"
          )
          col.title = `${Number(hashrate.value).toFixed(2)} ${hashrate.unit}`
          break
        }
        case 'tempOutlet': {
          col.title = `${board.tempOutlet} C°`
          break
        }
        case 'tempChip': {
          col.title = `${board.tempChip} C°`
          break
        }
        default: {
          col.title = cell.accessor
            ? board[cell.accessor as keyof BoardI].toString()
            : ' '
        }
      }
      columns.push(col)
    }
    return {
      id: board.sn,
      columns
    } as TableRowI
  })
}

export const getCollersTableData = (coolers: any[]) => {
  return coolers.map((cooler, index) => {
    const columns: any = []
    for (const cell of coolersTableHead) {
      const col: any = {
        ...cell
      }

      switch(cell.accessor) {
        case 'icon':
          col.icon = "cooler"
          break
        case 'cooler':
          col.title = `Кулер ${index + 1}`
          break
        case 'rpm':
          col.title = `${cooler.value} RPM`
          break
        case 'status':
          col.title = "В норме"
          break
        default: {}
      }
      columns.push(col)
    }
    return {
      // id: board.sn,
      columns
    } as TableRowI
  })
}

export const getPoolReserveTableData = (pools: any[]) => {
  return pools.map((pool, index) => {
    console.log("pool", pool)
    const columns: any = []
    for (const cell of poolReserveTableHead) {
      const col: any = {
        ...cell
      }
      switch (cell.accessor) {
        case 'name': {
          col.title = pool.pool.name
          break
        }
        case 'url': {
          col.title = pool.pool.url
          break
        }
        case 'user': {
          col.title = pool.pool.user
          break
        }
        default: {}
      }
      columns.push(col)
    }
    return {
      id: pool.id,
      columns
    } as TableRowI
  })
}

export const getPoolTableData = (pools: any[]) => {
  return pools.map((pool, index) => {
    console.log("pool", pool)
    const columns: any = []
    for (const cell of poolTableHead) {
      const col: any = {
        ...cell
      }
      switch (cell.accessor) {
        case 'name': {
          col.title = pool.name
          break
        }
        case 'url': {
          col.title = pool.url
          break
        }
        case 'user': {
          col.title = pool.user
          break
        }
        case 'status': {
          col.title = pool.status
        }
        default: {}
      }
      columns.push(col)
    }
    return {
      id: pool.id,
      columns
    } as TableRowI
  })
}

export const getCommentTableData = (comments: any) => {
  const [userList, setUserList] = useAtom(usersAtom)
  return comments.map((comment: any, index: number) => {
    const columns: any = []

    for (const cell of commentsTableHead) {
      const col: any = {
        ...cell
      }
      switch (cell.accessor) {
        case 'user': {
          col.title = userList.filter((user: any) => user.id === comment.userId)[0]?.fullname
          break
        }
        case 'comment': {
          col.title = comment.message
          break
        }
        case 'createdAt': {
          col.title = moment(comment.createdAt).format('YYYY.MM.DD, HH:mm')
          break
        }
        default: {
            
        }
      }
      columns.push(col)
    }
    return {
      id: comment.id,
      columns
    } as TableRowI

  })
}

export const getModelTableData = (models: ModelI[]) => {
  return models.map((model: ModelI, index: number) => {
    const columns: any = []
    for (const cell of modelsTableHead) {
      const col: any = {
        ...cell
      }
      switch (cell.accessor) {
        case 'name': {
          col.title = model.name
          break
        }
        case 'nominalEnergy': {
          col.title = `${model.nominalEnergy} Watt/Gh`
          break
        }
        default: {
            
        }
      }
      columns.push(col)
    }
    return {
      id: model.id,
      columns
    } as TableRowI
  })
}

export const getRoleAccessTableData = (accesses: RoleAccessesStateI[]) => {
  return accesses.map((item, index) => {
    const columns: any = []
    for (const cell of accessesTableHead) {
      const col: any = {
        ...cell
      }
      switch (cell.accessor) {
        case 'name': {
          col.title = item.access.name
          break
        }
        case 'description': {
          const key = Object.keys(requestsAccessMap).find(key => requestsAccessMap[key] === item.access.id);
          col.title = key ? requestsAccessTranslation[key] : undefined;
          break;
        }
        default: {
            col.title = cell.accessor
              ? item[cell.accessor as keyof RoleAccessesStateI].toString()
              : ' '
        }
      }
      columns.push(col)
    }
    return {
      id: item.id,
      columns
    } as TableRowI
  })
}

export const getAreaTableData = (areas: any) => {
  return areas.map((area: any, index: number) => {

    const columns: any = []
    for (const cell of areasTableHead) {
      const col: any = {
        ...cell
      }
      switch (cell.accessor) {
        case 'from': {
          col.title = area.from
          break
        }
        case 'to': {
          col.title = area.to
          break
        }
        case 'name': {
          col.title = area.name
          break
        }
        default: {
            col.title = cell.accessor
              ? area[cell.accessor as keyof BoardI].toString()
              : ' '
        }
      }
      columns.push(col)
    }
    return {
      id: area.id,
      columns
    } as TableRowI
  })
}

export const getPoolMockTableData = (pools: any) => {
  return pools.map((pool: any, index: number) => {

    const columns: any = []
    for (const cell of poolMockTableHead) {
      const col: any = {
        ...cell
      }
      switch (cell.accessor) {
        case 'name': {
          col.title = pool.name
          break
        }
        case 'url': {
          col.title = pool.url
          break
        }
        case 'url1': {
          col.title = pool.url1
          break
        }
        case 'url2': {
          col.title = pool.url2
          break
        }
        default: {
            col.title = cell.accessor
              ? pool[cell.accessor as keyof BoardI].toString()
              : ' '
        }
      }
      columns.push(col)
    }
    return {
      id: pool.id,
      columns
    } as TableRowI
  })
}

export const getLogTableData = (
  page: number, 
  users: UserI[] | [],
  logs: any[]
) => {
  const startIndex = (page - 1) * 50;
  const endIndex = startIndex + 50;
  const sortedLogs = logs?.slice(startIndex, endIndex);
    const parseDate = (dateStr: string) => {
      return moment(dateStr, 'D MMM HH:mm:ss');
  };
  sortedLogs.sort((a: any, b: any) => {
    const aValue: any = new Date(a.createdAt);
    const bValue: any = new Date(b.createdAt)
    
    return bValue - aValue;
  });
  return sortedLogs?.map((log, index) => {
    const columns: any = []
    for (const cell of logTableHead) {
      const col: any = {
        ...cell
      }
      switch (cell.accessor) {
        case 'action': {
          col.title = log.action
          // col.description = log.options
          break
        }
        case 'message': {
          
          col.title = log.message
          break
        } 
        case 'options': {
          col.title = ""
          if(log.options) {
            const parsedData = log.options && JSON.parse(log.options)
            delete parsedData.accessToken;
            delete parsedData.name;
            delete parsedData.name2;
            delete parsedData.name3;
            if (Array.isArray(parsedData)) {
              const data = parsedData.map((item) => {
                  return Object.entries(item)
                    .map(([key, value]) => `${translations[key] || key}: ${value === true 
                      ? 'да' 
                      : value === false
                        ? "нет"
                        : value}`)
                    .join(', \n');
              });
              col.title = data;
          } else {
              col.title = Object.entries(parsedData)
              .map(([key, value]) => `${translations[key] || key}: ${value === true 
                ? 'да' 
                : value === false
                  ? "нет"
                  : value}`)
              .join(', \n');
            }
          }
          break
        }
        case 'user': {
          const findUser = users.filter((user) => user.login === log.login)[0]
          // console.log("findUser", findUser, users.filter((user) => user.login === log.login))
          col.title = findUser ? findUser.fullname : log.login
          
          // col.title = log.fullname.length !== 0 ? log.fullname : log.login;
          break
        }
        case 'executorIp': {
          col.title = log.executorIp;
          break
        }
        case 'before': {
          col.title = "";
            if (log.before) {
              const parsedData = log.before && JSON.parse(log.before);
              parsedData.sort((a: any, b: any) => a.index - b.index);
              const processItem: any = (item: any, indent = 0) => {
                  delete item.index;
                  const indentation = '\t'.repeat(indent);
                  return Object.entries(item)
                      .map(([key, value]) => {
                          if (typeof value === 'object' && value !== null) {
                              return `<b>${translations[key] || key}</b>: ${processItem(value, indent + 1)}`;
                          } else {
                              return `<div style="display: flex; gap: 5px;align-items: center;">
                              <i>${translations[key] || key}:</i>
                              <i>${value}</i>
                              </div>`;
                          }
                      })
                      .join('');
              };
          
              if (Array.isArray(parsedData)) {
                  const data = parsedData
                      .map((item) => {
                          return `<div style="margin-bottom: 20px;">${processItem(item)}</div>`;
                      });
                  col.title = data.join('');
              } else {
                  col.title = processItem(parsedData);
              }
          }
          break;
        }
        case 'after': {
          col.title = "";
          if (log.after) {
            const parsedData = log.after && JSON.parse(log.after);
            parsedData.sort((a: any, b: any) => a.index - b.index);
            const processItem: any = (item: any, indent = 0) => {
                delete item.index;
                const indentation = '\t'.repeat(indent);
                return Object.entries(item)
                    .map(([key, value]) => {
                        if (typeof value === 'object' && value !== null) {
                            return `<b>${translations[key] || key}</b>: ${processItem(value, indent + 1)}`;
                        } else {
                            return `<div style="display: flex; gap: 5px;align-items: center;">
                            <i>${translations[key] || key}:</i>
                            <i>${value}</i>
                            </div>`;
                        }
                    })
                    .join('');
            };
        
            if (Array.isArray(parsedData)) {
                const data = parsedData
                    .map((item) => {
                        return `<div style="margin-bottom: 20px;">${processItem(item)}</div>`;
                    });
                col.title = data.join('');
            } else {
                col.title = processItem(parsedData);
            }
        }
          break;
        }
        case 'source': {
          // col.title = log.source.replace(/^::ffff:/, "")
          col.title = log.userAgent;
          break
        }
        case 'createdAt': {
          col.title = moment(log.createdAt).format("D MMM HH:mm:ss")
          break
        }
        default: {
            // col.title = cell.accessor
            //   ? log[cell.accessor as keyof BoardI].toString()
            //   : ' '
        }
      }
      columns.push(col)
    }
    return {
      // id: board.sn,
      columns
    } as TableRowI
  })
}

export const getLogByUserTableData = (
  page: number, 
  // users: UserI[] | [],
  logs: any[]
) => {
  const startIndex = (page - 1) * 50;
  const endIndex = startIndex + 50;
  const sortedLogs = logs?.slice(startIndex, endIndex);
    const parseDate = (dateStr: string) => {
      return moment(dateStr, 'D MMM HH:mm:ss');
  };
  sortedLogs.sort((a: any, b: any) => {
    const aValue: any = new Date(a.createdAt);
    const bValue: any = new Date(b.createdAt)
    
    return bValue - aValue;
  });
  return sortedLogs?.map((log, index) => {
    const columns: any = []
    for (const cell of logByUserTableHead) {
      const col: any = {
        ...cell
      }
      switch (cell.accessor) {
        case 'action': {
          col.title = log.action
          // col.description = log.options
          break
        }
        case 'info': {
          col.title = `<div style="display: flex; gap: 5px;align-items: center;">
            <i>IP-адрес:</i>
            <i>${log.device.ipaddr}</i>
            </div><div style="display: flex; gap: 5px;align-items: center;">
            <i>MAC-адрес:</i>
            <i>${log.device.macaddr}</i>
            </div><div style="display: flex; gap: 5px;align-items: center;">
            <i>SN:</i>
            <i>${log.device.sn}</i>
            </div>`
          break
        }
        case 'message': {
          
          col.title = log.message
          break
        } 
        case 'options': {
          col.title = ""
          if(log.options) {
            const parsedData = log.options && JSON.parse(log.options)
            delete parsedData.accessToken;
            delete parsedData.name;
            delete parsedData.name2;
            delete parsedData.name3;
            if (Array.isArray(parsedData)) {
              const data = parsedData.map((item) => {
                  return Object.entries(item)
                    .map(([key, value]) => `${translations[key] || key}: ${value === true 
                      ? 'да' 
                      : value === false
                        ? "нет"
                        : value}`)
                    .join(', \n');
              });
              col.title = data;
          } else {
              col.title = Object.entries(parsedData)
              .map(([key, value]) => `${translations[key] || key}: ${value === true 
                ? 'да' 
                : value === false
                  ? "нет"
                  : value}`)
              .join(', \n');
            }
          }
          break
        }
        case 'user': {
          // const findUser = users.filter((user: UserI) => user.id === log.userId)[0]
          // col.title = findUser ? findUser.fullname : ""
          col.title = log.login;
          break
        }
        case 'executorIp': {
          col.title = log.executorIp;
          break
        }
        case 'before': {
          col.title = "";
            if (log.before) {
              const parsedData = log.before && JSON.parse(log.before);
              parsedData.sort((a: any, b: any) => a.index - b.index);
              const processItem: any = (item: any, indent = 0) => {
                  delete item.index;
                  const indentation = '\t'.repeat(indent);
                 
                  return Object.entries(item)
                      .map(([key, value]) => {
                          if (typeof value === 'object' && value !== null) {
                              return `<b>${translations[key] || key}</b>: ${processItem(value, indent + 1)}`;
                          } else {
                              return `<div style="display: flex; gap: 5px;align-items: center;">
                              <i>${translations[key] || key}:</i>
                              <i>${value}</i>
                              </div>`;
                          }
                      })
                      .join('');
                      
              };
          
              if (Array.isArray(parsedData)) {
                  const data = parsedData
                      .map((item) => {
                          return `<div style="margin-bottom: 20px;">${processItem(item)}</div>`;
                      });
                  col.title = data.join('');
              } else {
                  col.title = processItem(parsedData);
              }
          }
          break;
        }
        case 'after': {
          col.title = "";
          if (log.after) {
            const processItem: any = (item: any, indent = 0) => {
              delete item.index;
              const indentation = '\t'.repeat(indent);
              return Object.entries(item)
                .map(([key, value]) => {
                    if (typeof value === 'object' && value !== null) {
                        return `<b>${translations[key] || key}</b>: ${processItem(value, indent + 1)}`;
                    } else {
                        return `<div style="display: flex; gap: 5px;align-items: center;">
                        <i>${translations[key] || key}:</i>
                        <i>${value}</i>
                        </div>`;
                    }
                })
                .join('');
            };
            const parsedAfter = JSON.parse(log.after)
            if(Array.isArray(parsedAfter)) {
              const parsedData = log.after && JSON.parse(log.after);
              parsedAfter.sort((a: any, b: any) => a.index - b.index);
          
              if (Array.isArray(parsedData)) {
                  const data = parsedData
                      .map((item) => {
                          return `<div style="margin-bottom: 20px;">${processItem(item)}</div>`;
                      });
                  col.title = data.join('');
              } else {
                  col.title = processItem(parsedData);
              }
            } else {
              console.log("PARSEDDATA", parsedAfter)
              col.title = processItem(parsedAfter)
            }
        }
          break;
        }
        case 'source': {
          // col.title = log.source.replace(/^::ffff:/, "")
          col.title = log.userAgent;
          break
        }
        case 'createdAt': {
          col.title = moment(log.createdAt).format("D MMM HH:mm:ss")
          break
        }
        default: {
            // col.title = cell.accessor
            //   ? log[cell.accessor as keyof BoardI].toString()
            //   : ' '
        }
      }
      columns.push(col)
    }
    return {
      // id: board.sn,
      columns
    } as TableRowI
  })
}

export const getLogUserTableData = (page: number, logs: any[]) => {
  const startIndex = (page - 1) * 100;
  const endIndex = startIndex + 100;
  const sortedLogs = logs.slice(startIndex, endIndex);

  return sortedLogs.map((log, index) => {

    const columns: any = []
    for (const cell of logUserTableHead) {
      const col: any = {
        ...cell
      }
      switch (cell.accessor) {
        case 'title': {
          col.title = log.title
          // col.description = log.options
          break
        }
        case 'message': {
          
          col.title = log.message
          break
        } 
        case 'data': {
          const arr = [`ip-адрес: ${log.ipaddr}`, `\nmac-адрес: ${log.macaddr}`, `\nsn: ${log.sn}`]
          col.title = arr
          break
        }
        case 'prevdata': {
          col.title = "";
          if (log.prevData !== null) {
            const parsedData = log.prevData !== null && JSON.parse(log.prevData);
            delete parsedData.accessToken;
            delete parsedData.name;
            delete parsedData.name2;
            delete parsedData.name3;
        
            if (Array.isArray(parsedData)) {
              const data = parsedData.map((item) => {
                return Object.entries(item)
                  .map(([key, value]) => {
                    if (key === "profile") {

                      const profileLabel = dataProfiles.find(profile => profile.value === value)?.label;
                      return `${translations[key] || key}: ${profileLabel || value}`;
                    }
                    return `${translations[key] || key}: ${value}`;
                  })
                  .join(', \n');
              });
              col.title = data;
            } else {
              col.title = Object.entries(parsedData)
                .map(([key, value]) => {
                  if (key === "profile") {
                    const profileLabel = dataProfiles.find(profile => profile.value === value)?.label;
                    return `${translations[key] || key}: ${profileLabel || value}`;
                  }
                  return `${translations[key] || key}: ${value}`;
                })
                .join(', \n');
            }
          }
          break;
        }
        case 'options': {
          col.title = ""
          if(log.options) {
            const parsedData = log.options && JSON.parse(log.options)
            delete parsedData.accessToken;
            delete parsedData.name;
            delete parsedData.name2;
            delete parsedData.name3;
            if (Array.isArray(parsedData)) {
              const data = parsedData.map((item) => {
                  return Object.entries(item)
                    .map(([key, value]) => `${translations[key] || key}: ${value === true 
                      ? 'да' 
                      : value === false
                        ? "нет"
                        : value}`)
                    .join(', \n');
              });
              col.title = data;
          } else {
              col.title = Object.entries(parsedData)
              .map(([key, value]) => `${translations[key] || key}: ${value === true 
                ? 'да' 
                : value === false
                  ? "нет"
                  : value}`)
              .join(', \n');
            }
          }
          break
        }
        case 'source': {
          col.title = log.source.replace(/^::ffff:/, "")
          break
        }
        case 'createdAt': {
          col.title = moment(log.createdAt).format("D MMM HH:mm:ss")
          break
        }
        default: {
            // col.title = cell.accessor
            //   ? log[cell.accessor as keyof BoardI].toString()
            //   : ' '
        }
      }
      columns.push(col)
    }
    return {
      // id: board.sn,
      columns
    } as TableRowI
  })
}

export const getLogAntminerData = (page: number, logs: any[]) => {
  const startIndex = (page - 1) * 100;
  const endIndex = startIndex + 100;
  const sortedLogs = logs.slice(startIndex, endIndex);
  return sortedLogs.map((log, index) => {

    const columns: any = []
    for (const cell of logAntminerTableHead) {
      const col: any = {
        ...cell
      }
      switch (cell.accessor) {
        case 'createdAt': {
          col.title = moment(log.createdAt).format("LLL")
          break
        }
        case 'messages': {
          col.title = log.message
          break
        }
        default: {
            // col.title = cell.accessor
            //   ? log[cell.accessor as keyof BoardI].toString()
            //   : ' '
        }
      }
      columns.push(col)
    }
    return {
      // id: board.sn,
      columns
    } as TableRowI
  })
}

export const getAccessTableData = (logs: any[]) => {
  console.log("LOG", logs)
  return logs.map((log, index) => {

    const columns: any = []
    for (const cell of accessTableHead) {
      const col: any = {
        ...cell
      }
      switch (cell.accessor) {
        case 'function': {
          col.title = log.key;
          break
        }
        case 'description': {
          col.title = log.translation
          break
        }
        default: {
            // col.title = cell.accessor
            //   ? log[cell.accessor as keyof BoardI].toString()
            //   : ' '
        }
      }
      columns.push(col)
    }
    return {
      // id: board.sn,
      columns
    } as TableRowI
  })
}

export const getLogErrorTableData = (logs: any[]) => {
  return logs.map((log, index) => {

    const columns: any = []
    for (const cell of logErrorTableHead) {
      const col: any = {
        ...cell
      }
      switch (cell.accessor) {
        case 'createdAt': {
          col.title = moment(log.createdAt).format("D MMM HH:mm:ss")
          // col.description = log.options
          break
        }
        case 'discovered': {
          col.title = moment(log.discoveredAt).format("D MMM HH:mm:ss")
          break
        } 
        case 'processing': {
          col.title = log.processing
          break
        }
        case 'reason': {
          col.title = log.reason
          break
        }
        case 'code': {
          col.title = log.code
          break
        }
        default: {
            // col.title = cell.accessor
            //   ? log[cell.accessor as keyof BoardI].toString()
            //   : ' '
        }
      }
      columns.push(col)
    }
    return {
      // id: board.sn,
      columns
    } as TableRowI
  })
}

export const getDevicesReq = async (
  page: number,
  limit: number,
  params?: any,
  orders?: any
) => {
  const where: any = {};
  for (const [key, value] of Object.entries(params)) {
    switch (key) {
      case 'devicePools':
        const devicesVal = value as DevicePoolI;
        if (devicesVal.pool?.name || devicesVal.pool?.user) {
          where.devicePools = value;
        }
        break;
      default:
        if (value) {
          where[key] = value;
        }
    }
  }

  const newWhere = "0" in where ? Object.values(where) : where;

  const promises = [];

  if (hasAccess(requestsAccessMap.getDevices)) {
    promises.push(
      deviceAPI.getDevices({
        page: page - 1,
        limit,
        order: orders ? orders : {},
        relations: {
          rangeip: true,
          status: true,
          devicePools: { pool: true },
          userDevices: { user: true },
          deviceBoards: true,
          model: true,
          algorithm: true,
          area: true,
        },
        where: newWhere,
        select: {
          id: true,
          algorithm: true,
          partNumber: true,
          currentEnergy: true,
          currentRate: true,
          devicePools: true,
          isDisabled: true,
          isFlashed: true,
          isReserved: true,
          isGlued: true,
          lastSeenNormal: true,
          macaddr: true,
          model: true,
          nominalEnergy: true,
          nominalHashrate: true,
          sn: true,
          status: true,
          uptimeElapsed: true,
          place: true,
          ipaddr: true,
          ownerId: true,
          rangeipId: true,
          rangeip: true,
          rejectedPollsProcents: true,
          userDevices: true,
          notOnlinedAt: true
        },
      })
    );
  }

  if (hasAccess(requestsAccessMap.getDevicesStatus)) {
    promises.push(
      deviceAPI.getDevicesStatus({
        where: {
          id: `$Not($In(["1eda7201-913e-11ef-8367-bc2411b3fd76"]))`,
        },
      })
    );
  }

  const results = await Promise.all(promises);

  const devicesRes = hasAccess(requestsAccessMap.getDevices) ? results.shift() : null;
  const statusesRes = hasAccess(requestsAccessMap.getDevicesStatus) ? results.shift() : null;

  return { devicesRes, statusesRes };
};
