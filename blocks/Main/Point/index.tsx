import {FC, useState} from "react"
import styles from "./Point.module.scss"
import DialogMain from "../Dialog";

const Point: FC<{id: string, name: string, asisX: number, asisY: number}> = ({id, name, asisX, asisY}) => {
    const [isOpenDialog, setIsOpenDialog] = useState(false)
    
    const handleMapHoverOver = (event: any) => {
        setIsOpenDialog(true)
    };

    return (
        <>
            <div className={styles.group} style={{
                top: `${(asisY / 1100) * 100}%`,
                left: `${(asisX / 1500) * 100}%`,
            }}>
                <div className={styles.point} onClick={handleMapHoverOver}></div>
                <div className={styles.town}>{name}</div>
            </div>
            {isOpenDialog && <DialogMain id={id} asisX={asisX} asisY={asisY} name={name} onClose={() => setIsOpenDialog(false)} />}
        </>
    )
}

export default Point