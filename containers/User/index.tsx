import { FC, useCallback, useEffect, useMemo, useState } from "react"
import { deviceAtom } from "@/atoms"
import { useAtom } from "jotai"
import Layout from "../Layout"
import { Dashboard, Dialog, Header, Pagination, TabsControls } from "@/components"
import styles from "./User.module.scss"
import UserInfo from "@/components/UserInfo"
import { userInfoMockClient, userInfoMockDefault } from "@/mocks"
import AccordionComponent from "@/components/Accordion"
import { getDevicesReq } from "@/blocks/Devices/helpers"
import { DevicesTable, DevicesTabs } from "@/blocks"
import UserWrapper from "@/blocks/Devices/Log/UserWrapper"
import { getStatusName } from "@/helpers"
import { deviceAPI } from "@/api"
import { Button } from "@/ui"
import moment from "moment"
import { saveAs } from 'file-saver';
import { DevicesExportStateI, deviceUpdateManyPool, devicesUpdatesMany, devicesUserIdFilterAtom, modalInfoAtom, modalMinStateActionAtom, modalUpdateDisperseManyAtom, modalUpdateUserManyAtom, sortFilterAtom } from "@/atoms/appDataAtom"
import DropdownActions from "@/ui/Dropdown/DropdownActions"
import { DropdownItemI } from "@/ui/Dropdown/Dropdown"
import { IconChart, IconCpu, IconDevice, IconEdit2, IconPlay, IconRefresh, IconTrash } from "@/icons"
import DatePicker from "react-datepicker"
import ru from 'date-fns/locale/ru';
import { atomPeriodFromToCharts } from "@/atoms/statsAtom"
import { useRouter } from "next/router"
import ProfileUser from "@/components/ProfileUser"
import DevicesTableManager from "@/blocks/Devices/Table/DeviceTableMangaer"
import MultiSelectUser from "@/components/MultiSelect/User"
import { OptionItemI } from "@/ui/CustomSelect/CustomSelect"
import { selectPlaceholdersExport } from "@/blocks/Devices/data"
import formatDate from "@/helpers/formatDate"
import { generateWhereClause } from "@/helpers/generateWhereClause"
import Log from "@/blocks/Devices/Log"
import LogByUser from "@/blocks/Devices/Log/LogByUser"
import { hasAccess } from "@/helpers/AccessControl"
import { requestsAccessMap } from "@/helpers/componentAccessMap"
import IconSliders from "@/icons/Sliders"
import IconDashboardPerfomance from "@/icons/DashboardPerfomance"
import IconPower from "@/icons/Power"
import Alert from "@/modals/Areas/Alert"

interface UserI {
    fullname?: string
    login: string
    email: string
    phone?: string
    contract?: string
    roleId: string
    // listLog?: any
    userDevices?: any
}

const UserContainer: FC<UserI> = ({
    fullname,
    login,
    email,
    phone,
    contract,
    roleId,
    // listLog,
    userDevices
}) => {
    const roleIds = localStorage.getItem(`${process.env.API_URL}_role`)
    const ownerId = localStorage.getItem(`${process.env.API_URL}_id`)
    const router = useRouter()
    const id = (router.query.id as string) || undefined;
    console.log("{DSADAS", id)

    const [dateRange, setDateRange] = useAtom(atomPeriodFromToCharts);
    const [startDate, endDate] = dateRange;
    
    const [device] = useAtom(deviceAtom)
    const [devicesUsers, setDevicesUsers] = useState<any>(null)
    const [selectedCount, setSelectedCount] = useState<number>(50)
    const [statuses, setStatuses] = useState<any>([])
    const [page, setPage] = useState(1)
    const [currentTab, setCurrentTab] = useState("Все")
    const [filterTabValue, setFilterTabValue] = useState<any>(null)
    const [sortFilter, setSortFilter] = useAtom(sortFilterAtom)

    const Buttons = () => {
        return <div className={styles.actions}>
            {roleId === process.env.ROLE_CLIENT_ID && <Button 
                title="Сформировать отчёт"
                onClick={uploadData}
            />}
            
        </div>
    }

    const handlePageChange = (page: number) => {
        setPage(page)
    }

    const dateFrom = {
        day: moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm'),
        week: moment().subtract(1, 'week').format('YYYY-MM-DD HH:mm'),
        month: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm')
      }
    const dateNow = moment().format('YYYY-MM-DD HH:mm')

    const uploadData = () => {
        if(id) {
            deviceAPI.testReport({
                where: {
                    ownerId: id
                },
                createdAt: [
                    `${moment(startDate).format("YYYY-MM-DD HH:mm")}`,
                    `${moment(endDate).add(1, 'day').subtract(1, 'minute').format("YYYY-MM-DD HH:mm")}`
                ],
            }, {
                generatePrice: false,
                datesHidden: true,
                table: "energy",
                notNecessaryHidden: true,
                userId: id,
                billMode: true,
                byUser: false
            })
            .then(res => {
                // console.log(`power_report_${moment(startDate).format("YYYY-MM-DD HH:mm")}_${moment(endDate).add(1, 'day').subtract(1, 'minute').format("YYYY-MM-DD HH:mm")}_площадки=(${areas.map((item: any) => item.label)})_алгоритмы=(${algorithms.map((item: any) => item.label)})_клиенты=(${clients.map((item: any) => item.label)})_models=(${models.map((item: any) => item.label)}).xlsx`)
                const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                let readString = `${moment(dateFrom.month).subtract(15, 'days').format("YYYY-MM-DD HH:mm")}_${moment(dateNow).add(1, 'day').subtract(1, 'minute').format("YYYY-MM-DD HH:mm")}`
                // console.log(readString)
                saveAs(blob, `power_report_${readString}.xlsx`);
            })
            .catch((error) => {
                
            })
        }
    }

    const tabControls = useMemo(() => {
        const statusList = statuses && statuses.map((status: any) => {
            const text = getStatusName(status.name)
            const count = status.count
            return {
                text,
                id: status.id,
                mod: status.color,
                count
            }
            })

        return [{ text: 'Все' }, ...statusList]
    }, [statuses]);
    useEffect(() => {
        if(userDevices && userDevices.length !== 0) {
            let where = {
                userDevices: {
                    userId: id
                }
            };
            let testWhere: any = [];
            const pageSize = selectedCount;
            const startIdx = (page - 1) * pageSize;
            const endIdx = Math.min(startIdx + pageSize, userDevices.length);
            const pageDevices = userDevices.slice(startIdx, endIdx);
            pageDevices.forEach((item: any) => {
                const obj = {
                    id: item.deviceId,
                    statusId: filterTabValue !== undefined ? filterTabValue : null,
                    userDevices: {userId: id}
                }
                testWhere.push(obj)
            });
            getDevicesReq(
                1, 
                selectedCount, 
                // testWhere.length === 1 ? testWhere[0] : testWhere,
                where,
                sortFilter
            ).then((res: any) => {
                const {devicesRes, statusesRes} = res
                console.log("DEVICE", devicesRes, res)
                    setDevicesUsers(devicesRes)
            }).catch(err => console.error(err))
        }
    }, [userDevices, page, filterTabValue, sortFilter])

    const header = (
        <ProfileUser 
            title={fullname || login}
        />
    )
    let techInfo;
    if(roleId === process.env.ROLE_CLIENT_ID) {

        techInfo = userInfoMockClient.map((item: any) => {
            switch (item.label.toLowerCase()) {
                case 'телефон':
                    item.value = phone || ''
                    break
                case 'почта':
                    item.value = email
                    break
                case 'контракт':
                    item.value = contract || ''
                    break
                case 'логин':
                    item.value = login || ''
                    break
                case 'роль':
                    const roleName = roleId === process.env.ROLE_CLIENT_ID
                        ? "Клиент"
                        : roleId === process.env.ROLE_MANAGER_ID
                            ? "Администратор"
                            : "Владелец"
                    item.value = roleName
            }
            return item
        })
    } else {
        techInfo = userInfoMockDefault.map((item) => {
            switch (item.label.toLowerCase()) {
                case 'телефон':
                    item.value = phone || ''
                    break
                case 'почта':
                    item.value = email
                    break
                case 'контракт':
                    item.value = contract || ''
                    break
                case 'логин':
                    item.value = login || ''
                    break
                case 'роль':
                    const roleName = roleId === process.env.ROLE_CLIENT_ID
                        ? "Клиент"
                        : roleId === process.env.ROLE_MANAGER_ID
                            ? "Администратор"
                            : "Владелец"
                    item.value = roleName
            }
            return item
        })
    }
    const handleTabsChange = (value: string, id?: string) => {
        setCurrentTab(value)
        setFilterTabValue(id)
        setPage(1)
    }

    const [state, setCheckboxFilter] = useAtom(devicesUserIdFilterAtom)
    const [updateManyUserModal, setUpdateManyUserModal] = useAtom(modalUpdateUserManyAtom)
    const [alertMessage, setAlertMessage] = useState(false)
    const [modalUpdate, setModelUpdate] = useAtom(deviceUpdateManyPool)
    const [modalInfo, setModalInfo] = useAtom(modalInfoAtom)
    const [modalDisperseMany, setModalDisperseMany] = useAtom(modalUpdateDisperseManyAtom)
    const [sucessReload, setSuccessReload] = useState(false)
    const [deviceUpdate, setDeviceUpdate] = useAtom(devicesUpdatesMany)
    const [modalMinState, setModalMinState] = useAtom(modalMinStateActionAtom)
    const [deleteManyDevices, setDeleteManyDevices] = useState(false)
    const [modalEnableManyDevices, setModalEnableManyDevices] = useState(false)
    const [modalDisableManyDevices, setModalDisableManyDevices] = useState(false)

    const handleUpdateModalUser = (e: any) => {
        setUpdateManyUserModal(true)
    }

    const tableDropDownItems: DropdownItemI[] = [
    ]

    if(hasAccess(requestsAccessMap.enableDevice)) {
        tableDropDownItems.unshift({
          text: 'Включить',
          icon: <IconPlay width={20} height={20} />,
          onClick: () => setModalEnableManyDevices(true)
        })
    }
    
      if(hasAccess(requestsAccessMap.disableDevice)) {
        tableDropDownItems.unshift({
          text: 'Выключить',
          icon: <IconPower width={20} height={20} />,
          onClick: () => setModalDisableManyDevices(true)
        })
    }
    
    if(hasAccess(requestsAccessMap.createUserDevice) && hasAccess(requestsAccessMap.deleteUserDevicesMany)) {
        tableDropDownItems.unshift({
          text: 'Обновить клиентов',
          icon: <IconRefresh width={20} height={20} />,
          onClick: handleUpdateModalUser
        })
    }
    
    if(hasAccess(requestsAccessMap.updateManyDevicesPools)) {
        tableDropDownItems.unshift({
          text: 'Обновить пулы',
          icon: <IconSliders width={20} height={20} />,
          onClick: () => setModelUpdate(true)
        })
    }
    
    if(hasAccess(requestsAccessMap.updateDeviceMany)) {
        tableDropDownItems.unshift({
          text: 'Обновить устройства',
          icon: <IconEdit2 width={20} height={20} />,
          onClick: () => setDeviceUpdate(true),
        })
    }
    
    if(hasAccess(requestsAccessMap.reloadManyDevices)) {
        tableDropDownItems.unshift({
          text: 'Перезагрузить',
          icon: <IconRefresh width={20} height={20} />,
          onClick: () => setAlertMessage(true)
        })
    }
    
    if(hasAccess(requestsAccessMap.updateManyOverclock)) {
        tableDropDownItems.unshift({
          text: 'Разогнать',
          icon: <IconDashboardPerfomance width={20} height={20} />,
          onClick: () => setModalDisperseMany(true)
        })
    }
    if(hasAccess(requestsAccessMap.deleteManyDevices)) {
        tableDropDownItems.push({
          text: "Удалить",
          icon: <IconTrash width={20} height={20} />,
          onClick: () => setDeleteManyDevices(true),
          mod: "red"
        })
    }

    const [states, setStates] = useState<any>({
        table: null,
    });

    interface DevicesExportUserStateI {
        table: any | null
    }

    const getSelectData = (
        name: keyof DevicesExportUserStateI,
        options: OptionItemI[]
      ) => {
        const selected =
          states[name] !== null
            ? options.find((option) => option.value === states[name]) ||
              selectPlaceholdersExport[name]
            : selectPlaceholdersExport[name]
        return {
          placeholder: selectPlaceholdersExport[name]
            ? selectPlaceholdersExport[name]
            : undefined,
          options,
          selectedOption: selected
        };
      };
    
      const handleSelectChange = (
        name: keyof DevicesExportStateI,
        value: string | null | boolean | any
      ) => {
        setStates((prevState: any) => {
          const newState = {
            ...prevState,
            [name]: value,
          }
          return newState;
        });
      };
    
      const handleTableChange = (e: any, newValue: any) => {
        handleSelectChange('table', newValue || null)
      };
    
      const tableOptions: OptionItemI[] = [
        {label: "Хешрейт", value: "hashrate"},
        {label: "Потребление", value: "energy"},
      ];
      const tableProps = useMemo(() => getSelectData('table', tableOptions), [states.table]);
    
    const [open, setOpen] = useState(false)
    const getDevicesReport = () => {
        if (states?.table?.value && ownerId) {
            const payload = {
              where: {
                ownerId: id
              },
              createdAt: [formatDate(startDate), formatDate(endDate, true)],
            };
        
            const reportOptions = {
                generatePrice: false,
                datesHidden: true,
                table: states.table.value,
                notNecessaryHidden: true,
                userId: id ? id : "",
                billMode: true,
                byUser: false
            };
        
            deviceAPI.testReport(payload, reportOptions)
              .then(res => {
                const blob = new Blob([res], {
                  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });
                saveAs(blob, `report_${formatDate(startDate)}_${formatDate(endDate, true)}.xlsx`);
              })
              .catch((error) => console.error(error.message || 'Ошибка'));
        }
    }

    const [listLog, setListLog] = useState<any>()

    const fetchHistoryData = useCallback(async () => {
        if (!login) return;
        try {
          const historyData = await deviceAPI.getDeviceDataHistory({
            where: {
                login
            },
            relations: {
                device: true
            }
          })
          setListLog((prevState: any) => ({ ...prevState, ...historyData }))
        } catch (error) {
          console.error(error);
        }
    }, [login])

    useEffect(() => {
        if(hasAccess(requestsAccessMap.getDeviceDataHistory)) {
            fetchHistoryData();
        }
    }, [fetchHistoryData])

    const enableDevices = (ids: any) => {
        if(ids && ids.length !== 0) {
            const where: any = []
            ids.map((item: any) => {
                where.push({
                    id: item
                })
            })
            deviceAPI.enableDevice({
                where
            }).then((res) => {
                // onClose()
                setModalInfo({
                    open: true,
                    action: "Изменение состояния майнинга",
                    status: "Успешно",
                    textInAction: "Состояние майнинга устройств изменится в течении 30 секунд"
                })
                setModalEnableManyDevices(false)
                setTimeout(() => {
                  window.location.reload()
                }, 2000)
            }).catch(err => {
                setModalInfo({
                    open: true,
                    action: "Изменение состояния майнинга",
                    status: "Ошибка",
                    textInAction: "Произошла ошибка при измении состояния майнгина"
                })
                setModalEnableManyDevices(false)
            })
        }
    }
    
    const disableDevices = (ids: any) => {
        if(ids && ids.length !== 0) {
            const where: any = []
            ids.map((item: any) => {
                where.push({
                    id: item
                })
            })
            deviceAPI.disableDevice({
                where
            }).then((res) => {
                // onClose()
                setModalInfo({
                    open: true,
                    action: "Изменение состояния майнинга",
                    status: "Успешно",
                    textInAction: "Состояние майнинга устройств изменится в течении 30 секунд"
                })
                setModalDisableManyDevices(false)
                setTimeout(() => {
                  window.location.reload()
                }, 2000)
            }).catch(err => {
                setModalInfo({
                    open: true,
                    action: "Изменение состояния майнинга",
                    status: "Ошибка",
                    textInAction: "Произошла ошибка при измении состояния майнгина"
                })
                setModalDisableManyDevices(false)
            })
        }
    
    }

    const handleDisableDevices = () => {
        if(state.length > 0) {
          const devicesIds = state.map((item: any) => item.id)
          disableDevices(devicesIds)
        }
    }

    const handleEnableDevices = () => {
        if(state.length > 0) {
          const devicesIds = state.map((item: any) => item.id)
          enableDevices(devicesIds)
        }
    }

    return device !== "mobile" ? (
        <Layout 
        header={header}
        >
            {modalEnableManyDevices &&
                state.length > 0 &&
                <Alert 
                    title={"Включение выделенных устройств"} 
                    content={"Вы уверены что хотите включить выделенные устройства?"} 
                    open={modalEnableManyDevices} 
                    setOpen={setModalEnableManyDevices} 
                    handleDeleteClick={handleEnableDevices} 
                />
            }

            {modalDisableManyDevices &&
                state.length > 0 &&
                <Alert 
                    title={"Выключение выделенных устройств"} 
                    content={"Вы уверены что хотите выключить выделенные устройства?"} 
                    open={modalDisableManyDevices} 
                    setOpen={setModalDisableManyDevices} 
                    handleDeleteClick={handleDisableDevices} 
                />
            }
            <div className={styles.el}>
                <div className={styles.elGrid}>
                    <UserInfo items={techInfo} />
                    {open && <Dialog
                        title="Экспорт"
                        onClose={() => setOpen(false)}
                        closeBtn
                        className={styles.el}
                    >
                        <div className={styles.fields}>
                            <MultiSelectUser 
                                {...tableProps}
                                label='Таблица'
                                onChange={handleTableChange}
                                className={styles.field}
                            />
                            <div className={styles.dateSelector} onClick={(e) => e.stopPropagation()}>
                                <DatePicker
                                    locale={ru}
                                    wrapperClassName={styles.dataPicker}
                                    selectsRange={true}
                                    startDate={startDate}
                                    portalId="dataPicker"
                                    endDate={endDate}
                                    onChange={(update) => {
                                    setDateRange(update);
                                    }}
                                    isClearable={true}
                                    placeholderText={'Диапазон дат'} 
                                />
                            </div>
                            <Button 
                                title="Экспорт"
                                onClick={getDevicesReport}
                                disabled={!(states && states.table !== null && startDate !== null && endDate !== null)}
                            />
                        </div>
                    </Dialog>}
                    <Dashboard title="Выгрузка">
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            // alignItems: "center",
                            gap: "20px"
                        }}>
                            <Button 
                                title="Открыть"
                                onClick={() => setOpen(true)}
                            />
                        </div>
                    </Dashboard>
                </div>
                {roleId === process.env.ROLE_CLIENT_ID && <Dashboard>
                    {roleId === process.env.ROLE_CLIENT_ID && <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        height: '3rem'
                    }}>
                        <TabsControls
                            items={tabControls} 
                            currentTab={currentTab}
                            onChange={handleTabsChange}
                        />
                        {state.length > 0 && <DropdownActions 
                            items={tableDropDownItems}
                            className={styles.buttonMoreActions}
                            // className={styles.actions}
                        />}
                    </div> 
                    }
                    {devicesUsers !== null && hasAccess(requestsAccessMap.getDevices) && <DevicesTable
                            devices={devicesUsers.rows}
                            // isLoading={loading}
                            // onDeleteDevice={handleDeleteDevice}
                        />}
                    {/* {devicesUsers !== null && 
                        roleIds === process.env.ROLE_MANAGER_ID && <DevicesTableManager
                            devices={devicesUsers.rows}
                            // isLoading={loading}
                            // onDeleteDevice={handleDeleteDevice}
                        />
                    } */}
                    {userDevices !== null && userDevices.length > selectedCount && (
                        <Pagination
                            onPageChange={handlePageChange}
                            limit={selectedCount}
                            offset={selectedCount * (page - 1)}
                            total_count={userDevices.length}
                            // isLoading={loading}
                        />
                    )}
                </Dashboard>}
                {hasAccess(requestsAccessMap.getDeviceDataHistory) && <AccordionComponent 
                    title='История действий пользователя'
                    editable={false}
                    >
                    {/* <UserWrapper /> */}
                    {listLog && listLog.rows && listLog.rows.length !== 0 && 
                    <LogByUser id={id} listLog={listLog && listLog.rows && listLog.rows.length !== 0 ? listLog : {rows: []}} />}
                </AccordionComponent>}
            </div>
        </Layout>
    ) : (
        <Layout header={header} pageTitle={fullname || login}>
            <div className={styles.el}>
                <UserInfo items={techInfo} />
                <Dashboard title="Выгрузка">
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            // alignItems: "center",
                            gap: "20px"
                        }}>
                            {roleId === process.env.ROLE_CLIENT_ID && <DatePicker
                                locale={ru}
                                wrapperClassName={styles.dataPicker}
                                selectsRange={true}
                                startDate={startDate}
                                portalId="dataPicker"
                                endDate={endDate}
                                onChange={(update) => {
                                    setDateRange(update);
                                }}
                                isClearable={true}
                                placeholderText={'Диапазон дат'} 
                            />}
                            <div className={styles.actions}>
                                {roleId === process.env.ROLE_CLIENT_ID && <Button 
                                    className={styles.createReport}
                                    title="Сформировать отчёт"
                                    onClick={uploadData}
                                />}
                            </div>
                            
                        </div>
                    </Dashboard>
                <Dashboard>
                    {devicesUsers && devicesUsers.rows && devicesUsers.rows.length !== 0 && <DevicesTable
                        devices={devicesUsers.rows}
                        // isLoading={loading}
                        // onDeleteDevice={handleDeleteDevice}
                    />}
                </Dashboard>
                <AccordionComponent 
                        title='История действий пользователя'
                        editable={false}
                    >
                        <UserWrapper />
                </AccordionComponent>
            </div>
        </Layout>
    )
}

export default UserContainer