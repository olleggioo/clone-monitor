import { deviceAPI } from "@/api"
import { areaRangesIp, areasAtom, deviceUpdateRanges } from "@/atoms/appDataAtom"
import { areasTableHead } from "@/blocks/Devices/data"
import { getAreaTableData, getLogTableData } from "@/blocks/Devices/helpers"
import { Dashboard, Table } from "@/components"
import TestTable from "@/components/Table/TestTable"
import { IconEdit2, IconTrash } from "@/icons"
import RangesEditModal from "@/modals/Areas"
import Alert from "@/modals/Areas/Alert"
import { DropdownItemI } from "@/ui/Dropdown/Dropdown"
import { useAtom } from "jotai"
import { useSnackbar } from "notistack"
import { memo, useEffect, useMemo, useState } from "react"
import styles from "./Table.module.scss"
import getEnergyUnit from "@/helpers/getEnergyUnit"
import moment from "moment"
import SimpTable from "@/components/Table/SimpTable"
import { deviceAtom } from "@/atoms"
import { inet_aton } from "@/util/iten_atom"
import SortAction from "@/components/Table/TableHead/Sort"
import { hasAccess } from "@/helpers/AccessControl"
import { requestsAccessMap } from "@/helpers/componentAccessMap"

const AreasTable = ({rows, onDeleteDevie}: any) => {
    const [currentRow, setCurrentRow] = useState(rows)
    // const [modalUpdateRanges, setModelUpdateRanges] = useAtom(deviceUpdateRanges)
    const [modalUpdateRanges, setModelUpdateRanges] = useState(false)

    const [alertMessage, setAlertMessage]= useState(false)
    const [rangesIp, setRangesIp] = useAtom(areaRangesIp)
    const [areas, setAreas] = useAtom(areasAtom)
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ASC' })
    

    useEffect(() => {
        if(rows) {
            setCurrentRow(rows)
        }
    }, [])

    const tableData = getAreaTableData(rows)


    // const tableData = useMemo(() => {
    //     return {
    //       columns: areasTableHead,
    //       rows: getAreaTableData(currentRow)
    //     }
    // }, [currentRow])

    const handleAlertClick = (id?: string) => {
        setAlertMessage(true)
        if(id) {
            setRangesIp(id)
        }
    }
    const {enqueueSnackbar} = useSnackbar()

    const dateFrom = {
        day: moment().startOf('day').format('YYYY-MM-DD HH:mm'),
        week: moment().subtract(1, 'week').format('YYYY-MM-DD HH:mm'),
        month: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm')
      }
    
    const dateNow = moment().format('YYYY-MM-DD HH:mm')

    const handleDeleteClick = () => {
        if(rangesIp) {
            deviceAPI.deleteRangeIpById(rangesIp)
                .then(res => {
                    // setCurrentRow((prevState: any) => prevState.filter((item: any) => item.id !== rangesIp))
                    deviceAPI.getDevicesArea({
                        relations: {
                            rangeips: true
                        }
                      })
                        .then(res => {
                          deviceAPI.getDevicesStatus()
                          .then((statuses) => {
                              const promisesUptime = res.rows.map((item: any) => {
                                  return deviceAPI.getDevicesUptimeCacheDayAvg({
                                      where: {
                                          createdAt: `$Between([\"${dateFrom.day}\",\"${dateNow}\"])`,
                                          areaId: item.id
                                      },
                                  })
                              })
          
                              const promisesEnergy = res.rows.map((item: any) => {
                                  return deviceAPI.getDevicesEnergyCacheDaySum({
                                      where: {
                                          createdAt: `$Between([\"${dateFrom.day}\",\"${dateNow}\"])`,
                                          areaId: item.id
                                      },
                                  })
                              })
          
                              const promises = res.rows.map((item: any) => {
                                  return Promise.all(statuses.rows.map((row: any) => {
                                      return deviceAPI.getDevicesStatusCount({
                                          where: { statusId: row.id, areaId: item.id }
                                      })
                                  }))
                              })
          
                              Promise.all([...promises, ...promisesUptime, ...promisesEnergy])
                                .then((resPromise: any) => {
                                    const statuses = resPromise.slice(0, res.rows.length);
                                    const uptime = resPromise.slice(res.rows.length, res.rows.length * 2);
                                    const energy = resPromise.slice(res.rows.length * 2);
          
                                    const updatedAreas = res.rows.map((area: any, index: number) => {
                                        const [isNormal, isWarning, isNotConfigured, isNotOnline, isError] = statuses[index].map((count: any) => count.total);
                                        return {
                                            ...area,
                                            isNormal,
                                            isWarning,
                                            isNotConfigured,
                                            isNotOnline,
                                            isError,
                                            uptime: uptime[index],
                                            energy: getEnergyUnit(energy[index] / 4)
                                        };
                                    });
                                    setAreas(updatedAreas);
                                  })
                                .catch(err => console.error(err))
                            })
                            .catch(err => console.error(err))
                        }).catch(err => console.error(err))
                    setAlertMessage(false)
                    enqueueSnackbar("Диапазон успешно удалён", {
                        variant: "success",
                        autoHideDuration: 3000
                    })
                })
                .catch(err => console.error(err))
        }
    }

    const handleEditClick = (id?: string) => {
        if(id) {
            setRangesIp(id)
            setModelUpdateRanges(true);
        }
    }
    
    const tableDropDownItems: DropdownItemI[] = [
    ]

    if(hasAccess(requestsAccessMap.updateOneRangesIp)) {
        tableDropDownItems.push({
            text: 'Редактировать',
            icon: <IconEdit2 width={20} height={20} />,
            onClick: handleEditClick
        })
    }

    if(hasAccess(requestsAccessMap.deleteRangeIpById)) {
        tableDropDownItems.push({
            text: 'Удалить',
            icon: <IconTrash width={20} height={20} />,
            onClick: handleAlertClick,
            mod: 'red'
        })
    }

      const handleSort = (key: string) => {
        let direction = 'ASC'
        if (sortConfig.key === key && sortConfig.direction === 'ASC') {
            direction = 'DESC'
        }
        setSortConfig({ key, direction })
    }

    const [device] = useAtom(deviceAtom)

    const columnHead = [
        {
            accessor: "from",
            title: "Диапазон от"
        },
        {
            accessor: "to",
            title: "Диапазон до"
        },
        {
            accessor: "name",
            title: "Имя"
        },
    ]

    return <Dashboard
    headerTable={
    <div className={styles.headingTable}>
        {device !== "mobile" && columnHead.map((item) => {
            const isSortingColumn = sortConfig && sortConfig.key === item.accessor;
            const sortDirection = sortConfig && sortConfig.direction;
            return <div className={styles.flexHead}>
                {isSortingColumn && <SortAction isSort={isSortingColumn} direction={sortDirection} />}
                <span key={item.accessor} className={styles.headingColum} onClick={() => handleSort(item.accessor)}>{item.title}</span>
            </div>
        })}
    </div>
    } 
    className={styles.dashboard}>
    {modalUpdateRanges && <RangesEditModal itModal state={rangesIp} onClose={() => setModelUpdateRanges(false)} /> }
    {alertMessage && 
        <Alert 
            title={"Удаление IP-диапазона"} 
            content={"Предупреждение: данное действие удалит связанные аппараты."} 
            open={alertMessage} 
            setOpen={setAlertMessage} 
            handleDeleteClick={handleDeleteClick} 
        />
    }
        {device !== "mobile" ? <SimpTable 
            rows={tableData}
            columns={areasTableHead}
            dropdownItems={tableDropDownItems}
            required={false}
            reqSort={true}
            className={styles.container}
            onSort={handleSort}
            sortConfigures={sortConfig}
        /> : <TestTable 
            rows={tableData}
            columns={areasTableHead}
            dropdownItems={tableDropDownItems}
            required={false}
            reqSort={true}
            className={styles.container}
        />}
    </Dashboard>
}

export default memo(AreasTable)