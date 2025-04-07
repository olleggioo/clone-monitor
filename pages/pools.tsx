import PoolsContainer from "@/containers/Pools";
import withAuth from "@/hoc/withAuth";
import { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { redirect, useRouter } from 'next/navigation'
import { hasAccess } from "@/helpers/AccessControl";
import { requestsAccessMap } from "@/helpers/componentAccessMap";
import EmptyWrapper from "@/containers/EmptyWrapper";

const Pools: NextPage = () => {
    
    const roleId = localStorage.getItem(`${process.env.API_URL}_role`)
    const router = useRouter();
    // useEffect(() => {
    //     if(roleId !== process.env.ROLE_ROOT_ID && roleId !== process.env.ROLE_MANAGER_ID) {
    //         router.push("/statistics")
    //     }
    // }, [roleId])
    return (
        <> 
            <Head>
                Шаблоны пулов
            </Head>
            {hasAccess(requestsAccessMap.getDevicesPoolMocks)
                ? <PoolsContainer />
                : <div>
                <EmptyWrapper />
            </div>
            }
            {/* {roleId === process.env.ROLE_ROOT_ID && <PoolsContainer />}
            {roleId === process.env.ROLE_MANAGER_ID && <PoolsContainer />} */}
        </>
    )
}

export default withAuth(Pools)