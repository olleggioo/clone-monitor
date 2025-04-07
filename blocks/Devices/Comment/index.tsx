import { Dashboard } from "@/components";
import styles from "./Comment.module.scss"
import { FC } from "react";
import moment from "moment";
import { Button } from "@/ui";

interface CommentI {
    id: string
    deviceId: string
    userId: string
    message: string
    createdAt: string
    updatedAt: string
}

const Comment: FC<{deviceComments: CommentI[], setModalComment: any}> = ({
   deviceComments,
   setModalComment
}) => {
    
    return <Dashboard title="Комментарии" className={styles.el}>
            {deviceComments && deviceComments.length !== 0
                ? <div className={styles.wrapper}>
                    <div className={styles.flex}>
                        <span className={styles.last}>Last</span>
                        <span className={styles.date}>{moment(deviceComments.sort((a: any, b: any) => {
                            let dateA: any = new Date(a.createdAt)
                            let dateB: any = new Date(b.createdAt)

                            return dateB - dateA
                        })[0].createdAt).format('YYYY.MM.DD, HH:mm')}</span>
                        <span className={styles.message}>{deviceComments[0].message}</span>
                    </div>
                    <Button 
                        title="Посмотреть"
                        onClick={() => setModalComment(true)}
                    />
                </div> 
                : <div className={styles.flex}>
                    <p>Комментариев нет</p>
                    <Button 
                        title="Посмотреть"
                        onClick={() => setModalComment(true)}
                    />
                </div>
            }
    </Dashboard>
}

export default Comment;