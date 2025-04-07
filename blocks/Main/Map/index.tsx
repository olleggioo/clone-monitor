import { Dashboard } from "@/components";
import styles from "./Map.module.scss"
import Point from "../Point";
import { useEffect, useState } from "react";
import { deviceAPI } from "@/api";

const Map = () => {
    const [points, setPoints] = useState([
        {
            asisX: 636,
            asisY: 570
        },
        {
            asisX: 480,
            asisY: 550
        },
        {
            asisX: 530,
            asisY: 520
        },
        {
            asisX: 72,
            asisY: 529,
        },
        {
            asisX: 90,
            asisY: 520,
        }
    ])
    useEffect(() => {
        deviceAPI.getDevicesArea()
            .then((res: any) => {
                const data = res.rows
                setPoints((prevState: any) => prevState.map((item: any, index: number) => ({...item, ...data[index]})))
            })
    }, [])

    return (
        <Dashboard title="Карта">
            <div className={styles.map}>
                {points.map((item: any, key: any) => 
                    (
                        <Point 
                            key={key}
                            {...item}
                        />
                    )
                )}
            </div>
        </Dashboard>
    )
}

export default Map;