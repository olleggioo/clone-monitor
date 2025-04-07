import { deviceAPI } from "@/api"
import { areaRangesIp, deviceUpdateRanges } from "@/atoms/appDataAtom"
import { areasTableHead, poolMockTableHead } from "@/blocks/Devices/data"
import { getAreaTableData, getLogTableData, getPoolMockTableData } from "@/blocks/Devices/helpers"
import { Table } from "@/components"
import TestTable from "@/components/Table/TestTable"
import { IconEdit2, IconTrash } from "@/icons"
import RangesEditModal from "@/modals/Areas"
import Alert from "@/modals/Areas/Alert"
import PoolMockEditModal from "@/modals/PoolSettings/PoolMock"
import { DropdownItemI } from "@/ui/Dropdown/Dropdown"
import { useAtom } from "jotai"
import { useSnackbar } from "notistack"
import { useMemo, useState } from "react"
import styles from "./Table.module.scss"

const PoolMockTable = ({rows, onDeleteDevie, setAreas}: any) => {
    const [currentRow, setCurrentRow] = useState(rows)
    const [modalUpdateRanges, setModelUpdateRanges] = useAtom(deviceUpdateRanges)
    const [alertMessage, setAlertMessage]= useState(false)
    const [currentRange, setCurrentRange] = useState<any>(undefined)
    const [rangesIp, setRangesIp] = useAtom(areaRangesIp)
    const {enqueueSnackbar} = useSnackbar()
    const tableData = useMemo(() => {
        return {
          columns: poolMockTableHead,
          rows: getPoolMockTableData(rows)
        }
    }, [rows, currentRange])

    const handleAlertClick = (id?: string) => {
        setAlertMessage(true)
        if(id) {
            setRangesIp(id)
        }
    }

    const handleDeleteClick = () => {
        if(rangesIp) {
            deviceAPI.deletePoolMockById(rangesIp).then(res => {
                setCurrentRow((prevState: any) => prevState.filter((item: any) => item.id !== rangesIp))
                deviceAPI.getDevicesPoolMocks({
                    limit: 999,
                    order: {
                        name: "ASC"
                    }
                }).then(res => {
                    setAreas(res.rows)
                    setAlertMessage(false)
                    enqueueSnackbar("Диапазон успешно удалён", {
                        variant: "success",
                        autoHideDuration: 3000
                    })
                }).catch(err => console.error(err))
            })
        }
    }

    const handleEditClick = (id?: string) => {
        setCurrentRange(() => rows.find((item: any) => item.id === id))
        setModelUpdateRanges(true);
    }
    
    const tableDropDownItems: DropdownItemI[] = [
        {
            text: 'Редактировать',
            icon: <IconEdit2 width={20} height={20} />,
            onClick: handleEditClick
        },
        {
            text: 'Удалить',
            icon: <IconTrash width={20} height={20} />,
            onClick: handleAlertClick,
            mod: 'red'
        }
      ]
    return <div>
    {modalUpdateRanges && currentRange && <PoolMockEditModal setAreas={setAreas} state={currentRange.id} onClose={() => setModelUpdateRanges(false)} /> }
    {alertMessage && <Alert title={"Удаление шаблона пулов"} content={"Вы уверены что хотите удалить шаблон?"} open={alertMessage} setOpen={setAlertMessage} handleDeleteClick={handleDeleteClick} />}
        {/* <Table 
            {...tableData}
            dropdownItems={tableDropDownItems}
            required={false}
            reqSort={true}
            className={styles.containerUser}
        /> */}
        <TestTable 
            {...tableData}
            required={true}
            dropdownItems={tableDropDownItems}
            reqSort={true}
            className={styles.containerUser}
        />
    </div>
}

export default PoolMockTable