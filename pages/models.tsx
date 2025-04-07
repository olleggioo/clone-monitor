import ModelsContainer from "@/containers/Models"
import withAuth from "@/hoc/withAuth"
import { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect } from "react"

const Models: NextPage = () => {
    const roleId = localStorage.getItem(`${process.env.API_URL}_role`)
    const router = useRouter();
    
    useEffect(() => {
        if(roleId !== process.env.ROLE_ROOT_ID && roleId !== process.env.ROLE_MANAGER_ID) {
          router.push("/statistics")
        }
    }, [roleId])

    return (
        <>
            <Head>
                <title>Статистика</title>
            </Head>
            {roleId === process.env.ROLE_ROOT_ID || roleId === process.env.ROLE_MANAGER_ID 
                ? <ModelsContainer /> 
                : <></>
            }
        </>
      )
}

export default withAuth(Models)