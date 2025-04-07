import { AreasContainer } from '@/containers'
import Head from 'next/head'
import { NextPage } from 'next'
import withAuth from '@/hoc/withAuth'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import AreasContainerManager from '@/containers/Areas/AreaContainerManager'
import { hasAccess } from '@/helpers/AccessControl'
import { requestsAccessMap } from '@/helpers/componentAccessMap'
import EmptyWrapper from '@/containers/EmptyWrapper'

const Areas: NextPage = () => {
  const roleId = localStorage.getItem(`${process.env.API_URL}_role`)
  const router = useRouter();
  // useEffect(() => {
  //     if(roleId !== process.env.ROLE_ROOT_ID && roleId !== process.env.ROLE_MANAGER_ID) {
  //       router.push("/statistics")
  //     }
  // }, [roleId])
  return (
    <>
      <Head>
        <title>Статистика</title>
      </Head>
      {hasAccess(requestsAccessMap.getDevicesArea)
        ? <AreasContainer />
        : <div>
        <EmptyWrapper />
      </div>
      }
      {/* {roleId === process.env.ROLE_ROOT_ID && <AreasContainer />} */}
      {/* {roleId === process.env.ROLE_MANAGER_ID ? <AreasContainerManager /> : <AreasContainer />} */}
    </>
  )
}

export default withAuth(Areas)
