import { deviceAPI, logListAPI, userAPI } from "@/api"
import { devicesDataAtom } from "@/atoms/appDataAtom"
import { Loader } from "@/components"
import EmptyWrapper from "@/containers/EmptyWrapper"
import UserContainer from "@/containers/User"
import { hasAccess } from "@/helpers/AccessControl"
import { requestsAccessMap } from "@/helpers/componentAccessMap"
import withAuth from "@/hoc/withAuth"
import { useAtom } from "jotai"
import { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"

const UserPage: NextPage = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any>()

    const [datas, setDatas] = useAtom(devicesDataAtom);

    useEffect(() => {
        userAPI.getUsers({
            limit: 999,
            select: {
              id: true,
              fullname: true,
              login: true,
              contract: true
            },
            where: {
              roleId: "b3c5ce0e-884d-11ee-932b-300505de684f"
            }
        })
            .then((res) => {
                setDatas((prevState: any) => {
                    return {
                        ...prevState,
                        users: res.rows
                    }
                })
            })
            .catch(err => console.error(err))
    }, [])

    const id = (router.query.id as string) || undefined;
    useEffect(() => {
        if(hasAccess(requestsAccessMap.getUserId)) {

            if(id) {
                userAPI.getUserId(id, {
                    relations: {
                        userDevices: true,
                        role: true
                    },
                    select: {
                        id: true,
                        email: true,
                        fullname: true,
                        login: true,
                        password: true,
                        phone: true,
                        role: true,
                        roleId: true,
                        userDevices: {
                          id: true,
                          deviceId: true
                        },
                        contract: true
                    },
                })
                .then((res) => {
                    setData(res)
                }).catch(err => console.error(err))
                .finally(() => {
                    setLoading(false)
                })
            }
        } else {
            setLoading(false    )
        }
    }, [id])

    const roleId = localStorage.getItem(`${process.env.API_URL}_role`)

    return loading ? (
        <Loader />
    ) : (
        <>
            <Head>
                <title>{'Пользователь'}</title>
            </Head>
            {hasAccess(requestsAccessMap.getUserId)
                ? <UserContainer {...data} />
                : <div>
                <EmptyWrapper />
            </div>
            }
            {/* {(roleId === process.env.ROLE_ROOT_ID || roleId === process.env.ROLE_MANAGER_ID) 
                && <UserContainer {...data} />
            } */}
        </>
    )
}

export default withAuth(UserPage)