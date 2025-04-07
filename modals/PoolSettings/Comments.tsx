import { Dialog } from "@/components";
import { FC, useEffect, useState } from "react";
import styles from "./PoolSettings.module.scss"
import { deviceAPI } from "@/api";
import { useAtom } from "jotai";
import { userAtom, usersAtom } from "@/atoms";
import moment from "moment";
import TestTable from "@/components/Table/TestTable";
import { getCommentTableData } from "@/blocks/Devices/helpers";
import CommentTable from "@/blocks/Devices/Comment/CommentTable";
import { Button, Field } from "@/ui";
import { isEqual } from "lodash";
import { atomDataDevice } from "@/atoms/statsAtom";
import { hasAccess } from "@/helpers/AccessControl";
import { requestsAccessMap } from "@/helpers/componentAccessMap";

interface CommentsI {
    id: string
    onClose: () => void
}

interface CommentInI {
    createdAt: string
    updatedAt: string
    id: string
    message: string
    deviceId: string
    userId: string
}

interface CommentsDataI {
    rows: CommentInI[]
    total: number
}

const Comments: FC<CommentsI> = ({
    id,
    onClose
}) => {
    const [data, setData] = useAtom(atomDataDevice)
    const [commentData, setCommentData] = useState<CommentsDataI | null>(null)
    const [userList, setUserList] = useAtom(usersAtom)
    const [inputComment, setInputComment] = useState("")

    useEffect(() => {
        if(hasAccess(requestsAccessMap.getComments)) {
            let intervalId: NodeJS.Timeout;
            const refresh = () => {
                // setLoading(true)
                deviceAPI.getComments({
                    where: {
                        deviceId: id
                    },
                    order: {
                        createdAt: "DESC"
                    }
                }).then((res) => {
                    if(!isEqual(res, commentData)) {
                        setCommentData(res)
                    }
                  }).catch((err: any) => {
                    console.error(err)
                })
            }
    
            if (id) {
                refresh();
                intervalId = setInterval(refresh, 5000);
            }
    
            return () => {
                clearInterval(intervalId); 
            };
        }
    }, [id, setCommentData])

    // useEffect(() => {
    //     deviceAPI.getComments({
    //         where: {
    //             deviceId: id
    //         },
    //         order: {
    //             createdAt: "DESC"
    //         }
    //     }).then(setCommentData)
    //     .catch(err => console.error(err))
    // }, [id, setCommentData])

    const commentSubmit = () => {
        deviceAPI.createComment({
            deviceId: id,
            message: inputComment
        }).then((res) => {
            deviceAPI.getComments({
                where: {
                    deviceId: id
                },
                order: {
                    createdAt: "DESC"
                }
            }).then(setCommentData)
            .then(() => {
                deviceAPI.getComments({
                    where: {
                        deviceId: id
                    },
                    order: {
                        createdAt: "DESC"
                    }
                }).then((res) => {
                    setData((prevState: any) => {
                        return {
                            ...prevState,
                            deviceComments: res.rows
                        }
                    })
                }).catch(err => console.error(err))
            })
            .catch(err => console.error(err))
        }).catch(err => console.error(err))
    }

    return <Dialog
        title="Комментарии к устройству"
        closeBtn
        onClose={onClose}
        className={styles.comment}
        wide
    >
        {/* <div>
            {commentData && commentData.rows && commentData.rows.length !== 0 && commentData.rows.map((item: CommentInI) => {
                return <div key={item.id} className={styles.commentBox}>
                    <span>{userList.filter((user: any) => user.id === item.userId)[0]?.fullname}</span>
                    <span>{item.message}</span>
                    <span>{moment(item.createdAt).format('YYYY.MM.DD, HH:mm')}</span>
                </div>
            })}
        </div> */}
        {commentData && commentData.rows.length !== 0 && <CommentTable rows={commentData.rows} />}
        
        {hasAccess(requestsAccessMap.createComment) && <>
            <Field 
                placeholder="Комментарий"
                value={inputComment}
                onChange={(evt: any) => setInputComment(evt.target.value)}
            />
            <Button 
                title="Добавить"
                disabled={inputComment.length === 0}
                onClick={commentSubmit}
            />
        </>}
  </Dialog>
}

export default Comments;