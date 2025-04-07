import React, { FC } from 'react'
import { useRouter } from 'next/router'
import { StatCard } from '@/components'
import { deviceAPI } from '@/api'
import { IconError, IconInfo, IconNormal } from '@/icons'
import styles from "./AreaStatuses.module.scss"

const iconStatus = [
    {
        icon:  <IconNormal width={20} height={20} />
    },
    {
        icon:  <IconError width={20} height={20} />
    },
    {
        icon:  <IconInfo width={20} height={20} />
    },
    {
        icon:  <IconInfo width={20} height={20} />
    },
    {
        icon:  <IconInfo width={20} height={20} />
    },
]

const AreaStatuses = () => {
    const router = useRouter()
    const [data, setData] = React.useState<any[]>([])
    const [statusCounts, setStatusCounts] = React.useState<{
        count: number
        name: string
        id: string
        icon: JSX.Element
    }[]>([]);

    React.useEffect(() => {
        deviceAPI.getDevicesStatus()
            .then((res: any) => {
                const promises = res.rows.map((row: any) => {
                    return deviceAPI.getDevicesStatusCount({ where: { statusId: row.id } });
                });

                Promise.all(promises)
                    .then((counts) => {
                        const updatedStatusCounts: any = [];
                        
                        counts.forEach((count, index) => {
                            updatedStatusCounts[index] = {
                                count: count.total,
                                name: res.rows[index].name,
                                icon: iconStatus[index].icon,
                                id: res.rows[index].id
                            }
                        });

                        setStatusCounts(updatedStatusCounts);
                    })
                    .catch((error) => {
                        console.error(error)
                    });
            })
    }, [])

    const errorCount = statusCounts && statusCounts.find(
        (item) => item.name === 'Error'
      )?.count || 0;
      
      const warningCount = statusCounts && statusCounts.find(
        (item) => item.name === 'Warning'
      )?.count || 0;

    return (
        <div className={styles.list}>
            {statusCounts && statusCounts.filter((item: any) => item.name !== "Not configured" && item.name !== "Error" && item.name !== "Warning").map((item: any, key: any) => {
                return <StatCard 
                    key={item.id}
                    title={item.name}
                    value={item.count}
                    unit={"Шт"}
                    icon={item.icon}
                />
            })}
            <StatCard
                key="error-warning"
                title="Error + Warning"
                value={String(errorCount + warningCount)}
                unit="Шт"
                icon={<IconError width={20} height={20} />}
            />
            <StatCard 
                title={"Всего устройств"}
                value={String(statusCounts && statusCounts.reduce((accamulator, currentValue) => accamulator + currentValue.count, 0))}
                unit={"шт."}
            />
        </div>
    )
}

export default AreaStatuses