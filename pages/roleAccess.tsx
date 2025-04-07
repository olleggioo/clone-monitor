import PoolsContainer from "@/containers/Pools";
import withAuth from "@/hoc/withAuth";
import { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { redirect, useRouter } from 'next/navigation'
import RoleAccessContainer from "@/containers/RoleAccess";
import EmptyWrapper from "@/containers/EmptyWrapper";

const RoleAccess: NextPage = () => {
    
    const roleId = localStorage.getItem(`${process.env.API_URL}_role`)
    const router = useRouter();
    useEffect(() => {
        if(roleId !== process.env.ROLE_ROOT_ID) {
            router.push("/statistics")
        }
    }, [roleId])
    
    return (
        <> 
            <Head>
                Role Access
            </Head>
            {roleId === process.env.ROLE_ROOT_ID
                ? <RoleAccessContainer />
                : <div>
                <EmptyWrapper />
            </div>
            }
            {/* <RoleAccessContainer /> */}
        </>
    )
}

export default withAuth(RoleAccess)