import PoolsContainer from "@/containers/Pools";
import withAuth from "@/hoc/withAuth";
import { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { redirect, useRouter } from 'next/navigation'
import RoleAccessContainer from "@/containers/RoleAccess";
import CurrentRoleAccessContainer from "@/containers/CurrentRoleAccessContainer";

const CurrentRoleAccess: NextPage = () => {
    
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
                Текущий role-access
            </Head>
            <CurrentRoleAccessContainer />
        </>
    )
}

export default withAuth(CurrentRoleAccess)