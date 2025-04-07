import { Dialog } from "@/components";
import { FC, useEffect, useState } from "react";
import styles from "./PoolSettings.module.scss"
import { deviceAPI } from "@/api";
import Pools from "@/blocks/Devices/Pool";
import ReservePool from "@/blocks/Devices/Pool/ReservePool";

interface CommentsI {
    deviceId: string
    onClose: () => void
}


const PoolReserve: FC<CommentsI> = ({
    deviceId,
    onClose
}) => {
    const [poolData, setPoolData] = useState<any>(null)
    console.log("pooldata", poolData)
    useEffect(() => {
        deviceAPI.getDevicesPoolReserve({
            where: {
                deviceId
            },
            relations: {
                pool: true
            }
        }).then((res) => {
            setPoolData(res)
        }).catch(err => console.error(err))
    }, [deviceId])

    return <Dialog
        title="Резервные пулы"
        closeBtn
        onClose={onClose}
        className={styles.comment}
        wide
    >
        {poolData !== null && poolData.rows && poolData.rows.length !== 0 
            ? <ReservePool data={poolData.rows} />
            : <span>Резервных пулов нет</span>
        }
        {/* <div>
            {commentData && commentData.rows && commentData.rows.length !== 0 && commentData.rows.map((item: CommentInI) => {
                return <div key={item.id} className={styles.commentBox}>
                    <span>{userList.filter((user: any) => user.id === item.userId)[0]?.fullname}</span>
                    <span>{item.message}</span>
                    <span>{moment(item.createdAt).format('YYYY.MM.DD, HH:mm')}</span>
                </div>
            })}
        </div> */}
       
  </Dialog>
}

export default PoolReserve;