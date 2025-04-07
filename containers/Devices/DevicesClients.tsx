// import { FC, useEffect, useState } from 'react'
// import { Layout } from '@/containers'
// import styles from './Devices.module.scss'
// import { Header, Pagination } from '@/components'
// import { Button, Heading } from '@/ui'
// import { IconLogOut, IconPlus, IconUsers } from '@/icons'
// import DevicesFilter from '@/blocks/Devices/Filter'
// import { deviceAPI, userAPI } from '@/api'

// import { useAtom } from 'jotai'
// import { devicesDataAtom, devicesFilterAtom, devicesUserIdFilterAtom, sortFilterAtom } from '@/atoms/appDataAtom'

// import Dashboard from '../../components/Dashboard'
// import { DevicesTable, DevicesTabs } from '@/blocks'
// import { getDevicesReq } from '@/blocks/Devices/helpers'
// import { deviceUserFormField } from '@/data/devicesForms'
// import RangeIp from '@/blocks/Devices/RangeIp'
// import UploadData from '@/blocks/Devices/UploadData'
// import SendData from '@/blocks/Devices/SendData'
// import SelectAction from '@/blocks/Devices/Action'
// import UploadUsers from '@/blocks/Devices/UploadUsers'
// import LayoutClients from '../Layout/LayoutClients'
// import DevicesFilterClients from '@/blocks/Devices/Filter/FilterClients'
// import DevicesTableClient from '@/blocks/Devices/Table/DeviceTableClient'
// import { userAtom } from '@/atoms'
// import { Menu, MenuItem } from '@mui/material'
// import { useRouter } from 'next/router'
// import ArrowDown from '@/icons/ArrowDown'
// import ProfileUser from '@/components/ProfileUser'

// const INITIAL_PAGE_LIMIT = 15

// const DevicesContainerClients: FC = () => {
//   const [statusTab, setStatusTab] = useState<string | null>(null)
//   const [selectedCount, setSelectedCount] = useState<number>(INITIAL_PAGE_LIMIT)
//   const [loading, setLoading] = useState(true)
//   const [data, setData] = useAtom(devicesDataAtom)
//   const [filter, setFilter] = useAtom(devicesFilterAtom)
//   const [_, setCheckboxFilter] = useAtom(devicesUserIdFilterAtom)
//   const [sortFilter, setSortFilter] = useAtom(sortFilterAtom)
//   const handleTabChange = (tab: string | null) => {
//     setStatusTab(tab)
//     setFilter((prevState) => {
//       return {
//         ...prevState,
//         page: 1
//       }
//     })
//   }

//   const handleCountChange = (newCount: number) => {
//     setFilter((prevState) => {
//       return {
//         ...prevState,
//         page: 1
//       }
//     })
//     setSelectedCount(newCount)
//   }

//   const handlePageChange = (page: number) => {
//     setFilter((prevState) => {
//       return {
//         ...prevState,
//         page
//       }
//     })
//   }
//   const handleDeleteDevice = (id: string) => {
//     deviceAPI.deleteDevice(id).then(() => {
//       setLoading(true)
//       const { page } = filter
//       const where = {
//         statusId: filter.status ? filter.status : statusTab,
//         areaId: filter.area,
//         model: {
//           name: filter.model
//         },
//         algorithmId: filter.algorithm,
//         ipaddr: filter.ip || null,
//         macaddr: filter.mac || null,
//         sn: filter.sn || null,
//         // deviceUsers: {
//           userId: filter.client || null,
//         // },
//         devicePools: {
//           pool: {
//             name: filter.pool || null,
//             user: filter.worker || null
//           }
//         },
//         rangeipId: filter.name && filter.name || null,
//         area: {
//           rangeips: {
//             from: filter.from || null,
//             to: filter.to || null,
//           }
//         }
//       }
//       getDevicesReq(page, selectedCount, where)
//         .then(([devicesRes, statusesRes]) => {
//           setData((prevState) => {
//             return {
//               ...prevState,
//               devices: devicesRes,
//               statuses: statusesRes.rows
//             }
//           })
//         })
//         .catch(console.error)
//         .finally(() => {
//           setLoading(false)
//         })
//     })
//   }

//   useEffect(() => {
//     setLoading(true)
//     Promise.all([
//       deviceAPI.getDevicesStatus(),
//       deviceAPI.getDevicesArea(),
//       deviceAPI.getDevicesAlgorithm(),
//       deviceAPI.getDeviceModel({
//         limit: 999
//       }),
//       // deviceAPI.getRangesIp({
//       //   limit: 999
//       // })
//     ])
//       .then((res) => {
//         const [statuses, area, algorithm, model] = res
//         setData((prevState: any) => {
//           return {
//             ...prevState,
//             statuses: statuses.rows,
//             area: area.rows,
//             algorithms: algorithm.rows,
//             models: model.rows,
//             // names: ranges.rows
//           }
//         })
//         setCheckboxFilter([])
//       })
//       .catch(console.error)
//       .finally(() => {
//         setLoading(false)
//       })
//       .catch(console.error)
//   }, [])

//   useEffect(() => {
//     setLoading(true)
//     Promise.all([
//       deviceAPI.getDevicesStatus(),
//       deviceAPI.getDevicesArea(),
//       userAPI.getUsers({
//         limit: 999,
//         select: {
//           id: true,
//           fullname: true,
//           login: true
//         }
//       }),
//       deviceAPI.getDevicesAlgorithm(),
//       deviceAPI.getDeviceModel({
//         limit: 999
//       }),
//       deviceAPI.getRangesIp({
//         limit: 999
//       })
//     ])
//       .then((res) => {
//         const [statuses, area, users, algorithm, model, ranges] = res
//         setData((prevState: any) => {
//           return {
//             ...prevState,
//             statuses: statuses.rows,
//             area: area.rows,
//             users: users.rows,
//             algorithms: algorithm.rows,
//             models: model.rows,
//             names: ranges.rows
//           }
//         })
//         setCheckboxFilter([])
//       })
//       .catch(console.error)
//       .finally(() => {
//         setLoading(false)
//       })
//       .catch(console.error)
//   }, [])
//   useEffect(() => {
//     const isEmpty = filter.status && filter.status.length !== 0 
//       ? filter.status.every((filterStatus) => filterStatus.value !== statusTab) && statusTab !== null
//       : false
//     if (isEmpty) {
//       setData((prevState) => {
//         return {
//           ...prevState,
//           devices: {
//             rows: [],
//             total: 0
//           }
//         }
//       })
//     } else {
//       setLoading(true)
//       const { page } = filter
//       let where;
//         let testWhere: any = []
//         const { client, model, area, algorithm, name, status, owner } = filter;
//         const clients: any =  client !== null && client.length === 0 ? [null] : client;
//         const owners: any = owner !== null && owner.length === 0 ? [null] : owner;
//         const models: any = model !== null && model.length === 0 ? [null] : model;
//         const areas: any = area !== null && area.length === 0 ? [null] : area
//         const algorithms: any = algorithm !== null && algorithm.length === 0 ? [null] : algorithm
//         const names: any = name !== null && name.length === 0 ? [null] : name
//         const statuss: any = status !== null && status.length === 0 ? [null] : status
//         clients.forEach((clientItem: any) => {
//           owners.forEach((ownerItem: any) => {

//             models.forEach((modelItem: any) => {
//               areas.forEach((areaItem: any) => {    
//                 algorithms.forEach((algorithmItem: any) => {
//                   names.forEach((nameItem: any) => {
//                     statuss.forEach((statusItem: any) => {
//                       const containerName: any = nameItem === null ? [null] : nameItem.value
//                       containerName.forEach((container: any) => {
//                         const someWhere: any = {}
//                         if(filter.isFlashed) {
//                           someWhere.isFlashed = filter.isFlashed
//                         }
//                         if(filter.isGlued) {
//                           someWhere.isGlued = filter.isGlued
//                         }
//                         if(filter.isDisabled) {
//                           someWhere.isDisabled = filter.isDisabled
//                         }
//                         if(clientItem) {
//                           someWhere.userId = clientItem.value
//                         }
//                         if(ownerItem) {
//                           someWhere.ownerId = ownerItem.value
//                         }
//                         // if(filter.status || statusTab) {
//                         //   someWhere.statusId = filter.status || statusTab
//                         // }
//                         if(statusItem !== null || statusTab) {
//                           someWhere.statusId = statusItem !== null 
//                             ? statusItem.value && statusTab 
//                               ? statusTab
//                               : statusItem.value
//                             : statusTab
//                         }
//                         if(areaItem) {
//                           someWhere.areaId = areaItem.value
//                         }
//                         if(modelItem) {
//                           someWhere.modelId = modelItem.value
//                         }
//                         if(algorithmItem) {
//                           someWhere.algorithmId = algorithmItem.value
//                         }
//                         if(filter.ip) {
//                           someWhere.ipaddr = filter.ip
//                         }
//                         if(filter.place) {
//                           someWhere.place = `$Like("%${filter.place}%")`
//                         }
//                         if(filter.mac) {
//                           someWhere.macaddr = filter.mac
//                         }
//                         if(filter.sn) {
//                           someWhere.sn = `$Like("%${filter.sn}%")`
//                         }
//                         if(nameItem) {
//                           someWhere.rangeipId = container
//                         }
//                         if(filter.pool.length !== 0) {
//                           someWhere.devicePools = {
//                             pool: {
//                               name: `$Like("%${filter.pool}%")`
//                             }
//                           }
//                         }
//                         if(filter.worker.length !== 0) {
//                           someWhere.devicePools = {
//                             pool: {
//                               user: `$Like("%${filter.worker}%")`
//                             }
//                           }
//                         }
//                         if(filter.comment) {
//                           someWhere.comment = `$Like("%${filter.comment}%")`
//                         }
//                       //   const where = {
//                       //     userId: clientItem ? clientItem.value : null,
//                       //     statusId: filter.status || statusTab,
//                       //     areaId: areaItem ? areaItem.value : null,
//                       //     modelId: modelItem ? modelItem.value : null,
//                       //     algorithmId: algorithmItem ? algorithmItem.value : null,
//                       //     ipaddr: filter.ip || null,
//                       //     macaddr: filter.mac || null,
//                       //     sn: `$Like("%${filter.sn}%")` || null,
//                       //     rangeipId: nameItem ? nameItem.value : null,
//                       //     devicePools: {
//                       //         pool: {
//                       //           name: filter.pool.length !== 0 && `$Like("%${filter.pool}%")` || null,
//                       //           user: filter.worker.length !== 0 && `$Like("%${filter.worker}%")` || null,
//                       //         }
//                       //     },
//                       //     isFlashed: false,
//                       //     isGlued: false,
//                       //     comment: `$Like("%${filter.comment}%")` || null,
//                       //  };
//                        testWhere.push(someWhere)
//                       })
//                     })
//                   })
//                 });
//               });
//             });
//           })
//         });
     
//       if(testWhere.length === 1) {
//         where = testWhere[0]
//       } else {
//         where = testWhere
//       }
//       getDevicesReq(
//         page, 
//         selectedCount, 
//         where,
//         sortFilter
//       )
//         .then(([
//           devicesRes, 
//           statusesRes
//         ]) => {
//           let promises
       
//             promises = statusesRes.rows.map((row: any) => {
//               const updatedTestWhere: any[] = testWhere.map((whereItem: any) => {
//                 // Создаем копию объекта whereItem
//                 const updatedWhere = { ...whereItem };
//                 // Устанавливаем новое значение statusId равное row.id
//                 updatedWhere.statusId = row.id;
//                 // Возвращаем обновленный объект
//                 return updatedWhere;
//             });
              
//                 return deviceAPI.getDevicesStatusCount({ 
//                   where: updatedTestWhere.length === 1 ? updatedTestWhere[0] : updatedTestWhere
//                 })
               
//               });
//         Promise.all(promises)
//             .then((counts) => {
//                 const updatedStatusCounts: any = [];
    
//                 counts.forEach((count, index) => {
//                     updatedStatusCounts[index] = {
//                         count: count.total,
//                         name: statusesRes.rows[index].name,
//                         color: statusesRes.rows[index].color,
//                         id: statusesRes.rows[index].id
//                     }
//                 });

//                 setData((prevState) => {
//                   return {
//                     ...prevState,
//                     devices: devicesRes,
//                     statuses: updatedStatusCounts
//                   }
//                 })
    
//                 return updatedStatusCounts
//             })
//             .catch((error) => {
//                 console.error(error)
//             });
          
//         })
//         .catch(console.error)
//         .finally(() => {
//           setLoading(false)
//         })
//     }
//   // }
//   }, [filter, statusTab, selectedCount, sortFilter])

//   const [userInfo, setUserInfo] = useAtom(userAtom)

//   const [isOpenProfile, setIsOpenProfile] = useState(false)
//   const [anchorEl, setAnchorEl] = useState(null);

//   const onToggleClick = (e: any) => {
//     setIsOpenProfile((prev) => !prev)
//     setAnchorEl(e.currentTarget)
//   }

//   const router = useRouter()

//   const header = (
//     <Header 
//         title="Устройства"
//         controlsBlock={
//           <div>
//             <div onClick={onToggleClick} 
//             style={{display:"flex", alignItems: "center", gap: "15px", cursor: "pointer"}}>
//               <IconUsers color="#582DEC" width={20} height={20}  />
//               <Heading
//                 text={userInfo?.login || "Юзер"}
//               />
//               <ArrowDown width={15} height={10} style={{transition: "transform 0.3s", transform: isOpenProfile ? "rotate(180deg)" : "rotate(0)"}} />
//             </div>
//             <Menu
//               open={isOpenProfile}
//               anchorEl={anchorEl}
//               onClose={() => setIsOpenProfile(false)}
//               slotProps={{
//                 paper: {
//                   style: {
//                     maxHeight: 250,
//                     width: "150px",
//                     marginTop: "20px"
//                   },
//                 }
//               }}
//             >
//                   <MenuItem
//                     // onClick={handleClick}
//                     // key={item.text}
//                     onClick={() => {
//                       localStorage.removeItem(`${process.env.API_URL}_accessToken`)
//                       localStorage.removeItem(`${process.env.API_URL}_refreshToken`)
//                       router.push('/login')
//                     }}
//                     sx={{
//                       gap: "10px"
//                     }}
//                   >
//                     <IconLogOut width={20} height={20} />
//                     <span>Выйти</span>
//                   </MenuItem>
//             </Menu>
//           </div>
//         }
//       />
//   )

//   return (
//     <LayoutClients pageTitle="Устройства" header={<ProfileUser title='Устройства' />}>
//       <div className={styles.el}>
//         <DevicesFilterClients />
//         <div style={{

//         }}>
//           {/* <SendData /> */}
//           <UploadData />
//           {/* <UploadUsers /> */}
//         </div>
//         <Dashboard>
//           <DevicesTabs
//             statuses={data.statuses || []}
//             filterStatus={filter.status || undefined}
//             onTabChange={handleTabChange}
//             onCountChange={handleCountChange}
//           />

//           {!!data.devices.total && (
//             <DevicesTableClient
//               devices={data.devices.rows}
//               isLoading={loading}
//               onDeleteDevice={handleDeleteDevice}
//             />
//           )}
//           {data.devices.total > selectedCount && (
//             <Pagination
//               onPageChange={handlePageChange}
//               limit={selectedCount}
//               offset={selectedCount * (filter.page - 1)}
//               total_count={data.devices.total}
//               isLoading={loading}
//             />
//           )}
//         </Dashboard>
//       </div>
//     </LayoutClients>
//   )
// }

// export default DevicesContainerClients
