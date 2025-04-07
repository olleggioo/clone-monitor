import React, {FC, useState} from "react"
import styles from "./Dialog.module.scss"
import { Dashboard, Dialog, Table } from "@/components"
import DialogArea from "./DialogArea"
import { TableHeadCellI } from "@/components/Table/Table"
import { Button } from "@/ui"
import { useRouter } from "next/router"
import { deviceAPI } from "@/api"
import { getDevicesStatuseTableData } from "@/blocks/Statistics/helpers"
import { useAtom } from "jotai"
import { statsFilterAtom } from "@/atoms/statsAtom"

const DialogMain: FC<{id: string, asisX: number, asisY: number, name: string, onClose: () => void}> = ({
    id,
    asisX,
    asisY,
    name,
    onClose
}) => {
    const [_, setFilterState] = useAtom(statsFilterAtom)
    const router = useRouter()
    const [rows, setRows] = useState<any[]>([])
    const [statusCounts, setStatusCounts] = React.useState<{
        count: number
        name: string
        id: string
        description: string
    }[]>([]);

    React.useEffect(() => {
        deviceAPI.getDevicesStatus()
        .then((res: any) => {
            const promises = res.rows.map((row: any) => {
                return deviceAPI.getDevicesStatusCount({ where: { statusId: row.id, areaId: id } });
            });

            Promise.all(promises)
                .then((counts) => {
                    const updatedStatusCounts: any = [];

                    counts.forEach((count, index) => {
                        updatedStatusCounts[index] = {
                            count: count.total,
                            name: res.rows[index].name,
                            color: res.rows[index].color,
                            id: res.rows[index].id
                        }
                    });

                    setStatusCounts(updatedStatusCounts);
                })
                .catch((error) => {
                    console.error(error)
                });
        })
    }, [id])

    const onClick = () => {
        setFilterState((prevState: any) => {
            return {
                ...prevState,
                area: id
            }
        })
        router.push("/statistics")
    }

    const columns: TableHeadCellI[] = [
        {
          title: 'Статус',
          accessor: 'status'
        },
        {
          title: 'Устройства',
          accessor: 'devices',
          align: 'right'
        }
    ]

    return (
        <DialogArea title={name} onClose={onClose} style={{
            top: `${asisY - 455}px`,
            left: `${asisX - 50}px`
        }} closeBtn>
            <Table columns={columns} rows={getDevicesStatuseTableData(statusCounts, () => {})} />
            <Button className={styles.btn} onClick={onClick}>Подробнее</Button>
        </DialogArea>
    )
}

export default DialogMain